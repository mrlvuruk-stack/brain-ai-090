"""
Production-Grade Custom Exception Hierarchy for Brain MRI Tumor Detection Subsystem.
Provides granular exception classes for distinct operational failure modes:
- BrainTumorDetectionError (Base)
- DatasetError
- MRIProcessingError
- SegmentationError
- FeatureExtractionError
- PredictionError
- TrainingError
- ModelError
- GUIError
"""

class BrainTumorDetectionError(Exception):
    """Base exception class for the application workspace."""
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

    def __str__(self) -> str:
        return f"[{self.__class__.__name__}]: {self.message}"

class DatasetError(BrainTumorDetectionError):
    """Raised when dataset scanning, corruption detection, or partitioning fails."""
    pass

class MRIProcessingError(BrainTumorDetectionError):
    """Raised when an error occurs during image enhancement or skull stripping."""
    pass

class SegmentationError(BrainTumorDetectionError):
    """Raised when tumor segmentation algorithms fail or fail to find brain tissue."""
    pass

class FeatureExtractionError(BrainTumorDetectionError):
    """Raised when GLCM, statistical, or geometric feature extraction fails."""
    pass

class PredictionError(BrainTumorDetectionError):
    """Raised when single or batch diagnostic inference fails."""
    pass

class TrainingError(BrainTumorDetectionError):
    """Raised when deep learning or SVM model training workflows fail."""
    pass

class ModelError(BrainTumorDetectionError):
    """Raised when model compilation, loading, or serialization fails."""
    pass

class GUIError(BrainTumorDetectionError):
    """Raised when desktop dashboard interactions or rendering fail."""
    pass
