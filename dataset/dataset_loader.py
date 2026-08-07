"""
Production-Grade MRI Dataset Loader and Data Pipeline Engine.
Provides robust scanning, validation, corrupted image filtering, stratified splitting,
Kaggle 3M LGG dataset ingestion, and high-performance TensorFlow `tf.data.Dataset` pipelines.
"""

from pathlib import Path
from typing import Tuple, List, Dict, Any, Optional, Union
import numpy as np
import cv2
import tensorflow as tf
from sklearn.model_selection import train_test_split

from config.config import config, PathConfig, ModelConfig
from utils.logger import logger
from utils.exceptions import DatasetError
from utils.file_manager import FileManager

class MRIDatasetLoader:
    """Master Ingestion and Pipeline Loader for MRI Datasets."""

    def __init__(
        self,
        target_size: Tuple[int, int] = (config.model.image_width, config.model.image_height),
        supported_formats: Tuple[str, ...] = (".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff")
    ):
        self.target_size = target_size
        self.supported_formats = supported_formats
        self.class_names = ["No_Tumor", "Tumor"]
        self.class_map = {"No_Tumor": 0, "Tumor": 1, "no_tumor": 0, "tumor": 1, "no": 0, "yes": 1}

    def detect_corrupted_image(self, file_path: Union[str, Path]) -> bool:
        """Checks if an image file is corrupted or unreadable."""
        try:
            path = Path(file_path)
            if not path.is_file() or path.stat().st_size == 0:
                return True
            img = cv2.imread(str(path))
            return img is None or img.size == 0
        except Exception:
            return True

    def import_kaggle_3m_dataset(
        self,
        kaggle_dir: Union[str, Path],
        destination_dir: Union[str, Path],
        max_samples_per_class: Optional[int] = None
    ) -> Tuple[int, int]:
        """
        Parses Kaggle 3M LGG dataset (`U:\\tumor detection\\kaggle_3m`):
        Images with `max(mask) > 0` -> `Tumor` subfolder,
        Images with `max(mask) == 0` -> `No_Tumor` subfolder.
        """
        src = Path(kaggle_dir)
        dst = Path(destination_dir)

        if not src.exists():
            raise DatasetError(f"Kaggle 3M directory does not exist: {src}")

        no_tumor_dir = dst / "No_Tumor"
        tumor_dir = dst / "Tumor"
        no_tumor_dir.mkdir(parents=True, exist_ok=True)
        tumor_dir.mkdir(parents=True, exist_ok=True)

        logger.info(f"Ingesting Kaggle 3M dataset from {src} to {dst}...")

        count_no_tumor = 0
        count_tumor = 0

        # Discover all patient folders
        patient_folders = [p for p in src.glob("*") if p.is_dir() and p.name not in [".git", "outputs"]]

        for patient in patient_folders:
            tif_files = [f for f in patient.glob("*.tif") if not f.name.endswith("_mask.tif")]
            for img_file in tif_files:
                mask_file = patient / f"{img_file.stem}_mask.tif"
                if not mask_file.exists():
                    continue

                mask = cv2.imread(str(mask_file), cv2.IMREAD_GRAYSCALE)
                img = cv2.imread(str(img_file))

                if mask is None or img is None:
                    continue

                is_tumor = bool(np.max(mask) > 0)

                if is_tumor:
                    if max_samples_per_class and count_tumor >= max_samples_per_class:
                        continue
                    save_path = tumor_dir / f"{patient.name}_{img_file.stem}.png"
                    cv2.imwrite(str(save_path), img)
                    count_tumor += 1
                else:
                    if max_samples_per_class and count_no_tumor >= max_samples_per_class:
                        continue
                    save_path = no_tumor_dir / f"{patient.name}_{img_file.stem}.png"
                    cv2.imwrite(str(save_path), img)
                    count_no_tumor += 1

        logger.info(f"Kaggle 3M Ingestion Complete: {count_no_tumor} No_Tumor, {count_tumor} Tumor samples.")
        return count_no_tumor, count_tumor

    def load_dataset_from_directory(
        self, dataset_dir: Union[str, Path]
    ) -> Tuple[np.ndarray, np.ndarray, List[str]]:
        """
        Scans dataset directory, validates image headers, loads pixel arrays, and returns (X, y, file_paths).
        """
        dir_path = Path(dataset_dir)
        if not dir_path.exists():
            raise DatasetError(f"Dataset directory does not exist: {dir_path}")

        images: List[np.ndarray] = []
        labels: List[int] = []
        paths: List[str] = []

        subdirs = [d for d in dir_path.glob("*") if d.is_dir()]
        if not subdirs:
            raise DatasetError(f"No class subfolders found in dataset directory: {dir_path}")

        logger.info(f"Scanning dataset subfolders in {dir_path}...")

        for sub in subdirs:
            label_key = sub.name.strip()
            if label_key not in self.class_map:
                continue
            class_id = self.class_map[label_key]

            for file_path in sub.glob("*"):
                if file_path.suffix.lower() not in self.supported_formats:
                    continue
                if self.detect_corrupted_image(file_path):
                    logger.warning(f"Skipping corrupted image: {file_path}")
                    continue

                try:
                    img = FileManager.load_image(file_path, grayscale=False)
                    img_resized = cv2.resize(img, self.target_size)
                    images.append(img_resized)
                    labels.append(class_id)
                    paths.append(str(file_path))
                except Exception as e:
                    logger.warning(f"Error reading image {file_path}: {e}")

        if not images:
            raise DatasetError(f"No valid images loaded from directory: {dir_path}")

        X = np.array(images, dtype=np.uint8)
        y = np.array(labels, dtype=np.int32)

        logger.info(f"Successfully loaded {len(X)} valid MRI images. Class breakdown: {np.bincount(y)}")
        return X, y, paths

    def create_stratified_splits(
        self,
        X: np.ndarray,
        y: np.ndarray,
        train_ratio: float = config.model.train_split,
        val_ratio: float = config.model.val_split,
        test_ratio: float = config.model.test_split,
        random_state: int = 42
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Performs Stratified Train/Validation/Test split ensuring class ratio preservation.
        """
        assert abs((train_ratio + val_ratio + test_ratio) - 1.0) < 1e-4, "Splits must sum to 1.0"

        # Split into Train and Temp (Val + Test)
        temp_ratio = val_ratio + test_ratio
        X_train, X_temp, y_train, y_temp = train_test_split(
            X, y, test_size=temp_ratio, stratify=y, random_state=random_state
        )

        # Split Temp into Val and Test
        relative_test_ratio = test_ratio / temp_ratio
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=relative_test_ratio, stratify=y_temp, random_state=random_state
        )

        logger.info(
            f"Stratified Split Completed: Train={len(X_train)} ({np.bincount(y_train)}), "
            f"Val={len(X_val)} ({np.bincount(y_val)}), Test={len(X_test)} ({np.bincount(y_test)})."
        )

        return X_train, y_train, X_val, y_val, X_test, y_test

    @staticmethod
    def get_data_augmentor() -> tf.keras.preprocessing.image.ImageDataGenerator:
        """Configures real-time Keras ImageDataGenerator augmentation engine."""
        return tf.keras.preprocessing.image.ImageDataGenerator(
            rotation_range=15,
            width_shift_range=0.08,
            height_shift_range=0.08,
            shear_range=0.08,
            zoom_range=0.1,
            horizontal_flip=True,
            fill_mode="nearest"
        )

    def create_tf_dataset(
        self,
        X: np.ndarray,
        y: np.ndarray,
        batch_size: int = config.model.batch_size,
        is_training: bool = True,
        augment: bool = False
    ) -> tf.data.Dataset:
        """
        Constructs optimized TensorFlow `tf.data.Dataset` pipeline with batching, prefetching, and caching.
        """
        # Normalize to float32 range [0.0, 1.0]
        X_norm = X.astype(np.float32) / 255.0
        ds = tf.data.Dataset.from_tensor_slices((X_norm, y))

        if is_training:
            ds = ds.shuffle(buffer_size=len(X))

        ds = ds.batch(batch_size)

        if is_training and augment:
            # Real-time random augmentation
            augment_layers = tf.keras.Sequential([
                tf.keras.layers.RandomRotation(0.05),
                tf.keras.layers.RandomFlip("horizontal"),
                tf.keras.layers.RandomZoom(0.05)
            ])
            ds = ds.map(lambda x, label: (augment_layers(x, training=True), label), num_parallel_calls=tf.data.AUTOTUNE)

        ds = ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
        return ds

    def export_dataset_summary(self, y: np.ndarray) -> Dict[str, Any]:
        """Generates summary statistics for loaded dataset."""
        unique, counts = np.unique(y, return_counts=True)
        stats = {
            "Total_Images": int(len(y)),
            "Class_Distribution": {self.class_names[u]: int(c) for u, c in zip(unique, counts)},
            "Target_Image_Resolution": self.target_size
        }
        logger.info(f"Dataset Summary: {stats}")
        return stats
