import os
import dj_database_url
from decouple import config, Csv
from .settings import *

# Configuración de producción
DEBUG = False

# Hosts permitidos
ALLOWED_HOSTS = config('DJANGO_ALLOWED_HOSTS', cast=Csv(), default='projectatlas-backend.onrender.com,localhost')

# Base de datos PostgreSQL
DATABASES = {
    'default': dj_database_url.parse(
        config('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True
    )
}

# Archivos estáticos para producción
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# WhiteNoise para servir archivos estáticos
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS para producción
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS', 
    cast=Csv(), 
    default='https://projectatlas-frontend.onrender.com'
)

CORS_ALLOW_ALL_ORIGINS = False

# CSRF trusted origins
CSRF_TRUSTED_ORIGINS = [
    "https://projectatlas-frontend.onrender.com",
    "https://projectatlas-backend.onrender.com",
]

# Configuración de seguridad
SECRET_KEY = config('DJANGO_SECRET_KEY')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Logging para debugging en producción
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}