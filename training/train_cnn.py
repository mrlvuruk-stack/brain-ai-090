"""
Production-Grade Custom Deep Residual CNN Model Training Engine.
Handles model compilation, real-time data generator augmentation, callback scheduling
(ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard, CSVLogger), loss/accuracy tracking,
confusion matrix plotting, ROC-AUC evaluation, and model serialization.
"""

from pathlib import Path
from typing import Dict, Any, Tuple, Optional
import numpy as np
import tensorflow as tf
from tensorflow.keras.callbacks import (
    EarlyStopping, ReduceLROnPlateau, ModelCheckpoint, TensorBoard, CSVLogger
)

from config.config import config, ModelConfig
from models.cnn_model import BrainTumorCNN
from dataset.dataset_loader import MRIDatasetLoader
from utils.logger import logger
from utils.metrics import MetricsCalculator, PerformanceMetrics
from utils.visualizer import ResultVisualizer

class CNNTrainer:
    """Trainer manager for Deep Learning CNN classifier."""

    def __init__(self, cfg: ModelConfig = config.model):
        self.cfg = cfg
        self.cnn_wrapper = BrainTumorCNN(cfg)

    def train(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: np.ndarray,
        y_val: np.ndarray,
        X_test: np.ndarray,
        y_test: np.ndarray
    ) -> Tuple[BrainTumorCNN, PerformanceMetrics, Dict[str, Any]]:
        """
        Executes complete CNN model training workflow.
        """
        logger.info("Initializing custom Deep Residual CNN architecture...")
        model = self.cnn_wrapper.build_model()

        # Normalize pixel intensities to float range [0.0, 1.0]
        X_train_norm = X_train.astype(np.float32) / 255.0
        X_val_norm = X_val.astype(np.float32) / 255.0
        X_test_norm = X_test.astype(np.float32) / 255.0

        # Setup Training Callbacks
        checkpoint_path = config.paths.saved_models_dir / self.cfg.cnn_model_filename
        tensorboard_dir = config.paths.logs_dir / "tensorboard_cnn"
        csv_log_path = config.paths.logs_dir / "cnn_training_log.csv"

        checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
        tensorboard_dir.mkdir(parents=True, exist_ok=True)

        callbacks = [
            ModelCheckpoint(
                filepath=str(checkpoint_path),
                monitor="val_accuracy",
                save_best_only=True,
                mode="max",
                verbose=1
            ),
            EarlyStopping(
                monitor="val_loss",
                patience=self.cfg.patience_early_stopping,
                restore_best_weights=True,
                verbose=1
            ),
            ReduceLROnPlateau(
                monitor="val_loss",
                factor=0.5,
                patience=self.cfg.patience_reduce_lr,
                min_lr=self.cfg.min_lr,
                verbose=1
            ),
            TensorBoard(log_dir=str(tensorboard_dir), histogram_freq=1),
            CSVLogger(filename=str(csv_log_path), append=True)
        ]

        # Configure real-time data augmentation for training generator
        datagen = MRIDatasetLoader.get_data_augmentor()
        datagen.fit(X_train_norm)

        logger.info(
            f"Starting Deep CNN training for {self.cfg.epochs} epochs "
            f"with batch size {self.cfg.batch_size}..."
        )

        history = model.fit(
            datagen.flow(X_train_norm, y_train, batch_size=self.cfg.batch_size),
            steps_per_epoch=max(1, len(X_train) // self.cfg.batch_size),
            epochs=self.cfg.epochs,
            validation_data=(X_val_norm, y_val),
            callbacks=callbacks,
            verbose=1
        )

        logger.info("CNN training completed. Evaluating performance on test set...")

        # Predict probabilities on test set
        y_prob = model.predict(X_test_norm, verbose=0)
        y_pred = np.argmax(y_prob, axis=1)
        y_prob_positive = y_prob[:, 1]

        metrics = MetricsCalculator.evaluate(y_test, y_pred, y_prob_positive)

        # Plot & Save Training History Graph
        history_dict = history.history
        plot_path = config.paths.outputs_dir / "cnn_training_history.png"
        ResultVisualizer.plot_training_history(history_dict, save_path=plot_path)

        # Plot & Save Confusion Matrix
        cm_path = config.paths.outputs_dir / "cnn_confusion_matrix.png"
        ResultVisualizer.plot_confusion_matrix(
            metrics.confusion_matrix, title="CNN Test Confusion Matrix", save_path=cm_path
        )

        # Plot & Save ROC Curve
        roc_path = config.paths.outputs_dir / "cnn_roc_curve.png"
        ResultVisualizer.plot_roc_curve(
            {"Deep CNN Classifier": metrics}, title="CNN ROC Curve Analysis", save_path=roc_path
        )

        # Save Final Model
        self.cnn_wrapper.save(checkpoint_path)

        logger.info(
            f"CNN Model Training Finished. Test Accuracy: {metrics.accuracy*100:.2f}%, "
            f"Sensitivity: {metrics.recall*100:.2f}%, Specificity: {metrics.specificity*100:.2f}%, "
            f"F1-Score: {metrics.f1_score*100:.2f}%, ROC-AUC: {metrics.roc_auc:.4f}."
        )

        return self.cnn_wrapper, metrics, history_dict
