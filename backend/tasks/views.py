import json
from logging import config
import os
import re
from supabase import create_client
import uuid
from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from rest_framework import viewsets # Importa el módulo viewsets de Django REST Framework, que permite crear vistas basadas en conjuntos de datos (viewsets).
from rest_framework.decorators import api_view # Importa el decorador api_view para definir vistas basadas en funciones.
from .serializer import TaskSerializer,UsuarioSerializer, RolSerializer # Importa el serializador que define cómo se transforman los datos del modelo Task a JSON y viceversa.
from rest_framework.response import Response # Importa la clase Response para devolver respuestas HTTP.
from tasks.models import Task,Usuario, Rol # Importa el modelo Task, que representa la estructura de los datos en la base de datos.
from proyectos.models import Proyecto
from rest_framework.authtoken.models import Token


# Define un conjunto de vistas (viewset) para el modelo Task.
class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer # Especifica el serializador que se usará para convertir los datos del modelo Task.
    queryset = Task.objects.all() # Define el conjunto de datos (queryset) que se usará en este viewset, en este caso, todos los objetos del modelo Task.

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


    # Ahora existe la posibilidad de filtrar los usuarios por correo electrónico con el nuevo método get_queryset.
    def get_queryset(self):
        queryset = super().get_queryset()
        correo = self.request.query_params.get('correoelectronico')
        if correo:
            queryset = queryset.filter(correoelectronico=correo)
        return queryset
    # Fin del método get_queryset

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        correo = self.request.query_params.get('correoelectronico')
        if correo:
            queryset = queryset.filter(correoelectronico=correo)
            return queryset


    

@api_view(['POST'])
def login_usuario(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        usuario = Usuario.objects.get(correoelectronico=email)
        if usuario.contraseña == password:
            usuario.token = str(uuid.uuid4())
            usuario.save()
            serializer = UsuarioSerializer(usuario)
            return Response({'token': usuario.token, 'usuario': serializer.data}, status=200)
        else:
            return Response({'error': 'correo o contraseña incorrecta'}, status=401)

    except Usuario.DoesNotExist:
        return Response({'error': 'correo o contraseña incorrecta'}, status=404)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def registe_usuario(request):
    if request.method == 'POST':
        check_email_only = request.data.get('checkEmailOnly', False)
        email = request.data.get('email')
        if check_email_only:
            if Usuario.objects.filter(correoelectronico=email).exists():
                return Response({'error': 'El correo ya está registrado.'}, status=400)
            return Response({'message': 'El correo está disponible.'}, status=200)
        else:
            nombre = request.data.get('firstName')
            apellido = request.data.get('lastName')
            password = request.data.get('password')
            termsAccepted = request.data.get('termsAccepted')

            if not nombre or not apellido or not email or not password or termsAccepted is None:
                return Response({'error': 'Todos los campos son requeridos para el registro completo.'}, status=400)

            if Usuario.objects.filter(correoelectronico=email).exists():
                return Response({'error': 'El correo ya está registrado.'}, status=400)

            terminoservicio = bool(termsAccepted)
            estado_predeterminado = 'Activo'
            suscripcion = 'Gratuito'
            try:
                Usuario.objects.create(
                    nombre=nombre,
                    apellido=apellido,
                    correoelectronico=email,
                    contraseña=password,
                    terminoservicio=terminoservicio,
                    estado=estado_predeterminado,
                    suscripcion=suscripcion
                )
                return Response({'usuario': "cuenta creada"}, status=200)
            except Exception as e:
                return Response({'error': f'Error al crear usuario: {str(e)}'}, status=500)
    else:
        return Response({'error': 'Método no permitido'}, status=405)
    

@api_view(['POST'])
def recuperacion_contra (request):
    email=request.data.get('email')
    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+",email):
        return Response({'success':False,'message':'Debes ingresar un correo valido'})
    try:
        usuario=Usuario.objects.get(correoelectronico=email)
    except Usuario.DoesNotExist:
        return Response({'success':False,'message':'No existe una cuenta asociada a este correo'})
    
    token= str(uuid.uuid4())

    request.session['reset_token']=token
    request.session['reset_email']=email

    reset_url=f"http://localhost:5173/password-reset/{token}?email={email}"
    asunto='Recuperacion de contrasena'
    html_content= render_to_string('autenticacion/email_recuperacion.html',{
        'usuario':usuario,
        'reset_url':reset_url,
    })
    mensaje=strip_tags(html_content)

    send_mail(
        asunto,
        mensaje,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        html_message=html_content,
        fail_silently=False
    )
    return Response({'success':True,'message': 'correo de recuperacion enviado correctamente.'})

@api_view(['POST'])
def password_reset(request, token=None):
    token = request.data.get('token')
    email = request.data.get('email')
    new_password = request.data.get('new_password')

    if not token or not new_password or not email:
        return Response({'success': False, 'message': 'Datos incompletos.'}, status=400)
    try:
        usuario = Usuario.objects.get(correoelectronico=email)
        usuario.contraseña = new_password
        usuario.save()
        return Response({'success': True, 'message': 'Contraseña restablecida correctamente.'})
    except Usuario.DoesNotExist:
        return Response({'success': False, 'message': 'Usuario no encontrado.'}, status=404)
    
@api_view(['POST'])
def invitacion_colaborador (request):
    
    email=request.data.get('email')
    nombre_invitador = request.data.get('nombre_invitador')
    id_proyecto= request.data.get('id_proyecto')

    
    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+",email):
        return Response({'success':False,'message':'Debes ingresar un correo valido'})
    if not nombre_invitador or not id_proyecto:
        return Response({'success': False, 'messagge':'Faltan datos de invitador o proyecto'})
    try:
        usuario_invitado = Usuario.objects.get(correoelectronico=email)
        if usuario_invitado.rol_idrol and int(usuario_invitado.rol_idrol.idrol) == 1:
            if Proyecto.objects.filter(id_usuario=usuario_invitado).exists():
                return Response({'success': False, 'message': 'Administrador no puede tener mas de un proyecto.'}, status=400)
    except Usuario.DoesNotExist:
        pass 
    invitacion_url=f"http://localhost:5173/invitacion-proyecto/{id_proyecto}"
    asunto='Invitacion a colaborar en un proyecto'
    html_content= render_to_string('mensajeColabo.html',{
        'email':email,
        'nombre_invitador':nombre_invitador,
        'invitacion_url': invitacion_url,
    })
    mensaje=strip_tags(html_content)

    send_mail(
        asunto,
        mensaje,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        html_message=html_content,
        fail_silently=False
    )
    return Response({'success':True,'message': 'correo de recuperacion enviado correctamente.'})