import os
from pathlib import Path
import dj_database_url
from decouple import config

# Importar todo del settings base
from .settings import *

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Render detection
RENDER = config('RENDER', default=False, cast=bool)

# Hosts permitidos
ALLOWED_HOSTS = config('DJANGO_ALLOWED_HOSTS', default='localhost').split(',')

# Secret key
SECRET_KEY = config('DJANGO_SECRET_KEY', default='change-me-in-production')

# Database - Solo para producción
if RENDER:
    DATABASES = {
        'default': dj_database_url.parse(config('DATABASE_URL'))
    }

# Static files - CONFIGURACIÓN CRÍTICA
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Limpiar STATICFILES_DIRS - eliminar paths problemáticos
STATICFILES_DIRS = []

# WhiteNoise para servir archivos estáticos
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000').split(',')

# Middleware con WhiteNoise
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]