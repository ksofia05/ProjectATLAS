import re
import uuid
from rest_framework import viewsets # Importa el módulo viewsets de Django REST Framework, que permite crear vistas basadas en conjuntos de datos (viewsets).
from rest_framework.decorators import api_view # Importa el decorador api_view para definir vistas basadas en funciones.
from .serializer import ProyectSerializer,ProyectoSerializer # Importa el serializador que define cómo se transforman los datos del modelo Task a JSON y viceversa.
from rest_framework.response import Response # Importa la clase Response para devolver respuestas HTTP.
from .models import Proyect,Proyecto # Importa el modelo Task, que representa la estructura de los datos en la base de datos.
from tasks.models import Rol,Usuario
from rest_framework.response import Response
import jwt

# Define un conjunto de vistas (viewset) para el modelo Task.
class ProyectView(viewsets.ModelViewSet):
    serializer_class = ProyectSerializer # Especifica el serializador que se usará para convertir los datos del modelo Task.
    queryset = Proyect.objects.all() # Define el conjunto de datos (queryset) que se usará en este viewset, en este caso, todos los objetos del modelo Task.

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        queryset = Proyecto.objects.all()
        user_id = self.request.query_params.get('id_usuario')
        if user_id:
            queryset = queryset.filter(id_usuario=user_id)
        return queryset
    
class ProyectoUUIDViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        
        uuid_supabase = self.request.query_params.get('uuid_supabase')
        if uuid_supabase:
            return Proyecto.objects.filter(id_usuario__uuid_supabase=uuid_supabase, id_usuario__rol_idrol__nombre='administrador')
        return Proyecto.objects.none()


@api_view(['POST'])
def save_proyect(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Token'):
        token = auth_header.split(' ')[1]
        print(f"Token recibido: {token}")
        try:
            decoded = jwt.decode(token, options={"verify_signature": False})
            user_uuid = decoded.get('sub')
            if not user_uuid:
                return Response({'error': 'Token sin id'}, status=401)
            
            # Usar la función auxiliar para obtener el usuario
            usuario = obtener_usuario_por_email_o_uuid(uuid=user_uuid)
            if not usuario:
                return Response({'error': 'Usuario no encontrado'}, status=401)
            
            print(f"Usuario autenticado: {usuario}")
            if Proyecto.objects.filter(id_usuario=usuario).exists():
                print("ya tiene un proyecto asociado")
                return Response({'mensaje': 'ya tiene un proyecto asociado a su cuenta'}, status=400)

            # Crear proyecto
            if not usuario.rol_idrol:
                rol = Rol.objects.create(nombre='administrador')
                usuario.rol_idrol = rol
                usuario.save()
            else:
                rol = usuario.rol_idrol

            proyecto = Proyecto.objects.create(
                nombreproyecto=request.data.get('nombreproyecto'),
                id_usuario=usuario
            )
            return Response({'mensaje': 'Proyecto creado con éxito',
                             'proyecto': {
                                 'id': proyecto.id_proyecto,
                                 'nombreproyecto': proyecto.nombreproyecto,
                                 'fechacreacion': proyecto.fechacreacion,
                                 'enlace': proyecto.enlace
                             },
                             'nombre': proyecto.nombreproyecto}, status=201)
        except Exception as e:
            print(e)
            return Response({'error': 'Token inválido'}, status=401)
    else:
        return Response({'error': 'Token no enviado'}, status=401)
    
def obtener_usuario_por_email_o_uuid(email=None, uuid=None):
    try:
        if email:
            return Usuario.objects.get(correoelectronico=email)
        elif uuid:
            return Usuario.objects.get(uuid_supabase=uuid)
        else:
            return None
    except Usuario.DoesNotExist:
        return None
    
@api_view(['GET'])
def get_user_projects(request):
    email = request.query_params.get('correoelectronico')
    if not email:
        return Response({'error': 'Correo electrónico no proporcionado'}, status=400)

    try:
        # Usar la función auxiliar para obtener el usuario
        usuario = obtener_usuario_por_email_o_uuid(email=email)
        if not usuario:
            return Response({'error': 'Usuario no encontrado'}, status=404)

        proyectos = Proyecto.objects.filter(id_usuario=usuario)

        # Serializar los proyectos
        proyectos_serializados = [
            {
                'id': proyecto.id_proyecto,
                'nombreproyecto': proyecto.nombreproyecto,
                'fechacreacion': proyecto.fechacreacion,
                'enlace': proyecto.enlace,
            }
            for proyecto in proyectos
        ]
        return Response(proyectos_serializados, status=200)
    except Exception as e:
        print(e)
        return Response({'error': 'Error al obtener proyectos'}, status=500)
# Create your views here.
