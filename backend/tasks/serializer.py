from rest_framework import serializers
from .models import Task,Usuario,Rol


#crea una un serializer para la clase Task
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        #que datos quiero serializar
        fields = ['id', 'title', 'description', 'done']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'  # O especifica los campos que quieres incluir

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'  # O especifica los campos que quieres incluir