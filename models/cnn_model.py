"""
Production-Grade Custom Deep Residual CNN Architecture for Brain Tumor Detection.
Features:
- Residual Convolutional Blocks with skip connections
- Batch Normalization & Spatial Dropout
- Global Average Pooling (GAP)
- Mixed Precision Training Support (float16 / mixed_float16)
- Configurable Keras Callbacks (EarlyStopping, ReduceLROnPlateau, TensorBoard, ModelCheckpoint)
- GPU execution optimization
"""

from pathlib import Path
from typing import Tuple, List, Optional, Union
import tensorflow as tf
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, BatchNormalization, Dropout,
    Dense, Input, GlobalAveragePooling2D, Add, ReLU, Activation
)
from tensorflow.keras.regularizers import l2
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    EarlyStopping, ReduceLROnPlateau, ModelCheckpoint, TensorBoard, Callback
)
from config.config import config, ModelConfig
from utils.logger import logger
from utils.exceptions import ModelError

class BrainTumorCNN:
    """Deep Residual Neural Network Architecture Builder & Keras Model Wrapper."""

    def __init__(self, cfg: ModelConfig = config.model, enable_mixed_precision: bool = True):
        self.cfg = cfg
        self.enable_mixed_precision = enable_mixed_precision
        self.model: Optional[Model] = None
        
        if self.enable_mixed_precision:
            try:
                gpus = tf.config.list_physical_devices("GPU")
                if gpus:
                    tf.keras.mixed_precision.set_global_policy("mixed_float16")
                    logger.info("Mixed Precision policy 'mixed_float16' enabled for GPU acceleration.")
            except Exception as e:
                logger.warning(f"Could not initialize mixed precision policy: {e}")

    @staticmethod
    def residual_block(input_tensor: tf.Tensor, filters: int, kernel_size: Tuple[int, int] = (3, 3), l2_reg: float = 1e-4) -> tf.Tensor:
        """
        Constructs a Residual Convolutional Block with projection shortcut matching.
        """
        # Shortcut Branch
        in_channels = input_tensor.shape[-1]
        if in_channels != filters:
            shortcut = Conv2D(filters, (1, 1), padding="same", kernel_regularizer=l2(l2_reg))(input_tensor)
            shortcut = BatchNormalization()(shortcut)
        else:
            shortcut = input_tensor

        # Conv Path 1
        x = Conv2D(filters, kernel_size, padding="same", kernel_regularizer=l2(l2_reg))(input_tensor)
        x = BatchNormalization()(x)
        x = ReLU()(x)

        # Conv Path 2
        x = Conv2D(filters, kernel_size, padding="same", kernel_regularizer=l2(l2_reg))(x)
        x = BatchNormalization()(x)

        # Add Skip Connection
        x = Add()([x, shortcut])
        x = ReLU()(x)
        return x

    def build_model(self) -> Model:
        """
        Builds custom Deep Residual CNN model with input shape 128x128x3.
        """
        input_shape = self.cfg.input_shape
        l2_reg = self.cfg.cnn_dropout_rate if hasattr(self.cfg, "l2_reg") else 1e-4

        inputs = Input(shape=input_shape, name="mri_input")

        # Initial Feature Extractor
        x = Conv2D(32, (5, 5), strides=2, padding="same", kernel_regularizer=l2(1e-4))(inputs)
        x = BatchNormalization()(x)
        x = ReLU()(x)
        x = MaxPooling2D((2, 2))(x)

        # Residual Block 1
        x = self.residual_block(x, filters=32, l2_reg=1e-4)
        x = Dropout(0.25)(x)

        # Residual Block 2
        x = self.residual_block(x, filters=64, l2_reg=1e-4)
        x = MaxPooling2D((2, 2))(x)
        x = Dropout(0.3)(x)

        # Residual Block 3
        x = self.residual_block(x, filters=128, l2_reg=1e-4)
        x = MaxPooling2D((2, 2))(x)
        x = Dropout(0.4)(x)

        # Residual Block 4
        x = self.residual_block(x, filters=256, l2_reg=1e-4)
        x = Dropout(0.4)(x)

        # Classification Head
        x = GlobalAveragePooling2D(name="global_avg_pool")(x)
        x = Dense(256, kernel_regularizer=l2(1e-4))(x)
        x = BatchNormalization()(x)
        x = ReLU()(x)
        x = Dropout(self.cfg.cnn_dropout_rate)(x)

        outputs = Dense(self.cfg.num_classes, activation="softmax", dtype="float32", name="softmax_output")(x)

        model = Model(inputs=inputs, outputs=outputs, name="BrainTumor_ResNet_CNN")
        self.model = model
        self.compile_model()
        logger.info("Custom Deep Residual CNN built successfully.")
        return model

    def compile_model(self, learning_rate: Optional[float] = None) -> None:
        """Compiles Keras model with Adam optimizer and sparse categorical crossentropy."""
        if self.model is None:
            raise ModelError("Cannot compile unbuilt model.")
        lr = learning_rate if learning_rate is not None else self.cfg.learning_rate
        optimizer = Adam(learning_rate=lr)
        self.model.compile(
            optimizer=optimizer,
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"]
        )
        logger.info(f"Compiled CNN model with Adam optimizer (lr={lr}).")

    def get_callbacks(
        self,
        checkpoint_path: Optional[Path] = None,
        tensorboard_dir: Optional[Path] = None
    ) -> List[Callback]:
        """Configures production training callbacks: EarlyStopping, ReduceLROnPlateau, ModelCheckpoint, TensorBoard."""
        ckpt_p = checkpoint_path if checkpoint_path else config.paths.saved_models_dir / self.cfg.cnn_model_filename
        tb_p = tensorboard_dir if tensorboard_dir else config.paths.logs_dir / "tensorboard_cnn"

        ckpt_p.parent.mkdir(parents=True, exist_ok=True)
        tb_p.mkdir(parents=True, exist_ok=True)

        return [
            ModelCheckpoint(
                filepath=str(ckpt_p),
                monitor="val_accuracy",
                save_best_only=True,
                mode="max",
                verbose=1
            ),
            EarlyStopping(
                monitor="val_loss",
                patience=self.cfg.patience_early_stopping,
                restore_best_weights=True,
                verbose=1
            ),
            ReduceLROnPlateau(
                monitor="val_loss",
                factor=0.5,
                patience=self.cfg.patience_reduce_lr,
                min_lr=self.cfg.min_lr,
                verbose=1
            ),
            TensorBoard(log_dir=str(tb_p), histogram_freq=1)
        ]

    def summary(self) -> str:
        """Returns string representation of network architecture summary."""
        if self.model is None:
            return "Model not built."
        string_list = []
        self.model.summary(print_fn=lambda x: string_list.append(x))
        return "\n".join(string_list)

    def save(self, filepath: Union[str, Path]) -> None:
        """Saves compiled Keras model to disk."""
        if self.model is None:
            raise ModelError("Cannot save uninitialized model.")
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)
        self.model.save(str(path))
        logger.info(f"Saved CNN model to {path}")

    def load(self, filepath: Union[str, Path]) -> Model:
        """Loads compiled Keras model from disk."""
        path = Path(filepath)
        if not path.exists():
            raise ModelError(f"Model file does not exist: {path}")
        self.model = load_model(str(path))
        logger.info(f"Loaded CNN model from {path}")
        return self.model
