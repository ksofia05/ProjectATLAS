from django.db import models
from tasks.models import Usuario
from proyectos.models import Proyecto
# Create your models here.

class Agendamiento(models.Model):
    cliente_dni = models.ForeignKey('Cliente', models.DO_NOTHING, db_column='Cliente_dni', blank=True, null=True)  # Field name made lowercase.
    usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='Usuario_id', blank=True, null=True)  # Field name made lowercase.
    idagendamiento = models.AutoField(db_column='idAgendamiento', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Agendamiento'


class Cliente(models.Model):
    nombre = models.CharField(max_length=45)
    apellido = models.CharField(max_length=45)
    telefono = models.CharField(max_length=13)
    correo = models.CharField(max_length=45)
    dni = models.AutoField(primary_key=True)
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, db_column='proyecto', null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'Cliente'


class Equipo(models.Model):
    marca = models.CharField(max_length=30)
    fotoequipo = models.CharField(db_column='fotoEquipo', max_length=150, blank=True, null=True)  # Field name made lowercase.
    numeroserie = models.CharField(db_column='numeroSerie', primary_key=True, max_length=30)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Equipo'


class Equipoagendamiento(models.Model):
    fechaingreso = models.DateField(db_column='fechaIngreso')  # Field name made lowercase.
    fechasalida = models.DateField(db_column='fechaSalida', blank=True, null=True)  # Field name made lowercase.
    comentarioentrada = models.CharField(db_column='comentarioEntrada', blank=True, null=True)  # Field name made lowercase.
    comentariosalida = models.CharField(db_column='comentarioSalida', blank=True, null=True)  # Field name made lowercase.
    estado = models.TextField(db_column='Estado')  # Field name made lowercase. This field type is a guess.
    agendamiento_equipo = models.AutoField(primary_key=True)
    equipo_numeroserie = models.ForeignKey(Equipo, models.DO_NOTHING, db_column='equipo_numeroSerie', blank=True, null=True)  # Field name made lowercase.
    agendamiento_idagendamiento = models.ForeignKey(Agendamiento, models.DO_NOTHING, db_column='agendamiento_idAgendamiento', blank=True, null=True)  # Field name made lowercase.
    fotoequipo = models.CharField(db_column='fotoEquipo', max_length=150, blank=True, null=True)  # Nueva columna para imagen por registro

    class Meta:
        managed = False
        db_table = 'EquipoAgendamiento'