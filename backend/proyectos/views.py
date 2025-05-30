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
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        queryset = Proyecto.objects.all()
        user_id = self.request.query_params.get('id_usuario')
        if user_id:
            queryset = queryset.filter(id_usuario=user_id)
        return queryset


# Create your views here.
