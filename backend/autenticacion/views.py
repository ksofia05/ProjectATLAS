from django.shortcuts import render,redirect
from django.contrib import messages
from .models import  Usuario

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import login, logout

# Create your views here.


# Inicio de sesion (mostrar los errores)
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        if email and password:
            try:
                usuario = Usuario.objects.get(correoelectronico=email)
                if usuario.contraseña == password:
                    try:
                        django_user = User.objects.get(username=email)
                    except User.DoesNotExist:
                        django_user = User.objects.create_user(username=email, email=email, password=password)

                    login(request, django_user)
                    # ¡Simplemente comenta o elimina esta línea!
                    # messages.success(request, 'Sesión exitosa')
                    return redirect('simulacion')
                else:
                    messages.error(request, 'Correo o contraseña incorrecta')
            except Usuario.DoesNotExist:
                messages.error(request, 'Correo o contraseña incorrecta')

    # Limpiar los mensajes antes de renderizar el template de login en la petición GET
    list(messages.get_messages(request))
    return render(request, 'autenticacion/login.html')

@login_required
def vista_de_simulacion(request):
    return render(request, 'autenticacion/simulacion.html')

def logout_view(request):
    logout(request)
    return redirect('login')


# Registro de usuario
def register(request):
    if request.method == 'POST':
        nombre = request.POST['nombre']
        apellido = request.POST['apellido']
        email = request.POST['email']

        try:
            Usuario.objects.get(correoelectronico=email)
            messages.error(request, 'Este correo electrónico ya está registrado. Por favor, usa otro.')
            return render(request, 'autenticacion/register.html', {'nombre': nombre, 'apellido': apellido, 'email': email})
        except Usuario.DoesNotExist:
            request.session['nombre'] = nombre
            request.session['apellido'] = apellido
            request.session['email'] = email
            return redirect('register2')
        except Exception as e:
            messages.error(request, f'Ocurrió un error: {e}')
            return render(request, 'autenticacion/register.html', {'nombre': nombre, 'apellido': apellido, 'email': email})

    else:
        # Limpiar los mensajes antes de renderizar el formulario en la petición GET
        list(messages.get_messages(request))
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
def recuperar_contrasena(request):
    return render(request, 'autenticacion/recuperar_contrasena.html')

def reenviar_enlace(request):
    return render(request, 'autenticacion/reenviar_enlace.html')