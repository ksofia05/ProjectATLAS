from django.shortcuts import render

import re
import uuid
from rest_framework import viewsets # Importa el módulo viewsets de Django REST Framework, que permite crear vistas basadas en conjuntos de datos (viewsets).
from rest_framework.decorators import api_view # Importa el decorador api_view para definir vistas basadas en funciones.
from .serializer import AgendamientoSerializer,ClienteSerializer,EquipoSerializer,EquipoAgendamientoSerializer # Importa el serializador que define cómo se transforman los datos del modelo Task a JSON y viceversa.
from rest_framework.response import Response # Importa la clase Response para devolver respuestas HTTP.
from .models import Agendamiento,Cliente,Equipo,Equipoagendamiento # Importa el modelo Task, que representa la estructura de los datos en la base de datos.
from rest_framework.response import Response
import jwt

class AgendamientoViewSet(viewsets.ModelViewSet):
    queryset = Agendamiento.objects.all()  # Define la consulta para obtener todos los objetos Agendamiento.
    serializer_class = AgendamientoSerializer  # Especifica el serializador que se utilizará para convertir los datos a JSON y viceversa.

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()  # Define la consulta para obtener todos los objetos Cliente.
    serializer_class = ClienteSerializer  # Especifica el serializador que se utilizará para convertir los datos a JSON y viceversa.

class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()  # Define la consulta para obtener todos los objetos Equipo.
    serializer_class = EquipoSerializer  # Especifica el serializador que se utilizará para convertir los datos a JSON y viceversa.

class EquipoAgendamientoViewSet(viewsets.ModelViewSet):
    queryset = Equipoagendamiento.objects.all()  # Define la consulta para obtener todos los objetos Equipoagendamiento.
    serializer_class = EquipoAgendamientoSerializer  # Especifica el serializador que se utilizará para convertir los datos a JSON y viceversa.



# Create your views here.
