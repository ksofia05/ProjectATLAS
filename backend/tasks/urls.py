from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from tasks import views
from tasks.views import login_usuario  

#api versioning
router = routers.DefaultRouter()
router.register(r"tasks", views.TaskView, 'tasks')
router.register(r'usuarios', views.UsuarioViewSet, basename='usuario')
router.register(r'roles', views.RolViewSet, basename='rol')  

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="ATLAS API")),
    path('api/v1/login/', login_usuario),  # Activar la ruta personalizada para login
]