"""
Production-Grade Comprehensive Feature Extraction Engine.
Extracts 18+ radiomic descriptors:
- GLCM Second-Order Texture Features: Contrast, Correlation, Homogeneity, Energy, ASM, Entropy
- First-Order Pixel Intensity Statistics: Mean, Std Dev, Variance, Skewness, Kurtosis
- Geometric & Morphological Shape Features: Area, Perimeter, Circularity, Solidity, Aspect Ratio, Extent, Equivalent Diameter, Eccentricity
Supports single and batch feature extraction, dataclass vectorization, and CSV export.
"""

import csv
from dataclasses import dataclass, asdict, fields
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Union
import numpy as np
import cv2
from scipy.stats import skew, kurtosis
from feature_extraction.glcm_extractor import GLCMExtractor
from utils.logger import logger
from utils.exceptions import FeatureExtractionError

@dataclass
class FeatureVector:
    """Dataclass holding complete extracted radiomic feature descriptors."""
    # First-Order Intensity Statistics
    mean: float
    std: float
    variance: float
    skewness: float
    kurtosis: float
    
    # GLCM Second-Order Texture Features
    glcm_contrast: float
    glcm_correlation: float
    glcm_homogeneity: float
    glcm_energy: float
    glcm_asm: float
    glcm_entropy: float
    
    # Shape & Geometric Descriptors
    area: float
    perimeter: float
    circularity: float
    solidity: float
    aspect_ratio: float
    extent: float
    equivalent_diameter: float
    eccentricity: float = 0.0

    def to_vector(self) -> np.ndarray:
        """Converts structured feature vector into a 1D float32 NumPy array for machine learning models."""
        return np.array(list(asdict(self).values()), dtype=np.float32)

    def to_dict(self) -> Dict[str, float]:
        """Converts to descriptive dictionary mapping attribute names to float values."""
        return asdict(self)

    @classmethod
    def get_feature_names(cls) -> List[str]:
        """Returns ordered list of feature attribute names."""
        return [f.name for f in fields(cls)]

# Alias for backward compatibility
CombinedFeatures = FeatureVector

