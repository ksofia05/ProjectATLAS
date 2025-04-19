from django.contrib import admin
from django.urls import path, include
from autenticacion import views

urlpatterns = [
    path('login/', views.login_view, name='login'),  # Ruta para el inicio de sesión
    path('register/', views.register, name='register'),  # Primer paso del registro
    path('register2/', views.register2, name='register2'),  # Segundo paso del registro
]