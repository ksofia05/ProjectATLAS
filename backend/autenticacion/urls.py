from django.contrib import admin
from django.urls import path, include
from autenticacion import views

urlpatterns = [
    path('login/', views.login_view, name='login'),  # Ruta para el inicio de sesión
    path('register/', views.register, name='register'),  # Primer paso del registro
    path('register2/', views.register2, name='register2'),  # Segundo paso del registro
    path('terminos/', views.terminos, name='terminos'), # Ruta para los términos y condiciones
    path('politicas/', views.politicas, name='politicas'), # Ruta para las políticas de privacidad
    path('simulacion/', views.simulacion, name='simulacion'),
    path('recuperar_contrasena/', views.recuperar_contrasena, name='recuperar_contrasena'),
    path('reenviar_enlace/', views.reenviar_enlace, name='reenviar_enlace'),  # Nueva ruta
    
]