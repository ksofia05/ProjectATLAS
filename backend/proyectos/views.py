import re
import uuid
from rest_framework import viewsets
from rest_framework.decorators import api_view
from .serializer import ProyectSerializer, ProyectoSerializer
from rest_framework.response import Response
from .models import Proyect, Proyecto, ColaboradorProyecto
from tasks.models import Rol, Usuario
from proyectos.models import ColaboradorProyecto
import jwt
from datetime import datetime

class ProyectView(viewsets.ModelViewSet):
    serializer_class = ProyectSerializer
    queryset = Proyect.objects.all()

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        queryset = Proyecto.objects.all()
        user_id = self.request.query_params.get('id_usuario')
        if user_id:
            # Proyectos donde es admin
            admin_projects = queryset.filter(id_usuario=user_id)
            # Proyectos donde es colaborador
            colaborador_projects = queryset.filter(colaboradorproyecto__usuario__idusuario=user_id)
            # Unir ambos y eliminar duplicados
            queryset = (admin_projects | colaborador_projects).distinct()
        return queryset

class ProyectoUUIDViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    def get_queryset(self):
        uuid_supabase = self.request.query_params.get('uuid_supabase')
        if uuid_supabase:
            usuario = Usuario.objects.get(uuid_supabase=uuid_supabase)
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
            usuario = obtener_usuario_por_email_o_uuid(uuid=user_uuid)
            if not usuario:
                return Response({'error': 'Usuario no encontrado'}, status=401)
            print(f"Usuario autenticado: {usuario}")
            if Proyecto.objects.filter(id_usuario=usuario).exists():
                print("ya tiene un proyecto asociado")
                return Response({'mensaje': 'ya tiene un proyecto asociado a su cuenta'}, status=400)
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
        usuario = obtener_usuario_por_email_o_uuid(email=email)
        if not usuario:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        proyectos = Proyecto.objects.filter(id_usuario=usuario)
        proyectos_serializados = [
            {
                'id': proyecto.id_proyecto,
                'nombreproyecto': proyecto.nombreproyecto,
                'fechacreacion': proyecto.fechacreacion,
            }
            for proyecto in proyectos
        ]
        return Response(proyectos_serializados, status=200)
    except Exception as e:
        print(e)
        return Response({'error': 'Error al obtener proyectos'}, status=500)

@api_view(['POST'])
def asociar_colaborador(request):
    email = request.data.get('email')
    id_proyecto = request.data.get('id_proyecto')
    exp = request.data.get('exp')

    if exp:
        now = int(datetime.utcnow().timestamp())
        if now > int(exp):
            return Response({
                'success': False,
                'message': 'El link de invitación ha expirado.'
            }, status=410)
    
    if not email or not id_proyecto:
        return Response({'error': 'Faltan datos'}, status=400)
    
    try:
        usuario = Usuario.objects.get(correoelectronico=email)
        proyecto = Proyecto.objects.get(id_proyecto=id_proyecto)
        
        if usuario.rol_idrol and usuario.rol_idrol.idrol == 1: #Aca se verifica que sea admin 
            return Response({
                'error': 'Un administrador no puede asociarse como colaborador.'
            }, status=400)
        
        if ColaboradorProyecto.objects.filter(usuario=usuario).exists(): # Verificamos si el usuario ya es colaborador de algún proyecto
            return Response({
                'error': 'Un colaborador no puede estar en más de un proyecto.'
            }, status=400)
        
        # Asignar rol de colaborador si no lo tiene
        rol_colaborador = Rol.objects.get(idrol=2)
        if usuario.rol_idrol != rol_colaborador:
            usuario.rol_idrol = rol_colaborador
            usuario.save()
        
        #Con esto se obtiene la relacion Colaborador-Proyecto
        ColaboradorProyecto.objects.get_or_create(usuario=usuario, proyecto=proyecto)
        return Response({'success': True})
        
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)
    except Proyecto.DoesNotExist:
        return Response({'error': 'Proyecto no encontrado'}, status=404)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)

