from rest_framework import serializers
from .models import Task

#crea una un serializer para la clase Task
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        #que datos quiero serializar
        fields = ['id', 'title', 'description', 'done']