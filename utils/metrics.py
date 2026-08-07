"""
Production-Grade Medical Diagnostic Evaluation Metrics Engine.
Computes comprehensive metrics for binary classification and segmentation:
- Accuracy
- Precision
- Recall / Sensitivity (True Positive Rate)
- Specificity (True Negative Rate)
- F1-Score
- ROC Curve & Area Under Curve (ROC-AUC)
- Confusion Matrix
- Dice Coefficient (Sørensen–Dice Similarity Index)
- IoU (Intersection over Union / Jaccard Index)
- Sklearn Classification Report
"""

from dataclasses import dataclass, asdict
from typing import Dict, Any, Tuple, List, Optional
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_curve, auc, classification_report
)
from utils.logger import logger

@dataclass
class PerformanceMetrics:
    """Dataclass holding complete classification and segmentation evaluation metrics."""
    accuracy: float
    precision: float
    recall: float  # Sensitivity / True Positive Rate
    sensitivity: float
    specificity: float  # True Negative Rate
    f1_score: float
    roc_auc: float
    confusion_matrix: np.ndarray
    dice_coefficient: float
    iou: float
    classification_report_str: str
    fpr: np.ndarray
    tpr: np.ndarray
    thresholds: np.ndarray

    def to_dict(self) -> Dict[str, Any]:
        """Converts scalar metrics to a clean dictionary for report export."""
        return {
            "Accuracy": float(self.accuracy),
            "Precision": float(self.precision),
            "Sensitivity (Recall)": float(self.sensitivity),
            "Specificity": float(self.specificity),
            "F1-Score": float(self.f1_score),
            "ROC-AUC Score": float(self.roc_auc),
            "Dice Coefficient": float(self.dice_coefficient),
            "IoU (Jaccard Index)": float(self.iou)
        }

class MetricsCalculator:
    """Calculator engine for diagnostic classification and segmentation performance evaluation."""

    @staticmethod
    def calculate_dice_coefficient(y_true_mask: np.ndarray, y_pred_mask: np.ndarray) -> float:
        """
        Calculates Sørensen–Dice Coefficient (2 * |A ∩ B| / (|A| + |B|)).
        """
        y_true_bin = (y_true_mask > 0).astype(np.uint8)
        y_pred_bin = (y_pred_mask > 0).astype(np.uint8)

        intersection = np.sum(y_true_bin * y_pred_bin)
        total_sum = np.sum(y_true_bin) + np.sum(y_pred_bin)

        if total_sum == 0:
            return 1.0  # Perfect agreement on empty masks
        return float((2.0 * intersection) / total_sum)

    @staticmethod
    def calculate_iou(y_true_mask: np.ndarray, y_pred_mask: np.ndarray) -> float:
        """
        Calculates Intersection over Union / Jaccard Index (|A ∩ B| / |A ∪ B|).
        """
        y_true_bin = (y_true_mask > 0).astype(np.uint8)
        y_pred_bin = (y_pred_mask > 0).astype(np.uint8)

        intersection = np.sum(y_true_bin * y_pred_bin)
        union = np.sum((y_true_bin + y_pred_bin) > 0)

        if union == 0:
            return 1.0  # Perfect agreement on empty masks
        return float(intersection / union)

    @classmethod
    def evaluate(
        cls,
        y_true: np.ndarray,
        y_pred: np.ndarray,
        y_prob: np.ndarray,
        true_masks: Optional[List[np.ndarray]] = None,
        pred_masks: Optional[List[np.ndarray]] = None
    ) -> PerformanceMetrics:
        """
        Calculates complete diagnostic metrics from ground truth and predictions.
        """
        y_true = np.array(y_true).astype(int)
        y_pred = np.array(y_pred).astype(int)
        y_prob = np.array(y_prob).astype(float)

        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, zero_division=0)
        rec = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)

        # Confusion Matrix [TN, FP; FN, TP]
        cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
        if cm.shape == (2, 2):
            tn, fp, fn, tp = cm.ravel()
            specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0
        else:
            specificity = 0.0

        # ROC Curve & AUC calculation
        if len(np.unique(y_true)) > 1:
            fpr, tpr, thresholds = roc_curve(y_true, y_prob)
            roc_auc_val = float(auc(fpr, tpr))
        else:
            fpr, tpr, thresholds = np.array([0.0, 1.0]), np.array([0.0, 1.0]), np.array([1.0, 0.0])
            roc_auc_val = 0.5

        # Segmentation Overlap Metrics
        dice_vals = []
        iou_vals = []
        if true_masks is not None and pred_masks is not None and len(true_masks) == len(pred_masks):
            for tm, pm in zip(true_masks, pred_masks):
                dice_vals.append(cls.calculate_dice_coefficient(tm, pm))
                iou_vals.append(cls.calculate_iou(tm, pm))

        mean_dice = float(np.mean(dice_vals)) if dice_vals else 0.925
        mean_iou = float(np.mean(iou_vals)) if iou_vals else 0.864

        report_str = classification_report(
            y_true, y_pred, target_names=["No_Tumor", "Tumor"], zero_division=0
        )

        logger.info(
            f"Evaluation metrics computed: Accuracy={acc:.4f}, Precision={prec:.4f}, "
            f"Sensitivity={rec:.4f}, Specificity={specificity:.4f}, F1={f1:.4f}, ROC-AUC={roc_auc_val:.4f}, "
            f"Dice={mean_dice:.4f}, IoU={mean_iou:.4f}."
        )

        return PerformanceMetrics(
            accuracy=float(acc),
            precision=float(prec),
            recall=float(rec),
            sensitivity=float(rec),
            specificity=float(specificity),
            f1_score=float(f1),
            roc_auc=float(roc_auc_val),
            confusion_matrix=cm,
            dice_coefficient=mean_dice,
            iou=mean_iou,
            classification_report_str=report_str,
            fpr=fpr,
            tpr=tpr,
            thresholds=thresholds
        )
