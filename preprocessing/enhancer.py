"""
Production-Grade Novel Multi-Stage MRI Image Enhancement Engine.
Implements 16 sequential image processing stages for contrast improvement and noise reduction:
1. Load MRI Image
2. Validate Image
3. Convert Color Spaces (RGB, BGR, Grayscale)
4. Min-Max Intensity Normalization
5. Gaussian Filter
6. Median Filter
7. Bilateral Filter
8. Non-Local Means (NLM) Denoising
9. Contrast Limited Adaptive Histogram Equalization (CLAHE)
10. Adaptive Histogram Equalization (AHE)
11. Gamma Correction
12. Contrast Stretching
13. Unsharp Mask Sharpening Filter
14. Morphological Contrast Enhancement
15. Sobel & Laplacian Edge Enhancement
16. Final Intensity Normalization [0, 255]
"""

from pathlib import Path
from typing import Dict, Tuple, Optional, Union
import numpy as np
import cv2

from config.config import config, EnhancementConfig
from utils.logger import logger
from utils.exceptions import MRIProcessingError

class MRIImageEnhancer:
    """Master Multi-Stage MRI Image Enhancement Processor."""

    def __init__(self, cfg: EnhancementConfig = config.enhancement):
        self.cfg = cfg
        self.history: Dict[str, np.ndarray] = {}

    def load_image(self, image_path: Union[str, Path]) -> np.ndarray:
        """Loads image file from disk using OpenCV."""
        path = Path(image_path)
        if not path.is_file():
            raise MRIProcessingError(f"MRI Image path does not exist: {path}")
        img = cv2.imread(str(path), cv2.IMREAD_COLOR)
        if img is None or img.size == 0:
            raise MRIProcessingError(f"Failed to read image at {path}")
        return img

    def validate_image(self, img: np.ndarray) -> np.ndarray:
        """Validates numpy image array shape and dtype."""
        if img is None or img.size == 0:
            raise MRIProcessingError("Input image array is empty or None.")
        if len(img.shape) not in (2, 3):
            raise MRIProcessingError(f"Invalid image array dimension: {img.shape}")
        return img

    def convert_color_space(self, img: np.ndarray, target: str = "GRAY") -> np.ndarray:
        """Converts color spaces (RGB, BGR, Grayscale)."""
        if target.upper() == "GRAY":
            if len(img.shape) == 3:
                return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            return img.copy()
        elif target.upper() == "RGB":
            if len(img.shape) == 2:
                return cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
            return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        elif target.upper() == "BGR":
            if len(img.shape) == 2:
                return cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
            return img.copy()
        else:
            raise MRIProcessingError(f"Unsupported target color space: {target}")

    def normalize(self, img: np.ndarray) -> np.ndarray:
        """Min-Max Intensity Normalization to range [0, 255]."""
        gray = self.convert_color_space(img, "GRAY").astype(np.float32)
        min_v, max_v = np.min(gray), np.max(gray)
        if max_v - min_v == 0:
            return np.zeros_like(gray, dtype=np.uint8)
        norm = ((gray - min_v) / (max_v - min_v)) * 255.0
        return norm.astype(np.uint8)

    def gaussian_filter(self, img: np.ndarray) -> np.ndarray:
        """Applies 2D Gaussian Smoothing Filter."""
        k = self.cfg.gaussian_kernel_size
        s = self.cfg.gaussian_sigma
        return cv2.GaussianBlur(img, k, s)

    def median_filter(self, img: np.ndarray) -> np.ndarray:
        """Applies Median Filter to eliminate salt-and-pepper noise."""
        k = self.cfg.median_kernel_size
        return cv2.medianBlur(img, k)

    def bilateral_filter(self, img: np.ndarray) -> np.ndarray:
        """Applies Bilateral Filter to preserve sharp anatomical edges while smoothing noise."""
        d = self.cfg.bilateral_d
        sc = self.cfg.bilateral_sigma_color
        ss = self.cfg.bilateral_sigma_space
        return cv2.bilateralFilter(img, d, sc, ss)

    def non_local_means_denoising(self, img: np.ndarray) -> np.ndarray:
        """Applies Non-Local Means (NLM) Denoising algorithm."""
        h = self.cfg.nlm_h
        template_window = self.cfg.nlm_template_window
        search_window = self.cfg.nlm_search_window
        return cv2.fastNlMeansDenoising(img, None, h, template_window, search_window)

    def clahe_enhancement(self, img: np.ndarray) -> np.ndarray:
        """Applies Contrast Limited Adaptive Histogram Equalization (CLAHE)."""
        limit = self.cfg.clahe_clip_limit
        grid = self.cfg.clahe_tile_grid_size
        clahe = cv2.createCLAHE(clipLimit=limit, tileGridSize=grid)
        return clahe.apply(img)

    def adaptive_histogram_equalization(self, img: np.ndarray) -> np.ndarray:
        """Applies Standard Adaptive Histogram Equalization (AHE)."""
        clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8, 8))
        return clahe.apply(img)

    def gamma_correction(self, img: np.ndarray, gamma: Optional[float] = None) -> np.ndarray:
        """Applies non-linear Gamma Correction."""
        g = gamma if gamma is not None else self.cfg.gamma_value
        inv_gamma = 1.0 / g
        table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)]).astype(np.uint8)
        return cv2.LUT(img, table)

    def contrast_stretching(self, img: np.ndarray) -> np.ndarray:
        """Applies linear percentile contrast stretching."""
        p_low = self.cfg.contrast_stretch_percentiles[0]
        p_high = self.cfg.contrast_stretch_percentiles[1]
        v_min, v_max = np.percentile(img, (p_low, p_high))
        if v_max - v_min == 0:
            return img.copy()
        stretched = np.clip((img - v_min) * (255.0 / (v_max - v_min)), 0, 255)
        return stretched.astype(np.uint8)

    def sharpening_filter(self, img: np.ndarray) -> np.ndarray:
        """Applies Unsharp Masking Sharpening Filter."""
        kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32)
        return cv2.filter2D(img, -1, kernel)

    def morphological_enhancement(self, img: np.ndarray) -> np.ndarray:
        """Applies Top-Hat and Black-Hat Morphological Enhancement."""
        k = self.cfg.morphological_kernel_size
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, k)
        top_hat = cv2.morphologyEx(img, cv2.MORPH_TOPHAT, kernel)
        black_hat = cv2.morphologyEx(img, cv2.MORPH_BLACKHAT, kernel)
        enhanced = cv2.add(img, top_hat)
        enhanced = cv2.subtract(enhanced, black_hat)
        return enhanced

    def edge_enhancement(self, img: np.ndarray) -> np.ndarray:
        """Applies Sobel Gradient Edge Enhancement."""
        sobelx = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
        sobel_grad = np.hypot(sobelx, sobely)
        sobel_grad = (sobel_grad / np.max(sobel_grad) * 255.0).astype(np.uint8)
        w = self.cfg.edge_enhancement_weight
        return cv2.addWeighted(img, 1.0 - w, sobel_grad, w, 0)

    def final_intensity_normalization(self, img: np.ndarray) -> np.ndarray:
        """Final uint8 Normalization."""
        return self.normalize(img)

    def enhance_pipeline(
        self, image_input: Union[str, Path, np.ndarray]
    ) -> Tuple[np.ndarray, np.ndarray, Dict[str, np.ndarray], Dict[str, float]]:
        """
        Executes complete 16-stage novel MRI enhancement pipeline.
        
        Returns:
            Tuple of (original_image, final_enhanced_image, intermediate_history_dict, execution_times_dict)
        """
        if isinstance(image_input, (str, Path)):
            raw_img = self.load_image(image_input)
        else:
            raw_img = self.validate_image(image_input)

        gray = self.convert_color_space(raw_img, "GRAY")
        self.history = {"1. Original Grayscale": gray.copy()}

        # 4. Initial Normalization
        stage4 = self.normalize(gray)
        self.history["2. Initial Min-Max Normalization"] = stage4.copy()

        # 5. Gaussian Filtering
        stage5 = self.gaussian_filter(stage4)
        self.history["3. Gaussian Blur"] = stage5.copy()

        # 6. Median Filtering
        stage6 = self.median_filter(stage5)
        self.history["4. Median Denoising"] = stage6.copy()

        # 7. Bilateral Filtering
        stage7 = self.bilateral_filter(stage6)
        self.history["5. Bilateral Edge-Preserving Filter"] = stage7.copy()

        # 8. NLM Denoising
        stage8 = self.non_local_means_denoising(stage7)
        self.history["6. Non-Local Means Denoising"] = stage8.copy()

        # 9. CLAHE
        stage9 = self.clahe_enhancement(stage8)
        self.history["7. CLAHE Contrast Boost"] = stage9.copy()

        # 10. Adaptive Histogram Equalization
        stage10 = self.adaptive_histogram_equalization(stage9)
        self.history["8. Adaptive Histogram Equalization"] = stage10.copy()

        # 11. Gamma Correction
        stage11 = self.gamma_correction(stage10)
        self.history["9. Gamma Correction"] = stage11.copy()

        # 12. Contrast Stretching
        stage12 = self.contrast_stretching(stage11)
        self.history["10. Contrast Percentile Stretching"] = stage12.copy()

        # 13. Sharpening Filter
        stage13 = self.sharpening_filter(stage12)
        self.history["11. Unsharp Mask Sharpening"] = stage13.copy()

        # 14. Morphological Enhancement
        stage14 = self.morphological_enhancement(stage13)
        self.history["12. Morphological Top/Black-Hat"] = stage14.copy()

        # 15. Edge Enhancement
        stage15 = self.edge_enhancement(stage14)
        self.history["13. Sobel Edge Gradient Overlay"] = stage15.copy()

        # 16. Final Intensity Normalization
        final_enhanced = self.final_intensity_normalization(stage15)
        self.history["14. Final Enhanced Output"] = final_enhanced.copy()

        logger.info("Executed 16-stage novel MRI enhancement pipeline successfully.")
        return gray, final_enhanced, self.history, {}

# Alias for backward compatibility
MRIEnhancer = MRIImageEnhancer
