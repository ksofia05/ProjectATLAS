from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from tasks import views
from tasks.views import login_usuario,registe_usuario, recuperacion_contra, password_reset

#api versioning
router = routers.DefaultRouter()
router.register(r"tasks", views.TaskView, 'tasks')
router.register(r'usuarios', views.UsuarioViewSet, basename='usuario')
router.register(r'roles', views.RolViewSet, basename='rol')  

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="ATLAS API")),
    path('api/v1/login/', login_usuario),  # Activar la ruta personalizada para login
    path('api/v1/register/', registe_usuario),
    path('api/v1/recuperacionContrasena', recuperacion_contra), 
    path('api/v1/password-reset/', password_reset),
    
]