@api_view(['GET'])
def info_proyecto_colaboradores(request):
    id_proyecto = request.query_params.get('id_proyecto')
    if not id_proyecto:
        return Response({'error': 'ID de proyecto no proporcionado'}, status=400)
    try:
        proyecto = Proyecto.objects.get(id_proyecto=id_proyecto)
        colaboradores = ColaboradorProyecto.objects.filter(proyecto=proyecto, usuario__estado="Activo")
        colaboradores_data = []
        for colab in colaboradores:
            usuario = colab.usuario
            colaboradores_data.append({
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "correo": usuario.correoelectronico,
                "rol": "administrador" if usuario.rol_idrol and usuario.rol_idrol.idrol == 1 else "colaborador"
            })
            if proyecto.id_usuario:
                admin = proyecto.id_usuario
                if not any(c['correo'] == admin.correoelectronico for c in colaboradores_data):
                    colaboradores_data.insert(0, {
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
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def filtro_colaborador(request):
    id_proyecto = request.query_params.get('id_proyecto')
    if not id_proyecto:
        return Response({'error': 'ID de proyecto no proporcionado'}, status=400)
    try:
        proyecto = Proyecto.objects.get(id_proyecto=id_proyecto)
        colaboradores = ColaboradorProyecto.objects.filter(proyecto=proyecto)
        colaboradores_data = []
        for colab in colaboradores:
            usuario = colab.usuario
            colaboradores_data.append({
                "id": usuario.idusuario,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "correo": usuario.correoelectronico,
                "estado": usuario.estado,
                "rol": "administrador" if usuario.rol_idrol and usuario.rol_idrol.idrol == 1 else "colaborador"
            })
        return Response({
            "nombreproyecto": proyecto.nombreproyecto,
            "colaboradores": colaboradores_data
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['PATCH'])
def actualizar_estado_usuario(request, id_usuario):
    try:
        usuario = Usuario.objects.get(idusuario=id_usuario)
        nuevo_estado = request.data.get('estado')
        if nuevo_estado not in ["Activo", "Inactivo"]:
            return Response({'error': 'Estado inválido'}, status=400)
        usuario.estado = nuevo_estado
        usuario.save()
        return Response({'message': 'Estado actualizado correctamente', 'nuevo_estado': usuario.estado})
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def proyectos_colaboradores(request):
    id_usuario = request.query_params.get('id_usuario')
    if not id_usuario:
        return Response({'error': 'ID de usuario no proporcionado'}, status=400)
    try:
        usuario = Usuario.objects.get(idusuario=id_usuario)
        colaboraciones = ColaboradorProyecto.objects.filter(usuario=usuario)
        proyectos = [c.proyecto for c in colaboraciones]
        serializer = ProyectoSerializer(proyectos, many=True)
        return Response({'proyectos': serializer.data}, status=200)
    except Usuario.DoesNotExist:
        return Response({'proyectos': []}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    


# Este es un endpoint que verifica el estado de un colaborador antes de permitirle acceder a un proyecto.

@api_view(['GET'])
def estado_colaborador_proyecto(request):
    id_usuario = request.query_params.get('id_usuario')
    id_proyecto = request.query_params.get('id_proyecto')
    if not id_usuario or not id_proyecto:
        return Response({'error': 'Faltan datos'}, status=400)
    try:
        usuario = Usuario.objects.get(idusuario=id_usuario)
        proyecto = Proyecto.objects.get(id_proyecto=id_proyecto)
        
        if proyecto.id_usuario and proyecto.id_usuario.idusuario == usuario.idusuario:
            return Response({'estado': usuario.estado})
        # Verificar si el usuario es colaborador del proyecto
        colaboracion = ColaboradorProyecto.objects.filter(usuario=usuario, proyecto=proyecto).first()
        if colaboracion:
            return Response({'estado': usuario.estado})
        # Si no es colaborador ni administrador, retornar inactivo
        return Response({'estado': 'Inactivo'})
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)
    except Proyecto.DoesNotExist:
        return Response({'error': 'Proyecto no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)