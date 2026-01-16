# Gunicorn configuration for Render deployment
import os

# Bind to PORT environment variable
bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"

# Worker configuration
workers = 1  # Free tier has limited memory
worker_class = "sync"
timeout = 120  # Increase timeout to 120 seconds
graceful_timeout = 120

# Preload app to speed up worker boot
preload_app = False  # Disabled to reduce memory usage

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
