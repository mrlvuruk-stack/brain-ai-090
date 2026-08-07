"""
Production-Grade Support Vector Machine (SVM) Training Engine.
Extracts 18+ radiomic descriptors (GLCM, 1st-Order Stats, Shape) from dataset images,
runs GridSearchCV hyperparameter optimization with Stratified K-Fold cross validation,
evaluates precision, recall, F1, specificity, ROC-AUC, and saves fitted models.
"""

from pathlib import Path
from typing import Tuple, Dict, Any, Optional
import numpy as np
from tqdm import tqdm
from config.config import config, ModelConfig
from models.svm_model import BrainTumorSVM
from preprocessing.enhancer import MRIImageEnhancer
from preprocessing.skull_stripper import SkullStripper
from segmentation.tumor_segmenter import MRITumorSegmenter
from feature_extraction.feature_extractor import MRIFeatureExtractor
from utils.logger import logger
from utils.metrics import MetricsCalculator, PerformanceMetrics
from utils.visualizer import ResultVisualizer

class SVMTrainer:
    """Trainer class managing dataset feature extraction, SVM grid search, and metrics evaluation."""

    def __init__(self, cfg: ModelConfig = config.model):
        self.cfg = cfg
        self.enhancer = MRIImageEnhancer()
        self.skull_stripper = SkullStripper()
        self.segmenter = MRITumorSegmenter()
        self.extractor = MRIFeatureExtractor()
        self.svm_wrapper = BrainTumorSVM(cfg)

    def extract_dataset_features(self, X_images: np.ndarray) -> np.ndarray:
        """
        Extracts 18+ radiomic feature vectors from an array of MRI images.
        """
        feature_vectors = []
        logger.info(f"Extracting radiomic features from {len(X_images)} MRI images...")

        for img in tqdm(X_images, desc="Extracting Features"):
            # 1. Novel Enhancement
            orig, enhanced, _, _ = self.enhancer.enhance_pipeline(img)
            # 2. Skull Stripping
            stripped, brain_mask, _ = self.skull_stripper.strip_skull(enhanced)
            # 3. Tumor Segmentation
            seg_res = self.segmenter.segmentation_pipeline(stripped, brain_mask=brain_mask, method="kmeans")
            # 4. Feature Extraction
            feats = self.extractor.extract(stripped, mask=seg_res.tumor_mask)
            feature_vectors.append(feats.to_vector())

        return np.array(feature_vectors, dtype=np.float32)

    def train(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_test: np.ndarray,
        y_test: np.ndarray
    ) -> Tuple[BrainTumorSVM, PerformanceMetrics]:
        """
        Extracts features, runs GridSearchCV with Stratified Cross Validation, evaluates test performance, and saves models.
        """
        logger.info("Starting SVM training pipeline...")

        # Feature Extraction Phase
        X_train_feats = self.extract_dataset_features(X_train)
        X_test_feats = self.extract_dataset_features(X_test)

        # GridSearchCV & Training Phase
        logger.info("Fitting SVM classifier with GridSearchCV and StandardScaler...")
        self.svm_wrapper.fit_with_grid_search(X_train_feats, y_train)

        # Evaluation Phase on Test Set
        y_pred = self.svm_wrapper.predict(X_test_feats)
        y_prob = self.svm_wrapper.predict_proba(X_test_feats)[:, 1]

        metrics = MetricsCalculator.evaluate(y_test, y_pred, y_prob)

        # Plot & Save Confusion Matrix
        cm_path = config.paths.outputs_dir / "svm_confusion_matrix.png"
        ResultVisualizer.plot_confusion_matrix(
            metrics.confusion_matrix, title="SVM Confusion Matrix", save_path=cm_path
        )

        # Plot & Save ROC Curve
        roc_path = config.paths.outputs_dir / "svm_roc_curve.png"
        ResultVisualizer.plot_roc_curve(
            {"SVM Classifier": metrics}, title="SVM ROC Curve Analysis", save_path=roc_path
        )

        # Save Model & Scaler
        model_path = config.paths.saved_models_dir / self.cfg.svm_model_filename
        scaler_path = config.paths.saved_models_dir / self.cfg.scaler_filename
        self.svm_wrapper.save(model_path, scaler_path)

        logger.info(
            f"SVM Training Completed. Test Accuracy: {metrics.accuracy*100:.2f}%, "
            f"Precision: {metrics.precision*100:.2f}%, Recall: {metrics.recall*100:.2f}%, "
            f"F1-Score: {metrics.f1_score*100:.2f}%, Specificity: {metrics.specificity*100:.2f}%, "
            f"ROC-AUC: {metrics.roc_auc:.4f}."
        )

        return self.svm_wrapper, metrics
