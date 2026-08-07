"""
Production-Grade Gray-Level Co-occurrence Matrix (GLCM) Radiomic Extractor.
Computes second-order statistical texture features across multiple spatial distances and angles (0°, 45°, 90°, 135°):
- Contrast
- Correlation
- Homogeneity
- Energy
- Angular Second Moment (ASM)
- Dissimilarity
- GLCM Entropy
"""

from typing import Dict, List, Optional, Union
import numpy as np
from skimage.feature import graycomatrix, graycoprops
from utils.logger import logger
from utils.exceptions import FeatureExtractionError

class GLCMExtractor:
    """Computes second-order GLCM texture descriptors."""

    def __init__(
        self,
        distances: Optional[List[int]] = None,
        angles: Optional[List[float]] = None,
        levels: int = 256
    ):
        self.distances = distances if distances is not None else [1, 2, 3]
        self.angles = angles if angles is not None else [0.0, np.pi/4, np.pi/2, 3*np.pi/4]
        self.levels = levels

    def compute_glcm_matrix(self, gray_image: np.ndarray, mask: Optional[np.ndarray] = None) -> np.ndarray:
        """
        Computes 4D GLCM array [levels, levels, distances, angles] for 2D grayscale image.
        """
        if len(gray_image.shape) != 2:
            raise FeatureExtractionError("GLCM matrix computation requires a 2D single-channel grayscale image.")

        img = gray_image.astype(np.uint8)
        if mask is not None and np.sum(mask) > 0:
            img = np.where(mask > 0, img, 0)

        glcm = graycomatrix(
            img,
            distances=self.distances,
            angles=self.angles,
            levels=self.levels,
            symmetric=True,
            normed=True
        )
        return glcm

    def extract_features(self, gray_image: np.ndarray, mask: Optional[np.ndarray] = None) -> Dict[str, float]:
        """
        Calculates mean Haralick texture descriptors across all distances and angles.
        
        Returns:
            Dictionary mapping feature names to scalar floats.
        """
        glcm = self.compute_glcm_matrix(gray_image, mask)

        # Standard Haralick props averaged over distances and angles
        contrast = float(np.mean(graycoprops(glcm, "contrast")))
        dissimilarity = float(np.mean(graycoprops(glcm, "dissimilarity")))
        homogeneity = float(np.mean(graycoprops(glcm, "homogeneity")))
        energy = float(np.mean(graycoprops(glcm, "energy")))
        asm = float(np.mean(graycoprops(glcm, "ASM")))
        correlation = float(np.mean(graycoprops(glcm, "correlation")))

        # Shannon Entropy calculation over normalized GLCM probability matrix
        p_glcm = glcm / (np.sum(glcm) + 1e-12)
        p_flat = p_glcm.flatten()
        p_nz = p_flat[p_flat > 0]
        glcm_entropy = float(-np.sum(p_nz * np.log2(p_nz))) if len(p_nz) > 0 else 0.0

        return {
            "glcm_contrast": contrast,
            "glcm_dissimilarity": dissimilarity,
            "glcm_homogeneity": homogeneity,
            "glcm_energy": energy,
            "glcm_asm": asm,
            "glcm_correlation": correlation,
            "glcm_entropy": glcm_entropy
        }

# Alias for backward compatibility
MRIGLCMExtractor = GLCMExtractor
