
from urllib import request
from django.shortcuts import render,redirect
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.urls import reverse
import uuid
import hashlib
import re
from django.http import HttpResponse

from .models import  Usuario

# Create your views here.

def login_view(request):
    return render(request, 'autenticacion/login.html')


# Inicio de sesion (aun contiene unos problemas)
def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        try:
            # Buscar al usuario por correo electrónico
            usuario = Usuario.objects.get(correoelectronico=email)
            
            # Aqui se comprueba si la contraseña esta bien
            if usuario.contraseña == password:
                # En teoria, 
                request.session['usuario_id'] = usuario.idusuario
                messages.success(request, 'Inicio de sesión exitoso')
                return redirect('login')  # Por ahora, redirige al mismo formulario
            else:
                messages.error(request, 'Contraseña incorrecta')
        except Usuario.DoesNotExist:
            messages.error(request, 'El usuario no existe')
    
    return render(request, 'autenticacion/login.html')



# Registro de usuario
def register(request):
    if request.method == 'POST':
        # se guardan los datos basicos del usuario
        request.session['nombre'] = request.POST['nombre']
        request.session['apellido'] = request.POST['apellido']
        request.session['email'] = request.POST['email']
        return redirect('register2')  # Lleva a la segunda pagina
    return render(request, 'autenticacion/register.html')

def register2(request):
    if request.method == 'POST':
        # Recuperar datos del primer paso del registro
        nombre = request.session.get('nombre')
        apellido = request.session.get('apellido')
        email = request.session.get('email')
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        #accedemos a el valor de la clave terms 
        terminoservicio_str= request.POST.get('terms')
        #convertimos el "on" en true
        terminoservicio = True if terminoservicio_str == 'on' else False 
        

        if password != confirm_password:
            messages.error(request, 'Las contraseñas no coinciden.')
            return redirect('register2')

        estado_predeterminado = 'Activo'
        suscripcion='Gratuito'

        # se guardan los datos del usuario (lo que sigue le corresponde a back)
        Usuario.objects.create(
            nombre=nombre,
            apellido=apellido,
            correoelectronico=email,
            contraseña=password,
            terminoservicio=terminoservicio,
            estado=estado_predeterminado,
            suscripcion=suscripcion
        )
        messages.success(request, 'Registro exitoso. Ahora puedes iniciar sesión.')
        return redirect('login')  # Redirigir al inicio de sesión
    return render(request, 'autenticacion/register2.html')

#Terminos y Condiciones

def terminos(request):
    return render(request, 'autenticacion/terminos.html')

def politicas(request):
    return render(request, 'autenticacion/politicas.html')

#Inicio de proyectos (simulacion)
def simulacion(request):
    return render(request, 'autenticacion/simulacion.html')

#Recuperar contraseña
#Reenviar enlace de recuperacion de contraseña (1 problema)



def recuperar_contrasena(request):
    if request.method =='POST':
        email=request.POST.get('email')
        if email:
            try:
                usuario=Usuario.objects.get(correoelectronico=email)
                token=str(uuid.uuid4())
                request.session['reset_token']=token
                request.session['reset_email']=email

                reset_url=request.build_absolute_uri(
                    reverse('crear_contrasena', kwargs={'token':token})
                )

                asunto='Recuperacion de contaseña'
                html_mensaje= render_to_string('autenticacion/email_recuperacion.html',{
                    'usuario':usuario,
                    'reset_url':reset_url,
                })
                mensaje_plano=strip_tags(html_mensaje)

                send_mail(
                    asunto,
                    mensaje_plano,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    html_message=html_mensaje,
                    fail_silently=False
                )

                return render (request,'autenticacion/recuperar_contrasena.html',{'email_sent':True})
            except Usuario.DoesNotExist:
                messages.error(request,'No existe una cuenta asociada a este correo electronico.')
            except Exception as e:
                print(f"Error al enviar correo:{str(e)}")
                messages.error(request,"ocurrio un error al enviar el correo. por favor, intentelo de nuevo.")
    
    return render(request,'autenticacion/recuperar_contrasena.html')

def reenviar_enlace(request):
    if  request.method=='POST':
        email=request.POST.get('email')
        if email:
            try:
                usuario=Usuario.objects.get(correoelectronico=email)
                token = str(uuid.uuid4())
                request.session['reset_token'] = token
                request.session['reset_email'] = email
                
                reset_url = request.build_absolute_uri(
                    reverse('crear_contrasena', kwargs={'token': token})
                )

                asunto='recuperacion de contraseña (reenvio)'
                html_mensaje=render_to_string('autenticacion/email_recuperacion.html',{
                    'usuario':usuario,
                    'reset_url': reset_url,
                })
                mensaje_plano=strip_tags(html_mensaje)

                send_mail(
                    asunto,
                    mensaje_plano,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    html_message=html_mensaje,
                    fail_silently=False
                )
                return render (request,'autenticacion/reenviar_enlace.html',{'email_sent':True})
            except Usuario.DoesNotExist:
                messages.error(request,'No existe una cuenta sociada a este correo electronico.')
            except Exception as e:
                print(f"Error al reenviar correo: {str(e)}")
                messages.error(request,'Ocurrio un error al enviar el correo. por favor, intentelo de nuevo.')
    return render(request,'autenticacion/reenviar_enlace.html')
    
def crear_contrasena(request,token=None):
    session_token=request.session.get('reset_token')
    email=request.session.get('reset_email')
    if token != session_token or not email:
         messages.error(request, 'El enlace de recuperación no es válido o ha expirado.')
         return redirect('login')  
    
    try:
        usuario=Usuario.objects.get(correoelectronico=email)
    except Usuario.DoesNotExist:
        messages.error(request,'no se encontro la cuenta de usuario.')
        return redirect('login')
    
    if request.method=='POST':
        password= request.POST.get('new_password')
        confirm_pasword=request.POST.get('confirm_password')

        errors=[]
        if password !=confirm_pasword:
            errors.append("Las contraseñas no coinciden.")
        if not re.match(r'^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$',password):
            errors.append("La contraseña debe tener al menos 8 caracteres, un numero, una mayuscula y un simbolo")

        if errors:
            for error in errors:
                messages.error(request,error)
            return render(request,'autenticacion/crear_contraseña.html')
        try:
            usuario.contraseña=password
            usuario.save()

            if 'reset_token' in request.session:
                del request.session['reset_token']
            if 'reset_email' in request.session:
                del request.session['reset_email'] 
            messages.success(request,'Contraseña actualizada correctamente. ahora puedes iniciar sesion.')
            return redirect('login')
        except Exception as e:
            print(f"Error al actualizar contraseña: {str(e)}")
            messages.error(request,'Hubo un error al actualizar la contraseña.')
    context={
        'token': token,
        'email': email
    }
    return render(request,'autenticacion/crear_contrasena.html', context)

