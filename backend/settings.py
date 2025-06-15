import environ
import os

env = environ.Env()
environ.Env.read_env()

# ... existing settings ...

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'innovest05@gmail.com'
EMAIL_HOST_PASSWORD = 'dhossfvtgdahfdam'
DEFAULT_FROM_EMAIL = 'Innovest <innovest05@gmail.com>'
SERVER_EMAIL = 'innovest05@gmail.com'

# Security settings for email
EMAIL_TIMEOUT = 30  # Timeout in seconds
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# Template configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'contact', 'templates'),
            os.path.join(BASE_DIR, 'payments', 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'DEBUG',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.template': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# Add to INSTALLED_APPS if not already present
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'authentication',
    'contact',
    'payments',
]

# Payment Gateway Settings
BACKEND_URL = 'http://localhost:8000'  # Django server URL
FRONTEND_URL = 'http://localhost:3000'  # React server URL

# SSLCommerz Settings
SSLCOMMERZ_STORE_ID = 'innov6824dba3dae37'
SSLCOMMERZ_STORE_PASS = 'innov6824dba3dae37@ssl'
SSLCOMMERZ_SANDBOX = True  # Set to False for production

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
} 