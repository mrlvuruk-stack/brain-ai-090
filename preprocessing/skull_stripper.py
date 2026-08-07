"""
Production-Grade Morphological Skull Stripping Module.
Removes non-cerebral tissue (scalp, skull, dura mater, skull base, neck fat) from MRI scans using:
- Otsu Adaptive Thresholding
- Morphological Opening & Closing
- Largest Connected Component (Cerebral Hemisphere Region) Isolation
- Convex Hull Refinement
- Binary Brain Mask Generation & Bitwise Masking
"""

from typing import Tuple, Dict, Optional, Union
from pathlib import Path
import numpy as np
import cv2
from config.config import config, SegmentationConfig
from utils.logger import logger
from utils.exceptions import MRIProcessingError

class MRISkullStripper:
    """Removes extra-cranial structures to isolate cerebral parenchyma."""

    def __init__(self, cfg: SegmentationConfig = config.segmentation):
        self.cfg = cfg
        self.history: Dict[str, np.ndarray] = {}

    def validate_image(self, image_input: Union[str, Path, np.ndarray]) -> np.ndarray:
        """Validates input image array or file path."""
        if isinstance(image_input, (str, Path)):
            path = Path(image_input)
            if not path.is_file():
                raise MRIProcessingError(f"Image file does not exist: {path}")
            img = cv2.imread(str(path), cv2.IMREAD_COLOR)
            if img is None or img.size == 0:
                raise MRIProcessingError(f"Failed to read image from path: {path}")
            return img
        elif isinstance(image_input, np.ndarray):
            if image_input is None or image_input.size == 0:
                raise MRIProcessingError("Input image array is empty or None.")
            return image_input.copy()
        else:
            raise MRIProcessingError(f"Invalid image input type: {type(image_input)}")

    def strip_skull(
        self, enhanced_image: Union[str, Path, np.ndarray]
    ) -> Tuple[np.ndarray, np.ndarray, Dict[str, np.ndarray]]:
        """
        Executes skull stripping pipeline on enhanced MRI scan.
        
        Args:
            enhanced_image: Enhanced MRI scan (grayscale or BGR numpy array or file path).
            
        Returns:
            Tuple of (skull_stripped_image, binary_brain_mask, dictionary_of_intermediate_stages)
        """
        img = self.validate_image(enhanced_image)
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img.copy()

        self.history = {"1. Enhanced Input Grayscale": gray.copy()}

        # 1. Soft Gaussian Pre-blur for smooth threshold boundaries
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # 2. Otsu Adaptive Thresholding
        otsu_val, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        self.history["2. Otsu Threshold"] = thresh.copy()

        # 3. Morphological Opening to sever thin scalp strands
        kernel_size = self.cfg.skull_stripping.morph_kernel_size if hasattr(self.cfg, "skull_stripping") else (5, 5)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, kernel_size)
        opened = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
        self.history["3. Morphological Opening"] = opened.copy()

        # 4. Extract Largest Connected Component (Cerebral Hemisphere Region)
        contours, _ = cv2.findContours(opened, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        binary_mask = np.zeros_like(gray, dtype=np.uint8)

        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            cv2.drawContours(binary_mask, [largest_contour], -1, 255, thickness=cv2.FILLED)

            # Convex Hull refinement to include recessed sulci and gyri
            hull = cv2.convexHull(largest_contour)
            hull_mask = np.zeros_like(gray, dtype=np.uint8)
            cv2.drawContours(hull_mask, [hull], -1, 255, thickness=cv2.FILLED)

            binary_mask = cv2.bitwise_or(binary_mask, hull_mask)

        self.history["4. Largest Contour Mask"] = binary_mask.copy()

        # 5. Morphological Closing to fill intra-cerebral gaps
        closed_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_CLOSE, kernel, iterations=3)
        self.history["5. Final Brain Mask"] = closed_mask.copy()

        # 6. Bitwise Masking to isolate brain parenchyma
        stripped_brain = cv2.bitwise_and(gray, gray, mask=closed_mask)
        self.history["6. Skull Stripped Result"] = stripped_brain.copy()

        # 7. Green Boundary Overlay Preview
        overlay = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
        contours_mask, _ = cv2.findContours(closed_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cv2.drawContours(overlay, contours_mask, -1, (0, 255, 0), 2)
        self.history["7. Skull Boundary Overlay"] = overlay.copy()

        logger.info("Skull stripping completed successfully.")
        return stripped_brain, closed_mask, self.history

# Alias for backward compatibility
SkullStripper = MRISkullStripper
