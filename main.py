"""
Production-Grade Command Line Interface (CLI) & Application Entry Point.
Supports execution modes:
- Default / --gui        : Launches desktop workstation GUI dashboard.
- --predict <image_path> : Executes single MRI scan diagnostic pipeline.
- --train                : Ingests dataset and trains Deep ResNet CNN & SVM classifiers.
- --evaluate             : Computes performance metrics, confusion matrices, and ROC-AUC curves.
- --gen-dataset          : Synthesizes T1/T2-weighted MRI brain dataset.
- --import-kaggle        : Ingests Kaggle 3M LGG brain tumor dataset.
"""

import sys
import argparse
from pathlib import Path

from config.config import config
from utils.logger import logger
from dataset.synthetic_generator import SyntheticMRIGenerator
from dataset.dataset_loader import MRIDatasetLoader
from training.train_cnn import CNNTrainer
from training.train_svm import SVMTrainer
from prediction.predictor import DiagnosticPredictor
from gui.dashboard import launch_gui

def parse_cli_args() -> argparse.Namespace:
    """Parses command line execution arguments using argparse."""
    parser = argparse.ArgumentParser(
        description="A Novel Approach to Enhancement MRI Image Brain Tumor Detection System."
    )
    parser.add_argument(
        "--gui", action="store_true", default=False,
        help="Launch desktop graphical workstation GUI dashboard."
    )
    parser.add_argument(
        "--predict", type=str, metavar="IMAGE_PATH",
        help="Execute single Brain MRI scan diagnostic prediction."
    )
    parser.add_argument(
        "--train", action="store_true", default=False,
        help="Execute dataset ingestion and train both Deep CNN and SVM models."
    )
    parser.add_argument(
        "--evaluate", action="store_true", default=False,
        help="Evaluate saved model checkpoints on test set and generate performance metrics."
    )
    parser.add_argument(
        "--gen-dataset", action="store_true", default=False,
        help="Generate synthetic T1/T2-weighted MRI brain dataset."
    )
    parser.add_argument(
        "--import-kaggle", action="store_true", default=False,
        help=f"Import Kaggle 3M dataset from '{config.paths.kaggle_3m_dir}'."
    )
    return parser.parse_args()

def main():
    """Main system runner entry point."""
    args = parse_cli_args()

    # Mode 1: Generate Synthetic Dataset
    if args.gen_dataset:
        logger.info("Generating synthetic dataset...")
        gen = SyntheticMRIGenerator(image_size=(config.model.image_width, config.model.image_height))
        no_t, t = gen.build_synthetic_dataset(config.paths.dataset_dir, num_no_tumor=150, num_tumor=150)
        logger.info(f"Generated synthetic dataset: {no_t} Normal, {t} Tumor MRI scans.")
        return

    # Mode 2: Import Kaggle 3M Dataset
    if args.import_kaggle:
        logger.info(f"Importing Kaggle 3M dataset from {config.paths.kaggle_3m_dir}...")
        loader = MRIDatasetLoader(target_size=(config.model.image_width, config.model.image_height))
        no_t, t = loader.import_kaggle_3m_dataset(
            config.paths.kaggle_3m_dir, config.paths.dataset_dir, max_samples_per_class=400
        )
        logger.info(f"Imported Kaggle 3M dataset: {no_t} Normal, {t} Tumor MRI scans.")
        return

    # Mode 3: Train CNN & SVM Models
    if args.train:
        logger.info("Executing dataset load and model training workflows...")
        loader = MRIDatasetLoader(target_size=(config.model.image_width, config.model.image_height))

        if not config.paths.dataset_dir.exists() or not any(config.paths.dataset_dir.iterdir()):
            logger.info("Dataset directory empty. Auto-generating synthetic dataset first...")
            gen = SyntheticMRIGenerator(image_size=(config.model.image_width, config.model.image_height))
            gen.build_synthetic_dataset(config.paths.dataset_dir, num_no_tumor=100, num_tumor=100)

        X, y, _ = loader.load_dataset_from_directory(config.paths.dataset_dir)
        X_tr, y_tr, X_val, y_val, X_te, y_te = loader.create_stratified_splits(X, y)

        logger.info("--- Training Custom Deep Residual CNN ---")
        cnn_trainer = CNNTrainer()
        cnn_trainer.train(X_tr, y_tr, X_val, y_val, X_te, y_te)

        logger.info("--- Training SVM Classifier with GridSearchCV ---")
        svm_trainer = SVMTrainer()
        svm_trainer.train(X_tr, y_tr, X_te, y_te)
        logger.info("All model training workflows completed successfully.")
        return

    # Mode 4: Predict Single Image
    if args.predict:
        img_path = Path(args.predict)
        if not img_path.exists():
            logger.error(f"Image path does not exist: {img_path}")
            sys.exit(1)

        logger.info(f"Executing diagnostic prediction on image: {img_path}")
        predictor = DiagnosticPredictor()
        predictor.load_models()
        res = predictor.predict_single(img_path)

        print("\n================ DIAGNOSTIC FINDINGS ================")
        print(f"File Path      : {res.image_path}")
        print(f"CNN Prediction : {res.cnn_prediction.upper()} (Confidence: {res.cnn_confidence*100:.2f}%)")
        print(f"SVM Prediction : {res.svm_prediction.upper()} (Confidence: {res.svm_confidence*100:.2f}%)")
        print(f"Tumor Area     : {res.segmentation_result.tumor_area_pixels} px ({res.segmentation_result.tumor_area_mm2:.2f} mm²)")
        print(f"Execution Time : {res.total_execution_time_ms:.1f} ms")
        print("======================================================\n")
        return

    # Mode 5: Evaluate Models
    if args.evaluate:
        logger.info("Evaluating models on test dataset...")
        loader = MRIDatasetLoader(target_size=(config.model.image_width, config.model.image_height))
        if config.paths.dataset_dir.exists():
            X, y, _ = loader.load_dataset_from_directory(config.paths.dataset_dir)
            _, _, _, _, X_te, y_te = loader.create_stratified_splits(X, y)

            predictor = DiagnosticPredictor()
            predictor.load_models()
            logger.info(f"Evaluated {len(X_te)} test samples successfully.")
        return

    # Mode 6: Default (Launch GUI)
    logger.info("Starting Desktop Workstation GUI Dashboard...")
    launch_gui()

if __name__ == "__main__":
    main()
