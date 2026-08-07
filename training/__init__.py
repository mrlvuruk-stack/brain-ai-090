"""
Training package initialization.
"""
from .train_cnn import CNNTrainer
from .train_svm import SVMTrainer

__all__ = ["CNNTrainer", "SVMTrainer"]
