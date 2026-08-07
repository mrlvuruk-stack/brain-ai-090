"""
Production-Grade Medical Result Visualizer Subsystem.
Generates publication-quality charts, diagnostic figures, and comparison plots:
1. Multi-Stage MRI Enhancement Pipeline Comparison Grid Viewer
2. Receiver Operating Characteristic (ROC) & AUC Curves
3. Confusion Matrix Heatmaps
4. Radiomic Feature Importance Bar Charts
5. Pixel Intensity Histograms
6. Deep Learning Training & Validation Loss/Accuracy Curves
GUI-compatible using non-interactive and embedded Matplotlib figure targets.
"""

from typing import Dict, List, Optional, Tuple, Union
from pathlib import Path
import numpy as np
import cv2
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend safe for GUI threads and CLI rendering
import matplotlib.pyplot as plt
import seaborn as sns

from utils.logger import logger
from utils.metrics import PerformanceMetrics

class ResultVisualizer:
    """Master Result Visualization Processor for charts, heatmaps, and diagnostic plots."""

    @staticmethod
    def plot_enhancement_stages(
        stages: Dict[str, np.ndarray],
        save_path: Optional[Union[str, Path]] = None
    ) -> plt.Figure:
        """
        Plots multi-stage images from the novel enhancement pipeline.
        
        Args:
            stages: Dict mapping stage titles to numpy image arrays.
            save_path: Optional file path to save rendered figure.
        """
        n = len(stages)
        if n == 0:
            fig, ax = plt.subplots()
            ax.text(0.5, 0.5, "No Stages to Render", ha="center", va="center")
            return fig

        cols = min(n, 4)
        rows = int(np.ceil(n / cols))

        fig, axes = plt.subplots(rows, cols, figsize=(4 * cols, 4 * rows))
        if rows == 1 and cols == 1:
            axes = np.array([axes])
        axes = axes.flatten()

        for idx, (title, img) in enumerate(stages.items()):
            ax = axes[idx]
            if len(img.shape) == 3:
                ax.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
            else:
                ax.imshow(img, cmap="gray")
            ax.set_title(title, fontsize=10, fontweight="bold", pad=5)
            ax.axis("off")

        for idx in range(n, len(axes)):
            axes[idx].axis("off")

        plt.tight_layout()
        if save_path:
            p = Path(save_path)
            p.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(str(p), dpi=300, bbox_inches="tight")
            logger.info(f"Saved enhancement stages figure to {p}")
        return fig

    @staticmethod
    def plot_confusion_matrix(
        cm: np.ndarray,
        class_names: Optional[List[str]] = None,
        title: str = "Confusion Matrix",
        save_path: Optional[Union[str, Path]] = None
    ) -> plt.Figure:
        """
        Plots confusion matrix heatmap using Seaborn.
        """
        if class_names is None:
            class_names = ["No_Tumor", "Tumor"]

        fig, ax = plt.subplots(figsize=(6, 5))
        sns.heatmap(
            cm, annot=True, fmt="d", cmap="Blues", cbar=True,
            xticklabels=class_names, yticklabels=class_names, ax=ax,
            annot_kws={"size": 14, "weight": "bold"}
        )
        ax.set_title(title, fontsize=13, fontweight="bold")
        ax.set_xlabel("Predicted Label", fontsize=11, labelpad=8)
        ax.set_ylabel("True Label", fontsize=11, labelpad=8)
        plt.tight_layout()

        if save_path:
            p = Path(save_path)
            p.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(str(p), dpi=300, bbox_inches="tight")
            logger.info(f"Saved confusion matrix figure to {p}")
        return fig

    @staticmethod
    def plot_roc_curve(
        metrics_dict: Dict[str, PerformanceMetrics],
        title: str = "Receiver Operating Characteristic (ROC) Curve",
        save_path: Optional[Union[str, Path]] = None
    ) -> plt.Figure:
        """
        Plots comparative ROC Curves for multiple models (CNN vs SVM).
        """
        fig, ax = plt.subplots(figsize=(7, 6))

        for model_name, metrics in metrics_dict.items():
            ax.plot(
                metrics.fpr, metrics.tpr, lw=2.5,
                label=f"{model_name} (AUC = {metrics.roc_auc:.4f})"
            )

        ax.plot([0, 1], [0, 1], color="navy", lw=2, linestyle="--", label="Random Chance")
        ax.set_xlim([0.0, 1.0])
        ax.set_ylim([0.0, 1.05])
        ax.set_xlabel("False Positive Rate (1 - Specificity)", fontsize=11)
        ax.set_ylabel("True Positive Rate (Sensitivity)", fontsize=11)
        ax.set_title(title, fontsize=13, fontweight="bold")
        ax.legend(loc="lower right", fontsize=10)
        ax.grid(True, linestyle=":", alpha=0.6)
        plt.tight_layout()

        if save_path:
            p = Path(save_path)
            p.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(str(p), dpi=300, bbox_inches="tight")
            logger.info(f"Saved ROC curve figure to {p}")
        return fig

    @staticmethod
    def plot_feature_importance(
        importance_dict: Dict[str, float],
        top_n: int = 15,
        title: str = "Radiomic Feature Importance Ranking",
        save_path: Optional[Union[str, Path]] = None
    ) -> plt.Figure:
        """
        Plots horizontal bar chart ranking feature importance scores.
        """
        sorted_items = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)[:top_n]
        names = [item[0] for item in reversed(sorted_items)]
        scores = [item[1] for item in reversed(sorted_items)]

        fig, ax = plt.subplots(figsize=(8, 6))
        ax.barh(names, scores, color="#89b4fa", edgecolor="#11111b")
        ax.set_title(title, fontsize=12, fontweight="bold")
        ax.set_xlabel("Normalized Feature Importance Score", fontsize=10)
        ax.grid(True, linestyle=":", alpha=0.5, axis="x")
        plt.tight_layout()

        if save_path:
            p = Path(save_path)
            p.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(str(p), dpi=300, bbox_inches="tight")
            logger.info(f"Saved feature importance figure to {p}")
        return fig

    @staticmethod
    def plot_intensity_histogram(
        image: np.ndarray,
        title: str = "Pixel Intensity Distribution Histogram",
        save_path: Optional[Union[str, Path]] = None
    ) -> plt.Figure:
        """
        Plots pixel intensity histogram comparison before and after CLAHE enhancement.
        """
        fig, ax = plt.subplots(figsize=(7, 4))
        ax.hist(image.flatten(), bins=256, range=(0, 256), color="#a6e3a1", alpha=0.75, density=True)
        ax.set_title(title, fontsize=12, fontweight="bold")
        ax.set_xlabel("Pixel Intensity Value [0 - 255]", fontsize=10)
        ax.set_ylabel("Probability Density", fontsize=10)
        ax.grid(True, linestyle=":", alpha=0.5)
        plt.tight_layout()

        if save_path:
            p = Path(save_path)
            p.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(str(p), dpi=300, bbox_inches="tight")
            logger.info(f"Saved intensity histogram figure to {p}")
        return fig

    @staticmethod
    def plot_training_history(
        history_dict: Dict[str, List[float]],
        save_path: Optional[Union[str, Path]] = None
    ) -> plt.Figure:
        """
        Plots training and validation loss & accuracy curves for Keras training history.
        """
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

        # Accuracy Curve
        if "accuracy" in history_dict:
            ax1.plot(history_dict["accuracy"], label="Train Accuracy", lw=2)
        if "val_accuracy" in history_dict:
            ax1.plot(history_dict["val_accuracy"], label="Val Accuracy", lw=2)
        ax1.set_title("Model Accuracy", fontsize=12, fontweight="bold")
        ax1.set_xlabel("Epoch", fontsize=10)
        ax1.set_ylabel("Accuracy", fontsize=10)
        ax1.legend(loc="lower right")
        ax1.grid(True, linestyle=":", alpha=0.6)

        # Loss Curve
        if "loss" in history_dict:
            ax2.plot(history_dict["loss"], label="Train Loss", lw=2)
        if "val_loss" in history_dict:
            ax2.plot(history_dict["val_loss"], label="Val Loss", lw=2)
        ax2.set_title("Model Loss", fontsize=12, fontweight="bold")
        ax2.set_xlabel("Epoch", fontsize=10)
        ax2.set_ylabel("Loss", fontsize=10)
        ax2.legend(loc="upper right")
        ax2.grid(True, linestyle=":", alpha=0.6)

        plt.tight_layout()
        if save_path:
            p = Path(save_path)
            p.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(str(p), dpi=300, bbox_inches="tight")
            logger.info(f"Saved training history figure to {p}")
        return fig
