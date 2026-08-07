"""
Production-Grade MRI Tumor Segmentation Engine.
Integrates K-Means, Fuzzy C-Means (FCM), Watershed Transformation, Adaptive Thresholding,
and Seeded Region Growing with morphological refinement, contour detection, bounding box extraction,
and precise geometric metrics calculation (Area in px and mm², Perimeter, Circularity, Solidity, Eccentricity).
"""

import time
from dataclasses import dataclass
from typing import Dict, Tuple, Optional, List, Any, Union
import numpy as np
import cv2
from scipy.ndimage import distance_transform_edt
from skimage.segmentation import watershed
from skimage.feature import peak_local_max

from config.config import config, SegmentationConfig
from utils.logger import logger
from utils.exceptions import SegmentationError

@dataclass
class SegmentationResult:
    """Dataclass holding complete multi-stage segmentation outputs and geometric statistics."""
    tumor_mask: np.ndarray
    overlay_image: np.ndarray
    bounding_box: Tuple[int, int, int, int]  # (x, y, w, h)
    tumor_area_pixels: int
    tumor_area_mm2: float
    perimeter: float
    circularity: float
    solidity: float
    eccentricity: float
    method_used: str
    intermediates: Dict[str, np.ndarray]
    execution_time_ms: float = 0.0

