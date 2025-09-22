FROM python:3.11.9-slim

# Evitar archivos pyc y usar logs en stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencias del SO necesarias para compilar psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc pkg-config \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# pip/setuptools/wheel actualizados
RUN python -m pip install --upgrade pip setuptools wheel

# Instalar dependencias de Python
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del proyecto
COPY . .

# Exponer puerto
EXPOSE 8000

# Variables de entorno útiles
ENV DJANGO_SETTINGS_MODULE=backend.settings \
    GUNICORN_WORKERS=3 \
    GUNICORN_BIND=0.0.0.0:8000 \
    GUNICORN_TIMEOUT=60

# Ejecutar Gunicorn (ajusta 'backend.wsgi' si tu proyecto tiene otro nombre)
ENV GUNICORN_BIND=0.0.0.0:8000
CMD ["sh", "-c", "gunicorn backend.wsgi:application --workers $GUNICORN_WORKERS --bind $GUNICORN_BIND --timeout $GUNICORN_TIMEOUT"]