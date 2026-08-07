"""
Production-Grade Central Configuration Module for Brain MRI Tumor Detection System.
Provides type-safe dataclasses managing directory paths, multi-stage enhancement parameters,
segmentation algorithm constants, radiomic feature extraction options, model hyperparameters (CNN & SVM),
hardware device options, and thread-safe logging settings.
"""

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Tuple, List, Dict, Any

@dataclass
class PathConfig:
    """Dataclass holding all system directory and model paths."""
    base_dir: Path = field(default_factory=lambda: Path(os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))))
    data_dir: Path = field(default_factory=lambda: Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))))
    dataset_dir: Path = field(default_factory=lambda: Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset", "mri_scans"))))
    kaggle_3m_dir: Path = field(default_factory=lambda: Path(r"U:\tumor detection\kaggle_3m"))
    outputs_dir: Path = field(default_factory=lambda: Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "outputs"))))
    saved_models_dir: Path = field(default_factory=lambda: Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "outputs", "models"))))
    logs_dir: Path = field(default_factory=lambda: Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "outputs", "logs"))))

    def __post_init__(self):
        """Creates missing directories automatically upon initialization."""
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.dataset_dir.mkdir(parents=True, exist_ok=True)
        self.outputs_dir.mkdir(parents=True, exist_ok=True)
        self.saved_models_dir.mkdir(parents=True, exist_ok=True)
        self.logs_dir.mkdir(parents=True, exist_ok=True)

@dataclass
class EnhancementConfig:
    """Dataclass holding novel 16-stage MRI image enhancement parameters."""
    target_size: Tuple[int, int] = (128, 128)
    gaussian_kernel_size: Tuple[int, int] = (5, 5)
    gaussian_sigma: float = 1.0
    median_kernel_size: int = 5
    bilateral_d: int = 9
    bilateral_sigma_color: float = 75.0
    bilateral_sigma_space: float = 75.0
    nlm_h: float = 10.0
    nlm_template_window: int = 7
    nlm_search_window: int = 21
    clahe_clip_limit: float = 3.0
    clahe_tile_grid_size: Tuple[int, int] = (8, 8)
    gamma_value: float = 1.2
    contrast_stretch_percentiles: Tuple[float, float] = (2.0, 98.0)
    sharpen_amount: float = 1.5
    morphological_kernel_size: Tuple[int, int] = (3, 3)
    edge_enhancement_weight: float = 0.35

@dataclass
class SegmentationConfig:
    """Dataclass holding tumor segmentation parameters."""
    kmeans_clusters: int = 3
    fcm_clusters: int = 3
    fcm_m: float = 2.0
    fcm_max_iter: int = 100
    watershed_min_distance: int = 10
    region_growing_threshold: float = 15.0
    min_tumor_area_pixels: int = 30
    pixel_scale_mm_per_px: float = 0.264  # Standard MRI resolution conversion scale

@dataclass
class FeatureExtractionConfig:
    """Dataclass holding radiomic GLCM and geometric feature parameters."""
    glcm_distances: List[int] = field(default_factory=lambda: [1, 2, 3])
    glcm_angles: List[float] = field(default_factory=lambda: [0.0, 0.785398, 1.570796, 2.356194])  # 0, 45, 90, 135 deg
    glcm_levels: int = 256

@dataclass
class ModelConfig:
    """Dataclass holding Deep Learning CNN and Machine Learning SVM hyperparameter settings."""
    image_width: int = 128
    image_height: int = 128
    image_channels: int = 3
    input_shape: Tuple[int, int, int] = (128, 128, 3)
    num_classes: int = 2
    class_names: List[str] = field(default_factory=lambda: ["No_Tumor", "Tumor"])

    # CNN Training Hyperparameters
    batch_size: int = 32
    epochs: int = 30
    learning_rate: float = 1e-3
    cnn_dropout_rate: float = 0.4
    patience_early_stopping: int = 7
    patience_reduce_lr: int = 3
    min_lr: float = 1e-6
    cnn_model_filename: str = "cnn_resnet_brain_tumor.keras"

    # SVM Training Hyperparameters
    cv_folds: int = 5
    svm_kernel_options: List[str] = field(default_factory=lambda: ["rbf", "linear", "poly"])
    svm_c_range: List[float] = field(default_factory=lambda: [0.1, 1.0, 10.0, 50.0])
    svm_gamma_options: List[str] = field(default_factory=lambda: ["scale", "auto"])
    svm_model_filename: str = "svm_radiomics_brain_tumor.joblib"
    scaler_filename: str = "scaler_standard.joblib"

    # Dataset Stratified Split Ratios
    train_split: float = 0.70
    val_split: float = 0.15
    test_split: float = 0.15

# Aliases for backward compatibility
CNNHyperparameters = ModelConfig
SVMHyperparameters = ModelConfig

@dataclass
class DeviceConfig:
    """Dataclass managing GPU acceleration settings."""
    use_gpu: bool = True
    mixed_precision: bool = True

@dataclass
class LoggingConfig:
    """Dataclass managing rotating file logger configuration."""
    log_level: str = "INFO"
    log_file_name: str = "system.log"
    max_bytes: int = 10 * 1024 * 1024  # 10 MB
    backup_count: int = 5
    console_format: str = "[%(asctime)s] [%(levelname)s] [%(name)s:%(lineno)d]: %(message)s"
    file_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s"

@dataclass
class AppConfig:
    """Master Application Configuration Dataclass."""
    app_name: str = "A Novel Approach to Enhancement MRI Image Brain Tumor Detection"
    version: str = "2.0.0"
    paths: PathConfig = field(default_factory=PathConfig)
    enhancement: EnhancementConfig = field(default_factory=EnhancementConfig)
    segmentation: SegmentationConfig = field(default_factory=SegmentationConfig)
    features: FeatureExtractionConfig = field(default_factory=FeatureExtractionConfig)
    model: ModelConfig = field(default_factory=ModelConfig)
    device: DeviceConfig = field(default_factory=DeviceConfig)
    logging: LoggingConfig = field(default_factory=LoggingConfig)

# Global Configuration Singleton
config = AppConfig()