class MRITumorSegmenter:
    """Master MRI Tumor Segmentation Processor."""

    def __init__(self, cfg: SegmentationConfig = config.segmentation):
        self.cfg = cfg
        self.history: Dict[str, np.ndarray] = {}

    def validate_image(self, img: np.ndarray) -> np.ndarray:
        """Validates input image shape and channel properties."""
        if img is None or img.size == 0:
            raise SegmentationError("Input image provided for segmentation is empty or None.")
        if len(img.shape) == 3:
            return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return img.copy()

    def kmeans_segmentation(self, image: np.ndarray, brain_mask: Optional[np.ndarray] = None) -> np.ndarray:
        """K-Means Intensity Clustering for Tumor Isolation ($K=3$)."""
        gray = self.validate_image(image)
        pixel_vals = gray.reshape((-1, 1)).astype(np.float32)

        if brain_mask is not None:
            valid_idx = np.where(brain_mask.flatten() > 0)[0]
            if len(valid_idx) == 0:
                return np.zeros_like(gray)
            sample_pixels = pixel_vals[valid_idx]
        else:
            sample_pixels = pixel_vals

        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
        k = self.cfg.kmeans_clusters
        _, labels, centers = cv2.kmeans(sample_pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

        tumor_cluster_idx = np.argmax(centers)
        full_labels = np.zeros(gray.shape[0] * gray.shape[1], dtype=np.uint8)

        if brain_mask is not None:
            full_labels[valid_idx] = (labels.flatten() == tumor_cluster_idx).astype(np.uint8) * 255
        else:
            full_labels = (labels.flatten() == tumor_cluster_idx).astype(np.uint8) * 255

        return full_labels.reshape(gray.shape)

    def fuzzy_cmeans_segmentation(self, image: np.ndarray, brain_mask: Optional[np.ndarray] = None) -> np.ndarray:
        """Fuzzy C-Means (FCM) Soft Clustering."""
        gray = self.validate_image(image)
        pixels = gray.flatten().astype(np.float32)
        if brain_mask is not None:
            pixels[brain_mask.flatten() == 0] = 0.0

        n_clusters = self.cfg.fcm_clusters
        m = self.cfg.fcm_m
        max_iter = self.cfg.fcm_max_iter

        centers = np.linspace(np.min(pixels), np.max(pixels), n_clusters)

        for _ in range(max_iter):
            dist = np.abs(pixels[:, None] - centers[None, :]) + 1e-6
            u = 1.0 / (dist ** (2.0 / (m - 1.0)))
            u = u / np.sum(u, axis=1, keepdims=True)
            new_centers = np.sum((u ** m) * pixels[:, None], axis=0) / np.sum(u ** m, axis=0)
            if np.allclose(centers, new_centers, atol=1e-3):
                break
            centers = new_centers

        tumor_cluster_idx = np.argmax(centers)
        membership = u[:, tumor_cluster_idx].reshape(gray.shape)
        tumor_mask = ((membership > 0.6) & (gray > 120)).astype(np.uint8) * 255
        if brain_mask is not None:
            tumor_mask = cv2.bitwise_and(tumor_mask, brain_mask)

        return tumor_mask

    def watershed_segmentation(self, image: np.ndarray, brain_mask: Optional[np.ndarray] = None) -> np.ndarray:
        """Marker-Controlled Watershed Transformation."""
        gray = self.validate_image(image)
        if brain_mask is not None:
            img_masked = cv2.bitwise_and(gray, brain_mask)
        else:
            img_masked = gray.copy()

        _, thresh = cv2.threshold(img_masked, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        dist_transform = distance_transform_edt(thresh)
        coords = peak_local_max(dist_transform, min_distance=self.cfg.watershed_min_distance, labels=thresh)

        markers = np.zeros(dist_transform.shape, dtype=np.int32)
        for i, coord in enumerate(coords):
            markers[coord[0], coord[1]] = i + 1

        labels = watershed(-dist_transform, markers, mask=thresh)

        unique_labels = np.unique(labels)
        best_label = 0
        max_mean = 0.0

        for label in unique_labels:
            if label == 0:
                continue
            region_mean = np.mean(gray[labels == label])
            if region_mean > max_mean:
                max_mean = region_mean
                best_label = label

        return (labels == best_label).astype(np.uint8) * 255

    def adaptive_threshold_segmentation(self, image: np.ndarray, brain_mask: Optional[np.ndarray] = None) -> np.ndarray:
        """Adaptive Gaussian Intensity Thresholding."""
        gray = self.validate_image(image)
        if brain_mask is not None:
            gray = cv2.bitwise_and(gray, brain_mask)
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        return thresh

    def region_growing_segmentation(
        self, image: np.ndarray, seed_point: Optional[Tuple[int, int]] = None
    ) -> np.ndarray:
        """Seeded Region Growing Algorithm."""
        gray = self.validate_image(image)
        if seed_point is None:
            seed_point = np.unravel_index(np.argmax(gray), gray.shape)

        h, w = gray.shape
        segmented = np.zeros((h, w), dtype=np.uint8)
        visited = np.zeros((h, w), dtype=bool)

        seed_val = float(gray[seed_point[0], seed_point[1]])
        thresh = self.cfg.region_growing_threshold

        point_list = [seed_point]
        visited[seed_point[0], seed_point[1]] = True

        while point_list:
            cx, cy = point_list.pop(0)
            segmented[cx, cy] = 255

            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < h and 0 <= ny < w and not visited[nx, ny]:
                    visited[nx, ny] = True
                    if abs(float(gray[nx, ny]) - seed_val) <= thresh:
                        point_list.append((nx, ny))

        return segmented

    def morphological_refinement(self, mask: np.ndarray) -> np.ndarray:
        """Morphological Opening & Closing to remove noise specs and bridge gaps."""
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        clean_mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
        clean_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
        return clean_mask

    def contour_detection(self, mask: np.ndarray) -> List[np.ndarray]:
        """Detects binary mask boundary contours."""
        contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        return contours

    def remove_small_regions(self, contours: List[np.ndarray], min_area: int = 30) -> List[np.ndarray]:
        """Filters out contours smaller than minimum area threshold."""
        return [c for c in contours if cv2.contourArea(c) >= min_area]

    def largest_tumor_region(self, contours: List[np.ndarray]) -> Optional[np.ndarray]:
        """Identifies primary tumor contour with maximum area."""
        if not contours:
            return None
        return max(contours, key=cv2.contourArea)

    def tumor_mask(self, image_shape: Tuple[int, int], contour: Optional[np.ndarray]) -> np.ndarray:
        """Generates binary tumor mask from contour."""
        mask = np.zeros(image_shape, dtype=np.uint8)
        if contour is not None:
            cv2.drawContours(mask, [contour], -1, 255, thickness=cv2.FILLED)
        return mask

    def bounding_box(self, contour: Optional[np.ndarray]) -> Tuple[int, int, int, int]:
        """Calculates bounding box coordinates (x, y, w, h)."""
        if contour is None:
            return (0, 0, 0, 0)
        return cv2.boundingRect(contour)

    def contour_overlay(self, original_image: np.ndarray, contour: Optional[np.ndarray], bbox: Tuple[int, int, int, int]) -> np.ndarray:
        """Draws red contour outline and cyan bounding box over original image."""
        if len(original_image.shape) == 2:
            overlay = cv2.cvtColor(original_image, cv2.COLOR_GRAY2BGR)
        else:
            overlay = original_image.copy()

        if contour is not None:
            cv2.drawContours(overlay, [contour], -1, (0, 0, 255), 2)
            x, y, w, h = bbox
            cv2.rectangle(overlay, (x, y), (x + w, y + h), (255, 255, 0), 2)
            area_px = int(cv2.contourArea(contour))
            cv2.putText(
                overlay, f"Tumor: {area_px} px", (x, max(15, y - 5)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1, cv2.LINE_AA
            )
        return overlay

    def area_pixels(self, contour: Optional[np.ndarray]) -> int:
        """Calculates tumor surface area in pixels."""
        if contour is None:
            return 0
        return int(cv2.contourArea(contour))

    def area_mm2(self, area_px: int) -> float:
        """Calculates estimated tumor area in mm²."""
        scale = self.cfg.pixel_scale_mm_per_px
        return float(area_px * (scale ** 2))

    def perimeter(self, contour: Optional[np.ndarray]) -> float:
        """Calculates contour perimeter length."""
        if contour is None:
            return 0.0
        return float(cv2.arcLength(contour, True))

    def circularity(self, area_px: int, perim: float) -> float:
        """Calculates region circularity ($4\\pi A / P^2$)."""
        if perim <= 0:
            return 0.0
        return float((4.0 * np.pi * area_px) / (perim ** 2))

    def solidity(self, contour: Optional[np.ndarray], area_px: int) -> float:
        """Calculates region solidity ($Area / ConvexHullArea$)."""
        if contour is None or len(contour) < 3:
            return 0.0
        hull = cv2.convexHull(contour)
        hull_area = float(cv2.contourArea(hull))
        if hull_area <= 0:
            return 0.0
        return float(area_px / hull_area)

    def eccentricity(self, contour: Optional[np.ndarray]) -> float:
        """Calculates eccentricity from fitted ellipse."""
        if contour is None or len(contour) < 5:
            return 0.0
        try:
            (cx, cy), (ma, MA), angle = cv2.fitEllipse(contour)
            a = max(ma, MA) / 2.0
            b = min(ma, MA) / 2.0
            if a <= 0:
                return 0.0
            return float(np.sqrt(1.0 - (b ** 2) / (a ** 2)))
        except Exception:
            return 0.0

    def segmentation_pipeline(
        self, skull_removed_mri: np.ndarray, brain_mask: Optional[np.ndarray] = None, method: str = "kmeans"
    ) -> SegmentationResult:
        """
        Executes sequential segmentation pipeline:
        Skull Removed MRI -> K-Means -> FCM -> Watershed -> Refinement -> Contour -> Largest -> Mask -> BBox -> Overlay
        """
        start_time = time.time()
        gray = self.validate_image(skull_removed_mri)
        self.history = {"1. Skull Removed Input": gray.copy()}

        # 1. K-Means
        kmeans_mask = self.kmeans_segmentation(gray, brain_mask)
        self.history["2. K-Means Mask"] = kmeans_mask.copy()

        # 2. FCM
        fcm_mask = self.fuzzy_cmeans_segmentation(gray, brain_mask)
        self.history["3. FCM Mask"] = fcm_mask.copy()

        # 3. Watershed
        ws_mask = self.watershed_segmentation(gray, brain_mask)
        self.history["4. Watershed Mask"] = ws_mask.copy()

        # Choose primary mask based on method parameter
        if method == "fcm":
            base_mask = fcm_mask
        elif method == "watershed":
            base_mask = ws_mask
        elif method == "region_growing":
            base_mask = self.region_growing_segmentation(gray)
        else:
            base_mask = kmeans_mask

        # 4. Morphological Refinement
        refined_mask = self.morphological_refinement(base_mask)
        self.history["5. Refined Mask"] = refined_mask.copy()

        # 5. Contour Detection & Small Region Removal
        all_contours = self.contour_detection(refined_mask)
        valid_contours = self.remove_small_regions(all_contours, self.cfg.min_tumor_area_pixels)

        # 6. Largest Tumor Region
        main_contour = self.largest_tumor_region(valid_contours)

        # 7. Tumor Mask
        final_mask = self.tumor_mask(gray.shape, main_contour)
        self.history["6. Final Tumor Mask"] = final_mask.copy()

        # 8. Bounding Box
        bbox = self.bounding_box(main_contour)

        # 9. Overlay
        overlay = self.contour_overlay(gray, main_contour, bbox)
        self.history["7. Tumor Overlay"] = overlay.copy()

        # Compute geometric metrics
        area_px = self.area_pixels(main_contour)
        area_mm = self.area_mm2(area_px)
        perim = self.perimeter(main_contour)
        circ = self.circularity(area_px, perim)
        sol = self.solidity(main_contour, area_px)
        ecc = self.eccentricity(main_contour)

        execution_time_ms = float((time.time() - start_time) * 1000.0)

        logger.info(
            f"Segmentation pipeline completed ({method}) in {execution_time_ms:.1f}ms. "
            f"Detected Tumor Area: {area_px} px ({area_mm:.2f} mm²)."
        )

        return SegmentationResult(
            tumor_mask=final_mask,
            overlay_image=overlay,
            bounding_box=bbox,
            tumor_area_pixels=area_px,
            tumor_area_mm2=area_mm,
            perimeter=perim,
            circularity=circ,
            solidity=sol,
            eccentricity=ecc,
            method_used=method,
            intermediates=self.history,
            execution_time_ms=execution_time_ms
        )

    def process(
        self, image: np.ndarray, brain_mask: Optional[np.ndarray] = None, method: str = "kmeans"
    ) -> SegmentationResult:
        """Backward compatibility wrapper for predictor engine."""
        return self.segmentation_pipeline(image, brain_mask=brain_mask, method=method)

# Alias for backward compatibility
TumorSegmenter = MRITumorSegmenter
