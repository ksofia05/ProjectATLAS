import os
import sys
from pathlib import Path
import dj_database_url
from decouple import config

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent

# Security
SECRET_KEY = config('DJANGO_SECRET_KEY', default='django-insecure-change-me-in-production-key-atlas-2024')
DEBUG = config('DEBUG', default=True, cast=bool)  # ← True para debug
RENDER = config('RENDER', default=False, cast=bool)

# ✅ HOSTS CORRECTOS
ALLOWED_HOSTS = [
    'projectatlas-backend.onrender.com',
    'localhost',
    '127.0.0.1',
    '.onrender.com',
    '*'  # ← Temporalmente permitir todos
]

# ✅ CORS CONFIGURADO
CORS_ALLOWED_ORIGINS = [
    'https://projectatlas-frontend.onrender.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # ← Temporalmente permitir todos

# Applications - ORDEN CORRECTO
INSTALLED_APPS = [
    # Django core apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps - ANTES de las custom apps
    'corsheaders',
    'rest_framework',
    'django_extensions',
    
    # Project apps
    'tasks',
    'proyectos',
    'inventario',
    'colaboradores',
    'calendario',
    
    # Admin interface AL FINAL
    'admin_interface',
    'colorfield',
]

# ✅ MIDDLEWARE CORS AL INICIO
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ✅ PRIMERO
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'backend.wsgi.application'

# ✅ DATABASE CONFIGURADA CORRECTAMENTE
DATABASE_URL = config('DATABASE_URL', default=None)
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=True)
    }
    print(f"✅ Base de datos configurada desde DATABASE_URL")
else:
    # Fallback para desarrollo
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    print("🔧 Usando SQLite para desarrollo")

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ✅ STATIC FILES CONFIGURADOS
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'staticfiles')
STATICFILES_DIRS = []
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ✅ REST FRAMEWORK CONFIGURADO
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    "DEFAULT_SCHEMA_CLASS": "rest_framework.schemas.coreapi.AutoSchema",
}

# Logging mejorado para debug
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
        'django.db': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    },
}

# Security settings
if RENDER and not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    X_FRAME_OPTIONS = 'DENY'

# Debug info
print("=== CONFIGURACIÓN DE PRODUCCIÓN ATLAS ===")
print(f"DEBUG: {DEBUG}")
print(f"RENDER: {RENDER}")
print(f"ALLOWED_HOSTS: {ALLOWED_HOSTS}")
print(f"CORS_ALLOWED_ORIGINS: {CORS_ALLOWED_ORIGINS}")
print(f"DATABASE_URL configurado: {'✅' if DATABASE_URL else '❌'}")
print(f"Verificando apps:")
for app in ['tasks', 'proyectos', 'inventario', 'colaboradores', 'calendario']:
    exists = (BASE_DIR / app).exists()
    print(f"  {app}: {'✅' if exists else '❌'}")
print("==========================================")