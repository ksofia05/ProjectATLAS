from rest_framework import serializers
from .models import Agendamiento,Cliente,Equipo,Equipoagendamiento

class AgendamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agendamiento
        fields = '__all__'  # O especifica los campos que quieres incluir

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'  # O especifica los campos que quieres incluir

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'  # O especifica los campos que quieres incluir

class EquipoAgendamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipoagendamiento
        fields = '__all__'  # O especifica los campos que quieres incluir