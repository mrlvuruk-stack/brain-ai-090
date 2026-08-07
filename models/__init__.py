"""
Models package initialization.
"""
from .cnn_model import BrainTumorCNN
from .svm_model import BrainTumorSVM

__all__ = ["BrainTumorCNN", "BrainTumorSVM"]
