from rest_framework import viewsets # Importa el módulo viewsets de Django REST Framework, que permite crear vistas basadas en conjuntos de datos (viewsets).
from .serializer import TaskSerializer # Importa el serializador que define cómo se transforman los datos del modelo Task a JSON y viceversa.
from .models import Task # Importa el modelo Task, que representa la estructura de los datos en la base de datos.


# Define un conjunto de vistas (viewset) para el modelo Task.
class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer # Especifica el serializador que se usará para convertir los datos del modelo Task.
    queryset = Task.objects.all() # Define el conjunto de datos (queryset) que se usará en este viewset, en este caso, todos los objetos del modelo Task.
