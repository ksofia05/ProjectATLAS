from rest_framework import viewsets # Importa el módulo viewsets de Django REST Framework, que permite crear vistas basadas en conjuntos de datos (viewsets).
from rest_framework.decorators import api_view # Importa el decorador api_view para definir vistas basadas en funciones.
from .serializer import TaskSerializer,UsuarioSerializer, RolSerializer # Importa el serializador que define cómo se transforman los datos del modelo Task a JSON y viceversa.
from rest_framework.response import Response # Importa la clase Response para devolver respuestas HTTP.
from .models import Task,Usuario, Rol # Importa el modelo Task, que representa la estructura de los datos en la base de datos.


# Define un conjunto de vistas (viewset) para el modelo Task.
class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer # Especifica el serializador que se usará para convertir los datos del modelo Task.
    queryset = Task.objects.all() # Define el conjunto de datos (queryset) que se usará en este viewset, en este caso, todos los objetos del modelo Task.

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    

@api_view(['POST'])
def login_usuario(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        usuario = Usuario.objects.get(correoelectronico=email)

        if usuario.contraseña == password:
            serializer = UsuarioSerializer(usuario)
            return Response({'usuario': serializer.data}, status=200)
        else:
            return Response({'error': 'Contraseña incorrecta'}, status=401)

    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)

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