"""
Production-Grade Thread-Safe & Colored Logging Subsystem.
Configures rotating file handlers and ANSI colored console stream handlers
for system-wide operational logging across dataset processing, enhancement, training, and inference.
"""

import logging
from logging.handlers import RotatingFileHandler
import sys
from pathlib import Path
from config.config import config

class ColoredConsoleFormatter(logging.Formatter):
    """Custom ANSI Color Formatter for Console Output."""

    GREY = "\x1b[38;20m"
    BLUE = "\x1b[34;20m"
    GREEN = "\x1b[32;20m"
    YELLOW = "\x1b[33;20m"
    RED = "\x1b[31;20m"
    BOLD_RED = "\x1b[31;1m"
    RESET = "\x1b[0m"

    FORMAT = "[%(asctime)s] [%(levelname)s] [%(name)s:%(lineno)d]: %(message)s"

    FORMATS = {
        logging.DEBUG: GREY + FORMAT + RESET,
        logging.INFO: GREEN + FORMAT + RESET,
        logging.WARNING: YELLOW + FORMAT + RESET,
        logging.ERROR: RED + FORMAT + RESET,
        logging.CRITICAL: BOLD_RED + FORMAT + RESET
    }

    def format(self, record: logging.LogRecord) -> str:
        log_fmt = self.FORMATS.get(record.levelno, self.FORMAT)
        formatter = logging.Formatter(log_fmt, datefmt="%Y-%m-%d %H:%M:%S")
        return formatter.format(record)

def setup_logger(name: str = "BrainTumorDetection") -> logging.Logger:
    """
    Configures and returns singleton thread-safe logger with colored console stream and rotating file handlers.
    
    Args:
        name: Unique logger namespace name.
    Returns:
        Configured logging.Logger instance.
    """
    logger_inst = logging.getLogger(name)
    
    log_level_str = getattr(config.logging, "log_level", "INFO").upper()
    log_level = getattr(logging, log_level_str, logging.INFO)
    logger_inst.setLevel(log_level)

    if logger_inst.handlers:
        return logger_inst

    # 1. Colored Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(ColoredConsoleFormatter())
    logger_inst.addHandler(console_handler)

    # 2. Rotating File Handler
    try:
        log_file_dir = config.paths.logs_dir
        log_file_dir.mkdir(parents=True, exist_ok=True)
        log_file_name = getattr(config.logging, "log_file_name", "system.log")
        log_file_path = log_file_dir / log_file_name

        max_bytes = getattr(config.logging, "max_bytes", 10 * 1024 * 1024)
        backup_count = getattr(config.logging, "backup_count", 5)

        file_handler = RotatingFileHandler(
            log_file_path, maxBytes=max_bytes, backupCount=backup_count, encoding="utf-8"
        )
        file_fmt_str = "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s"
        file_formatter = logging.Formatter(file_fmt_str, datefmt="%Y-%m-%d %H:%M:%S")
        file_handler.setFormatter(file_formatter)
        logger_inst.addHandler(file_handler)
    except Exception as e:
        console_handler.setLevel(logging.WARNING)
        logger_inst.warning(f"Could not initialize rotating file logger handler: {e}")

    return logger_inst

# Global Singleton Thread-Safe Logger Instance
logger = setup_logger()
