"""Central logging setup."""

import logging

_logger_initialized = False


def get_logger(name: str = "chatai") -> logging.Logger:
    global _logger_initialized
    if not _logger_initialized:
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        )
        _logger_initialized = True
    return logging.getLogger(name)
