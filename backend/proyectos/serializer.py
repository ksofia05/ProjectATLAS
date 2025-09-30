from rest_framework import serializers
from .models import Proyecto,Proyect

class ProyectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyect
        #que datos quiero serializar
        fields = ['id', 'title', 'description', 'done']

class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = '__all__'  # O especifica los campos que quieres incluir