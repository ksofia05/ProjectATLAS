import re
import uuid
from rest_framework import viewsets # Importa el módulo viewsets de Django REST Framework, que permite crear vistas basadas en conjuntos de datos (viewsets).
from rest_framework.decorators import api_view # Importa el decorador api_view para definir vistas basadas en funciones.
from .serializer import ProyectSerializer,ProyectoSerializer # Importa el serializador que define cómo se transforman los datos del modelo Task a JSON y viceversa.
from rest_framework.response import Response # Importa la clase Response para devolver respuestas HTTP.
from .models import Proyect,Proyecto, ColaboradorProyecto # Importa el modelo Task, que representa la estructura de los datos en la base de datos.
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
            usuario=Usuario.objects.get(uuid_supabase=uuid_supabase)
            if usuario.rol_idrol and usuario.rol_idrol.idrol == 1:
                return Proyecto.objects.filter(id_usuario=usuario)
        return Proyecto.objects.none()
    



@api_view(['POST'])
def save_proyect(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and (auth_header.startswith('Bearer') or auth_header.startswith('Token')):
        token = auth_header.split(' ')[1]
        print(f"Token recibido: {token}")
        try:
            decoded = jwt.decode(token, options={"verify_signature": False})
            print("Payload decodificado:", decoded)
            user_uuid = decoded.get('sub') or decoded.get('user_id') or decoded.get('id')
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
                rol = Rol.objects.get(idrol=1)
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
                # 'enlace': proyecto.enlace,
            }
            for proyecto in proyectos
        ]
        return Response(proyectos_serializados, status=200)
    except Exception as e:
        print(e)
        return Response({'error': 'Error al obtener proyectos'}, status=500)
    

@api_view(['POST'])
def asociar_colaborador(request):
    email=request.data.get('email')
    id_proyecto=request.data.get('id_proyecto')
    if not email or not id_proyecto:
        return Response({'error':'Faltan datos'}, status=400)
    try:
        usuario = Usuario.objects.get(correoelectronico=email)
        rol_colaborador = Rol.objects.get(idrol=2)  
        if usuario.rol_idrol != rol_colaborador:
            usuario.rol_idrol = rol_colaborador
            usuario.save()
        proyecto = Proyecto.objects.get(id_proyecto=id_proyecto)
        ColaboradorProyecto.objects.get_or_create(usuario=usuario, proyecto=proyecto)
        return Response({'success':True})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)

@api_view(['GET'])
def info_proyecto_colaboradores(request):
    id_proyecto = request.query_params.get('id_proyecto')
    if not id_proyecto:
        return Response({'error': 'ID de proyecto no proporcionado'}, status=400)
    try:
        proyecto = Proyecto.objects.get(id_proyecto=id_proyecto)
        colaboradores= ColaboradorProyecto.objects.filter(proyecto=proyecto)
        colaboradores_data=[]
        for colab in colaboradores:
            usuario=colab.usuario
            colaboradores_data.append({
                "nombre":usuario.nombre,
                "apellido": usuario.apellido,
                "correo": usuario.correoelectronico,
                "rol": "administrador" if usuario.rol_idrol and usuario.rol_idrol.idrol == 1 else "colaborador"
            })
            if proyecto.id_usuario:
                admin = proyecto.id_usuario
                if not any(c['correo']==admin.correoelectronico for c in colaboradores_data):
                    colaboradores_data.insert(0,{
                        "nombre": admin.nombre,
                        "apellido": admin.apellido,
                        "correo": admin.correoelectronico,
                        "rol": "Administrador"
                    })
        return Response({
            "nombreproyecto": proyecto.nombreproyecto,
            "colaboradores": colaboradores_data
        })
    except Exception as e:
        return Response({'error': str(e)},status=400)
# Create your views here.
