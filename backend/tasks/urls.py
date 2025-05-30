from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from tasks import views as task_views
from proyectos import views as proyectos_views
from tasks.views import login_usuario,registe_usuario, recuperacion_contra, password_reset
from proyectos.views import save_proyect

#api versioning
router = routers.DefaultRouter()
router.register(r"tasks", task_views.TaskView, 'tasks')
router.register(r"Proyect", proyectos_views.ProyectView, 'proyect')
router.register(r'usuarios', task_views.UsuarioViewSet, basename='usuario')
router.register(r'roles', task_views.RolViewSet, basename='rol')   
router.register(r'Proyecto', proyectos_views.ProyectoViewSet, basename='proyecto') 

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="ATLAS API")),
    path('api/v1/login/', login_usuario),  # Activar la ruta personalizada para login
    path('api/v1/register/', registe_usuario),
    path('api/v1/recuperacionContrasena', recuperacion_contra), 
    path('api/v1/password-reset/', password_reset),
    path('api/v1/save_proyect/', save_proyect,name='save_proyect'),
]