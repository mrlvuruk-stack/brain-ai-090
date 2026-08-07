"""
Production-Grade Synthetic Brain MRI Image Generator.
Synthesizes anatomically realistic brain MRI scans (T1/T2-weighted simulation)
including scalp outline, skull boundary, CSF subdural space, cerebral parenchyma texture,
ventricle cavities, Gaussian tissue noise, and hyperintense tumor lesions with edema halos.
Used for automated testing, verification, and demo execution.
"""

from pathlib import Path
from typing import Tuple
import numpy as np
import cv2

from config.config import config
from utils.logger import logger
from utils.exceptions import DatasetError

class SyntheticMRIGenerator:
    """Generates synthetic Brain MRI scans (No_Tumor vs Tumor) with realistic anatomical tissues."""

    def __init__(self, image_size: Tuple[int, int] = (128, 128)):
        self.height, self.width = image_size
        self.center = (self.width // 2, self.height // 2)

    def _create_base_brain(self) -> np.ndarray:
        """Constructs background, scalp, skull contour, CSF, and parenchymal tissue."""
        img = np.zeros((self.height, self.width), dtype=np.float32)

        # 1. Scalp & Skull Boundary (Outer Ellipse)
        rx = int(self.width * 0.42)
        ry = int(self.height * 0.45)
        cv2.ellipse(img, self.center, (rx, ry), 0, 0, 360, 180, -1)

        # 2. Subdural CSF Fluid Gap (Darker Ring)
        rx_brain = int(self.width * 0.38)
        ry_brain = int(self.height * 0.41)
        cv2.ellipse(img, self.center, (rx_brain, ry_brain), 0, 0, 360, 40, -1)

        # 3. Brain Parenchyma (Cortex & White Matter ~ Intensity 110)
        cv2.ellipse(img, self.center, (rx_brain - 2, ry_brain - 2), 0, 0, 360, 110, -1)

        # 4. Ventricles (Central fluid cavities)
        cv2.ellipse(img, (self.center[0] - 10, self.center[1]), (6, 18), 15, 0, 360, 30, -1)
        cv2.ellipse(img, (self.center[0] + 10, self.center[1]), (6, 18), -15, 0, 360, 30, -1)

        # 5. Add Rician / Gaussian tissue noise
        noise = np.random.normal(0, 7, (self.height, self.width)).astype(np.float32)
        img += noise
        img = np.clip(img, 0, 255).astype(np.uint8)

        # Smooth anatomical structures
        img = cv2.GaussianBlur(img, (3, 3), 0)
        return img

    def generate_sample(self, is_tumor: bool = False) -> np.ndarray:
        """
        Synthesizes a single MRI image.
        
        Args:
            is_tumor: If True, implants a hyperintense lesion with surrounding edema.
        Returns:
            Grayscale MRI image array (uint8).
        """
        img = self._create_base_brain()

        if is_tumor:
            angle = np.random.uniform(0, 2 * np.pi)
            dist = np.random.uniform(15, 30)
            tx = int(self.center[0] + dist * np.cos(angle))
            ty = int(self.center[1] + dist * np.sin(angle))
            tumor_radius = np.random.randint(8, 16)

            # Edema halo (Medium bright surround)
            cv2.circle(img, (tx, ty), tumor_radius + 6, (170,), -1)
            # Hyperintense Core (Very bright)
            cv2.circle(img, (tx, ty), tumor_radius, (245,), -1)
            # Heterogeneous necrotic core
            cv2.circle(img, (tx, ty), max(2, tumor_radius - 5), (130,), -1)

            # Soft blur for realistic tissue blending
            img = cv2.GaussianBlur(img, (3, 3), 0)

        return img

    def build_synthetic_dataset(
        self,
        output_dir: Path,
        num_no_tumor: int = 100,
        num_tumor: int = 100
    ) -> Tuple[int, int]:
        """
        Generates and saves synthetic dataset into subfolders:
            output_dir/No_Tumor/
            output_dir/Tumor/
        """
        out_path = Path(output_dir)
        no_tumor_dir = out_path / "No_Tumor"
        tumor_dir = out_path / "Tumor"
        no_tumor_dir.mkdir(parents=True, exist_ok=True)
        tumor_dir.mkdir(parents=True, exist_ok=True)

        logger.info(f"Generating synthetic dataset in {out_path}: {num_no_tumor} No_Tumor, {num_tumor} Tumor images.")

        count_no_tumor = 0
        for i in range(num_no_tumor):
            img = self.generate_sample(is_tumor=False)
            cv2.imwrite(str(no_tumor_dir / f"mri_normal_{i+1:04d}.png"), img)
            count_no_tumor += 1

        count_tumor = 0
        for i in range(num_tumor):
            img = self.generate_sample(is_tumor=True)
            cv2.imwrite(str(tumor_dir / f"mri_tumor_{i+1:04d}.png"), img)
            count_tumor += 1

        logger.info(f"Synthetic dataset generation complete: Total {count_no_tumor + count_tumor} images.")
        return count_no_tumor, count_tumor
