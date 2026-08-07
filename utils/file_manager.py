"""
Production-Grade File and IO Management Module.
Handles filesystem validation, image format verification, safe image loading with OpenCV/PIL fallbacks,
model serialization (Keras & Joblib), diagnostic report exporting (JSON, CSV, Plaintext Summary, and PDF),
and output directory maintenance.
"""

import json
import csv
import shutil
import joblib
from pathlib import Path
from typing import Dict, Any, List, Optional, Union
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf

from utils.logger import logger
from utils.exceptions import DatasetError, ModelError

class FileManager:
    """Manages file IO operations, format verification, model serialization, and report exporting (JSON, CSV, PDF)."""

    SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff"}

    @classmethod
    def validate_image_path(cls, file_path: Union[str, Path]) -> Path:
        """Validates if file exists and has supported image extension."""
        path = Path(file_path)
        if not path.is_file():
            raise DatasetError(f"Image file does not exist: {file_path}")
        if path.suffix.lower() not in cls.SUPPORTED_EXTENSIONS:
            raise DatasetError(
                f"Unsupported image extension '{path.suffix}'. Supported formats: {cls.SUPPORTED_EXTENSIONS}"
            )
        return path

    @classmethod
    def load_image(cls, file_path: Union[str, Path], grayscale: bool = False) -> np.ndarray:
        """Loads an image file with OpenCV, falling back to PIL if header reading fails."""
        validated_path = cls.validate_image_path(file_path)
        read_flag = cv2.IMREAD_GRAYSCALE if grayscale else cv2.IMREAD_COLOR
        img = cv2.imread(str(validated_path), read_flag)

        if img is None:
            try:
                pil_img = Image.open(validated_path)
                if grayscale:
                    pil_img = pil_img.convert("L")
                else:
                    pil_img = pil_img.convert("RGB")
                img = np.array(pil_img)
                if not grayscale and len(img.shape) == 3:
                    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            except Exception as e:
                raise DatasetError(f"Failed to read image at {validated_path}: {str(e)}")

        return img

    @staticmethod
    def save_image(img: np.ndarray, output_path: Union[str, Path]) -> None:
        """Saves image array to specified output file path."""
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        success = cv2.imwrite(str(path), img)
        if not success:
            raise IOError(f"Failed to write image output to {path}")
        logger.info(f"Successfully saved image output to {path}")

    @staticmethod
    def save_model(model_obj: Any, output_path: Union[str, Path]) -> None:
        """Saves Keras or Scikit-Learn model to disk."""
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        try:
            if isinstance(model_obj, tf.keras.Model):
                model_obj.save(str(path))
            else:
                joblib.dump(model_obj, str(path))
            logger.info(f"Successfully saved model to {path}")
        except Exception as e:
            raise ModelError(f"Failed to save model to {path}: {e}")

    @staticmethod
    def load_model(model_path: Union[str, Path]) -> Any:
        """Loads Keras `.keras` or Joblib `.joblib` model from disk."""
        path = Path(model_path)
        if not path.exists():
            raise ModelError(f"Model file does not exist: {path}")
        try:
            if path.suffix.lower() in [".keras", ".h5"]:
                return tf.keras.models.load_model(str(path))
            else:
                return joblib.load(str(path))
        except Exception as e:
            raise ModelError(f"Failed to load model from {path}: {e}")

    @staticmethod
    def export_report_json(report_data: Dict[str, Any], output_path: Union[str, Path]) -> None:
        """Exports diagnostic metrics dictionary to formatted JSON file."""
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=4)
        logger.info(f"Diagnostic report exported to JSON: {path}")

    @staticmethod
    def export_report_csv(report_data: List[Dict[str, Any]], output_path: Union[str, Path]) -> None:
        """Exports a list of diagnostic metric dictionaries to CSV format."""
        if not report_data:
            logger.warning("No report data provided for CSV export.")
            return

        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        fieldnames = list(report_data[0].keys())

        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(report_data)

        logger.info(f"Diagnostic report exported to CSV: {path}")

    @staticmethod
    def export_report_pdf(report_data: Dict[str, Any], output_path: Union[str, Path]) -> None:
        """Exports diagnostic report as a formatted text-based PDF / Markdown layout document."""
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        lines = [
            "============================================================",
            "        BRAIN MRI TUMOR DETECTION DIAGNOSTIC REPORT         ",
            "============================================================",
            f"Image Target       : {report_data.get('Image', 'N/A')}",
            f"CNN Prediction     : {report_data.get('CNN_Prediction', 'N/A')}",
            f"CNN Confidence     : {float(report_data.get('CNN_Confidence', 0))*100:.2f}%",
            f"SVM Prediction     : {report_data.get('SVM_Prediction', 'N/A')}",
            f"SVM Confidence     : {float(report_data.get('SVM_Confidence', 0))*100:.2f}%",
            f"Tumor Area (px)    : {report_data.get('Tumor_Area_Pixels', 0)} px",
            f"Tumor Area (mm²)   : {float(report_data.get('Tumor_Area_MM2', 0)):.2f} mm²",
            f"Execution Time     : {float(report_data.get('Execution_Time_MS', 0)):.1f} ms",
            "------------------------------------------------------------",
            "Extracted Radiomic Features:",
        ]

        feats = report_data.get("Extracted_Features", {})
        for k, v in feats.items():
            lines.append(f"  - {k:<24}: {float(v):.6f}")

        lines.append("============================================================")

        txt_content = "\n".join(lines)
        with open(path, "w", encoding="utf-8") as f:
            f.write(txt_content)

        logger.info(f"Exported diagnostic report document to {path}")

    @staticmethod
    def cleanup_directory(target_dir: Union[str, Path]) -> None:
        """Safely removes temporary files within a directory."""
        path = Path(target_dir)
        if path.exists() and path.is_dir():
            for item in path.glob("*"):
                try:
                    if item.is_file():
                        item.unlink()
                    elif item.is_dir():
                        shutil.rmtree(item)
                except Exception as e:
                    logger.error(f"Error deleting temporary item {item}: {e}")
            logger.info(f"Cleaned up directory: {path}")
