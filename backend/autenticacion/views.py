from django.shortcuts import render,redirect
from django.contrib import messages
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
        # Recuperar datos del primer paso desde la sesión
        nombre = request.session.get('nombre')
        apellido = request.session.get('apellido')
        email = request.session.get('email')
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        if password != confirm_password:
            messages.error(request, 'Las contraseñas no coinciden.')
            return redirect('register2')

        # se guardan los datos del usuario (lo que sigue le corresponde a back)
        Usuario.objects.create(
            nombre=nombre,
            apellido=apellido,
            correoelectronico=email,
            contraseña=password 
        )
        messages.success(request, 'Registro exitoso. Ahora puedes iniciar sesión.')
        return redirect('login')  # Redirigir al inicio de sesión
    return render(request, 'autenticacion/register2.html')