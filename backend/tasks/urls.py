from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from tasks import views as task_views
from proyectos import views as proyectos_views
from inventario import views as inventario_views
from tasks.views import login_usuario, registe_usuario, recuperacion_contra, password_reset, invitacion_colaborador, verificar_correo_existente, quitar_colaborador_de_proyecto
from proyectos.views import save_proyect, ProyectoUUIDViewSet, get_user_projects, info_proyecto_colaboradores, filtro_colaborador, actualizar_estado_usuario, asociar_colaborador, proyectos_colaboradores, estado_colaborador_proyecto
from inventario.views import clientes_por_proyecto

# API versioning
router = routers.DefaultRouter()
router.register(r"tasks", task_views.TaskView, 'tasks')
router.register(r"Proyect", proyectos_views.ProyectView, 'proyect')
router.register(r'usuarios', task_views.UsuarioViewSet, basename='usuario')
router.register(r'roles', task_views.RolViewSet, basename='rol')
router.register(r'Proyecto', proyectos_views.ProyectoViewSet, basename='proyecto')
router.register(r'ProyectoUUID', ProyectoUUIDViewSet, basename='proyecto-uuid')
router.register(r'agendamientos', inventario_views.AgendamientoViewSet, basename='agendamiento')
router.register(r'clientes', inventario_views.ClienteViewSet, basename='cliente')
router.register(r'equipos', inventario_views.EquipoViewSet, basename='equipo')
router.register(r'equipo-agendamientos', inventario_views.EquipoAgendamientoViewSet, basename='equipoagendamiento')

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="ATLAS API")),
    path('api/v1/login/', login_usuario),  # Activar la ruta personalizada para login
    path('api/v1/register/', registe_usuario),
    path('api/v1/recuperacionContrasena', recuperacion_contra),
    path('api/v1/password-reset/', password_reset),
    path('api/v1/save_proyect/', save_proyect, name='save_proyect'),
    path('api/v1/get_user_projects/', get_user_projects, name='get_user_projects'),
    path('api/v1/invitacionColaborador/', invitacion_colaborador, name='invitacion_colborador'),
    path('api/v1/filtro_colaborador/', filtro_colaborador, name='filtro_colaborador'),
    path('api/v1/asociar_colaborador/', asociar_colaborador, name='asociar_colaborador'),
    path('api/v1/info_proyecto_colaboradores/', info_proyecto_colaboradores, name='info_proyecto_colaboradores'),
    path('api/v1/usuarios/<int:id_usuario>/estado/', actualizar_estado_usuario, name='actualizar_estado_usuario'),
    path('api/v1/clientes_por_proyecto/', clientes_por_proyecto),
    path('api/v1/proyectos_colaboradores/', proyectos_colaboradores, name='proyectos_colaboradores'),
    path('api/v1/verificar-correo/', verificar_correo_existente, name='verificar_correo_existente'),
    path('api/v1/quitar_colaborador_de_proyecto/', quitar_colaborador_de_proyecto, name='quitar_colaborador_de_proyecto'),


     #este es un endpoint que verifica el estado de un colaborador
    path('api/v1/estado_colaborador_proyecto/', estado_colaborador_proyecto, name='estado_colaborador_proyecto'),
]