class MRIFeatureExtractor:
    """Master Feature Extraction Engine integrating GLCM, Intensity Statistics, and Geometry."""

    def __init__(self):
        self.glcm_extractor = GLCMExtractor()

    def compute_first_order_stats(self, image: np.ndarray, mask: Optional[np.ndarray] = None) -> Dict[str, float]:
        """Calculates pixel intensity statistical metrics (Mean, Std, Variance, Skewness, Kurtosis)."""
        if mask is not None and np.sum(mask) > 0:
            pixels = image[mask > 0].astype(np.float64)
        else:
            pixels = image.flatten().astype(np.float64)

        if len(pixels) == 0:
            return {"mean": 0.0, "std": 0.0, "variance": 0.0, "skewness": 0.0, "kurtosis": 0.0}

        mean_val = float(np.mean(pixels))
        std_val = float(np.std(pixels))
        var_val = float(np.var(pixels))
        skew_val = float(skew(pixels)) if len(pixels) > 2 else 0.0
        kurt_val = float(kurtosis(pixels)) if len(pixels) > 3 else 0.0

        return {
            "mean": mean_val,
            "std": std_val,
            "variance": var_val,
            "skewness": skew_val if not np.isnan(skew_val) else 0.0,
            "kurtosis": kurt_val if not np.isnan(kurt_val) else 0.0
        }

    def compute_glcm_features(self, image: np.ndarray, mask: Optional[np.ndarray] = None) -> Dict[str, float]:
        """Calculates GLCM texture metrics (Contrast, Correlation, Homogeneity, Energy, ASM, Entropy)."""
        glcm_dict = self.glcm_extractor.extract_features(image, mask)
        return {
            "glcm_contrast": glcm_dict.get("glcm_contrast", 0.0),
            "glcm_correlation": glcm_dict.get("glcm_correlation", 0.0),
            "glcm_homogeneity": glcm_dict.get("glcm_homogeneity", 0.0),
            "glcm_energy": glcm_dict.get("glcm_energy", 0.0),
            "glcm_asm": glcm_dict.get("glcm_asm", 0.0),
            "glcm_entropy": glcm_dict.get("glcm_entropy", 0.0)
        }

    def compute_shape_features(self, mask: Optional[np.ndarray]) -> Dict[str, float]:
        """
        Calculates geometric descriptors from binary mask:
        Area, Perimeter, Circularity, Solidity, Aspect Ratio, Extent, Equivalent Diameter, Eccentricity.
        """
        if mask is None or np.sum(mask) == 0:
            return {
                "area": 0.0, "perimeter": 0.0, "circularity": 0.0,
                "solidity": 0.0, "aspect_ratio": 0.0, "extent": 0.0,
                "equivalent_diameter": 0.0, "eccentricity": 0.0
            }

        contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return {
                "area": 0.0, "perimeter": 0.0, "circularity": 0.0,
                "solidity": 0.0, "aspect_ratio": 0.0, "extent": 0.0,
                "equivalent_diameter": 0.0, "eccentricity": 0.0
            }

        c = max(contours, key=cv2.contourArea)
        area = float(cv2.contourArea(c))
        perimeter = float(cv2.arcLength(c, True))

        # Circularity = 4 * pi * Area / (Perimeter^2)
        circularity = (4.0 * np.pi * area / (perimeter ** 2)) if perimeter > 0 else 0.0

        # Solidity = Area / ConvexHullArea
        hull = cv2.convexHull(c)
        hull_area = float(cv2.contourArea(hull))
        solidity = (area / hull_area) if hull_area > 0 else 0.0

        # Aspect Ratio = Width / Height
        x, y, w, h = cv2.boundingRect(c)
        aspect_ratio = float(w) / h if h > 0 else 0.0

        # Extent = Area / BoundingBoxArea
        rect_area = float(w * h)
        extent = (area / rect_area) if rect_area > 0 else 0.0

        # Equivalent Diameter = sqrt(4 * Area / pi)
        eq_diameter = float(np.sqrt(4.0 * area / np.pi))

        # Eccentricity
        eccentricity = 0.0
        if len(c) >= 5:
            try:
                (cx, cy), (ma, MA), angle = cv2.fitEllipse(c)
                a = max(ma, MA) / 2.0
                b = min(ma, MA) / 2.0
                if a > 0:
                    eccentricity = float(np.sqrt(1.0 - (b ** 2) / (a ** 2)))
            except Exception:
                eccentricity = 0.0

        return {
            "area": area,
            "perimeter": perimeter,
            "circularity": float(circularity),
            "solidity": float(solidity),
            "aspect_ratio": float(aspect_ratio),
            "extent": float(extent),
            "equivalent_diameter": float(eq_diameter),
            "eccentricity": float(eccentricity)
        }

    def extract(self, image: np.ndarray, mask: Optional[np.ndarray] = None) -> FeatureVector:
        """
        Extracts unified FeatureVector from a single 2D/3D image and optional ROI mask.
        """
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()

        stats = self.compute_first_order_stats(gray, mask)
        glcm = self.compute_glcm_features(gray, mask)
        shape = self.compute_shape_features(mask)

        merged = {**stats, **glcm, **shape}
        return FeatureVector(**merged)

    def extract_batch(
        self, images: List[np.ndarray], masks: Optional[List[Optional[np.ndarray]]] = None
    ) -> List[FeatureVector]:
        """
        Executes batch feature extraction over a list of images.
        """
        results: List[FeatureVector] = []
        if masks is None:
            masks = [None] * len(images)

        for img, msk in zip(images, masks):
            fv = self.extract(img, msk)
            results.append(fv)

        logger.info(f"Extracted feature vectors for {len(results)} images in batch mode.")
        return results

    def extract_all(self, image: np.ndarray, mask: Optional[np.ndarray] = None) -> FeatureVector:
        """Backward compatibility method mapping to extract()."""
        return self.extract(image, mask)

    @staticmethod
    def export_csv(features_list: List[FeatureVector], output_path: Union[str, Path]) -> None:
        """Exports a list of FeatureVector instances to a CSV file."""
        if not features_list:
            logger.warning("No features provided for CSV export.")
            return

        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        fieldnames = FeatureVector.get_feature_names()

        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for fv in features_list:
                writer.writerow(fv.to_dict())

        logger.info(f"Successfully exported {len(features_list)} feature vectors to {path}")

# Aliases for backward compatibility
TextureShapeFeatureExtractor = MRIFeatureExtractor
