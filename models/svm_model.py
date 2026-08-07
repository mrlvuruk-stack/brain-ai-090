"""
Production-Grade Support Vector Machine (SVM) Classifier Pipeline.
Features:
- Scikit-Learn Pipeline integration with StandardScaler
- RBF, Linear, and Polynomial Kernel Support
- Calibrated Probability Estimation (`probability=True`)
- Stratified K-Fold Cross Validation with GridSearchCV Hyperparameter Optimization
- Feature Importance and Weight Coefficient Reporting
- Joblib Model & Scaler Serialization
"""

import joblib
from pathlib import Path
from typing import Dict, Any, Tuple, Optional, List, Union
import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from feature_extraction.feature_extractor import FeatureVector
from config.config import config, ModelConfig
from utils.logger import logger
from utils.exceptions import ModelError

class BrainTumorSVM:
    """Support Vector Machine Classifier with Scikit-Learn Pipeline and GridSearch Optimization."""

    def __init__(self, cfg: ModelConfig = config.model):
        self.cfg = cfg
        self.scaler = StandardScaler()
        self.model: Optional[SVC] = None
        self.pipeline: Optional[Pipeline] = None
        self.best_params: Dict[str, Any] = {}
        self.best_score: float = 0.0

    def fit_with_grid_search(
        self, X_train: np.ndarray, y_train: np.ndarray
    ) -> Tuple[SVC, Dict[str, Any]]:
        """
        Executes GridSearchCV over hyperparameter space across RBF, Linear, and Poly kernels.
        """
        logger.info("Executing SVM GridSearchCV hyperparameter optimization...")

        # Construct Pipeline: StandardScaler -> SVC
        pipe = Pipeline([
            ("scaler", StandardScaler()),
            ("svc", SVC(probability=True, random_state=42))
        ])

        param_grid = [
            {
                "svc__kernel": ["rbf"],
                "svc__C": [0.1, 1.0, 10.0, 50.0, 100.0],
                "svc__gamma": ["scale", "auto", 0.001, 0.01, 0.1]
            },
            {
                "svc__kernel": ["linear"],
                "svc__C": [0.1, 1.0, 10.0, 50.0]
            },
            {
                "svc__kernel": ["poly"],
                "svc__degree": [2, 3],
                "svc__C": [0.1, 1.0, 10.0],
                "svc__gamma": ["scale", "auto"]
            }
        ]

        cv = StratifiedKFold(n_splits=self.cfg.cv_folds, shuffle=True, random_state=42)
        grid = GridSearchCV(
            estimator=pipe,
            param_grid=param_grid,
            cv=cv,
            scoring="accuracy",
            n_jobs=-1,
            verbose=0
        )

        grid.fit(X_train, y_train)

        self.pipeline = grid.best_estimator_
        self.scaler = self.pipeline.named_steps["scaler"]
        self.model = self.pipeline.named_steps["svc"]
        self.best_params = grid.best_params_
        self.best_score = float(grid.best_score_)

        logger.info(f"SVM Grid Search completed. Best CV Accuracy: {self.best_score:.4f}. Best Params: {self.best_params}")
        return self.model, self.best_params

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predicts class labels (0: No_Tumor, 1: Tumor)."""
        if self.pipeline is None and self.model is None:
            raise ModelError("SVM model has not been trained or loaded.")
        if self.pipeline is not None:
            return self.pipeline.predict(X)
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Predicts calibrated class probability distributions."""
        if self.pipeline is None and self.model is None:
            raise ModelError("SVM model has not been trained or loaded.")
        if self.pipeline is not None:
            return self.pipeline.predict_proba(X)
        X_scaled = self.scaler.transform(X)
        return self.model.predict_proba(X_scaled)

    def get_feature_importance_report(self, feature_names: Optional[List[str]] = None) -> Dict[str, float]:
        """
        Generates feature importance dictionary based on linear kernel weights or absolute coefficient means.
        """
        if self.model is None:
            raise ModelError("SVM model not initialized.")

        if feature_names is None:
            feature_names = FeatureVector.get_feature_names()

        importance_dict: Dict[str, float] = {}

        if self.model.kernel == "linear" and hasattr(self.model, "coef_"):
            coefs = np.abs(self.model.coef_[0])
            total = np.sum(coefs) + 1e-12
            norm_coefs = coefs / total
            for name, score in zip(feature_names, norm_coefs):
                importance_dict[name] = float(score)
        else:
            # Equal proxy weights for non-linear RBF / Poly kernels
            score = 1.0 / len(feature_names) if feature_names else 0.0
            for name in feature_names:
                importance_dict[name] = float(score)

        return importance_dict

    def save(self, model_path: Union[str, Path], scaler_path: Optional[Union[str, Path]] = None) -> None:
        """Saves fitted SVM model and StandardScaler to disk."""
        if self.model is None:
            raise ModelError("Cannot save uninitialized SVM model.")

        m_path = Path(model_path)
        m_path.parent.mkdir(parents=True, exist_ok=True)

        if self.pipeline is not None:
            joblib.dump(self.pipeline, str(m_path))
            logger.info(f"Saved complete SVM Pipeline to {m_path}")
        else:
            joblib.dump(self.model, str(m_path))
            if scaler_path:
                s_path = Path(scaler_path)
                s_path.parent.mkdir(parents=True, exist_ok=True)
                joblib.dump(self.scaler, str(s_path))
            logger.info(f"Saved SVM model to {m_path}")

    def load(self, model_path: Union[str, Path], scaler_path: Optional[Union[str, Path]] = None) -> None:
        """Loads fitted SVM Pipeline or model and scaler from disk."""
        m_path = Path(model_path)
        if not m_path.exists():
            raise ModelError(f"SVM model file does not exist: {m_path}")

        loaded_obj = joblib.load(str(m_path))
        if isinstance(loaded_obj, Pipeline):
            self.pipeline = loaded_obj
            self.scaler = self.pipeline.named_steps["scaler"]
            self.model = self.pipeline.named_steps["svc"]
        else:
            self.model = loaded_obj
            if scaler_path and Path(scaler_path).exists():
                self.scaler = joblib.load(str(scaler_path))

        logger.info(f"Loaded SVM model successfully from {m_path}")
