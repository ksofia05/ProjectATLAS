import re
import uuid
from rest_framework import viewsets # Importa el módulo viewsets de Django REST Framework, que permite crear vistas basadas en conjuntos de datos (viewsets).
from rest_framework.decorators import api_view # Importa el decorador api_view para definir vistas basadas en funciones.
from .serializer import ProyectSerializer,ProyectoSerializer # Importa el serializador que define cómo se transforman los datos del modelo Task a JSON y viceversa.
from rest_framework.response import Response # Importa la clase Response para devolver respuestas HTTP.
from .models import Proyect,Proyecto # Importa el modelo Task, que representa la estructura de los datos en la base de datos.

# Define un conjunto de vistas (viewset) para el modelo Task.
class ProyectView(viewsets.ModelViewSet):
    serializer_class = ProyectSerializer # Especifica el serializador que se usará para convertir los datos del modelo Task.
    queryset = Proyect.objects.all() # Define el conjunto de datos (queryset) que se usará en este viewset, en este caso, todos los objetos del modelo Task.

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

@api_view(['POST'])
def save_proyect(request):
    if request.method=='POST':
        proyecto=request.data.get('nombreproyecto')
        try:
            Proyecto.objects.create(
                nombreproyecto=proyecto
            )
            return Response({'nombre': "proyecto creada"}, status=200)
        except Exception as e:
            return Response({'error': f'Error al crear proyecto: {str(e)}'}, status=500)
       
        


# Create your views here.
