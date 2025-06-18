# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models




# class Agendamiento(models.Model):
#     cliente_dni = models.ForeignKey('Cliente', models.DO_NOTHING, db_column='Cliente_dni', blank=True, null=True)  # Field name made lowercase.
#     usuario = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='Usuario_id', blank=True, null=True)  # Field name made lowercase.
#     idagendamiento = models.AutoField(db_column='idAgendamiento', primary_key=True)  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = 'Agendamiento'


# class Cliente(models.Model):
#     nombre = models.CharField(max_length=45)
#     apellido = models.CharField(max_length=45)
#     telefono = models.CharField(max_length=13)
#     correo = models.CharField(max_length=45)
#     dni = models.AutoField(primary_key=True)

#     class Meta:
#         managed = False
#         db_table = 'Cliente'


# class Equipo(models.Model):
#     marca = models.CharField(max_length=30)
#     fotoequipo = models.CharField(db_column='fotoEquipo', max_length=150, blank=True, null=True)  # Field name made lowercase.
#     numeroserie = models.CharField(db_column='numeroSerie', primary_key=True, max_length=30)  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = 'Equipo'


# class Equipoagendamiento(models.Model):
#     fechaingreso = models.DateField(db_column='fechaIngreso')  # Field name made lowercase.
#     fechasalida = models.DateField(db_column='fechaSalida', blank=True, null=True)  # Field name made lowercase.
#     comentarioentrada = models.CharField(db_column='comentarioEntrada', blank=True, null=True)  # Field name made lowercase.
#     comentariosalida = models.CharField(db_column='comentarioSalida', blank=True, null=True)  # Field name made lowercase.
#     estado = models.TextField(db_column='Estado')  # Field name made lowercase. This field type is a guess.
#     agendamiento_equipo = models.AutoField(primary_key=True)
#     equipo_numeroserie = models.ForeignKey(Equipo, models.DO_NOTHING, db_column='equipo_numeroSerie', blank=True, null=True)  # Field name made lowercase.
#     agendamiento_idagendamiento = models.ForeignKey(Agendamiento, models.DO_NOTHING, db_column='agendamiento_idAgendamiento', blank=True, null=True)  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = 'EquipoAgendamiento'


class Tareas(models.Model):
    nombretarea = models.CharField(db_column='nombreTarea')  # Field name made lowercase.
    fechacreacion = models.DateField(db_column='fechaCreacion')  # Field name made lowercase.
    fechalimite = models.DateTimeField(db_column='fechaLimite', blank=True, null=True)  # Field name made lowercase.
    descripcion = models.CharField(blank=True, null=True)
    filtro = models.TextField()  # This field type is a guess.
    tipotarea = models.TextField(db_column='tipoTarea')  # Field name made lowercase. This field type is a guess.
    id_tarea = models.AutoField(db_column='id_Tarea', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Tareas'


# class Usuario(models.Model):
#     nombre = models.CharField(max_length=45)
#     apellido = models.CharField(max_length=45)
#     estado = models.TextField()  # This field type is a guess.
#     correoelectronico = models.CharField(db_column='correoElectronico', max_length=45)  # Field name made lowercase.
#     contrase�a = models.CharField(max_length=45)
#     rol_idrol = models.ForeignKey('Rol', models.DO_NOTHING, db_column='rol_idRol', blank=True, null=True)  # Field name made lowercase.
#     suscripcion = models.TextField()  # This field type is a guess.
#     idusuario = models.AutoField(db_column='idUsuario', primary_key=True)  # Field name made lowercase.
#     terminoservicio = models.BooleanField(db_column='terminoServicio')  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = 'Usuario'


# class Proyecto(models.Model):
#     nombreproyecto = models.CharField(db_column='nombreProyecto', max_length=30)  # Field name made lowercase.
#     fechacreacion = models.DateField(db_column='fechaCreacion')  # Field name made lowercase.
#     enlace = models.CharField(blank=True, null=True)
#     id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario', blank=True, null=True)
#     id_proyecto = models.AutoField(primary_key=True)

#     class Meta:
#         managed = False
#         db_table = 'proyecto'


# class Rol(models.Model):
#     colaborador = models.CharField(max_length=45, blank=True, null=True)
#     administrador = models.CharField(max_length=45, blank=True, null=True)
#     idrol = models.AutoField(db_column='idRol', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'rol'


class Usuariotarea(models.Model):
    para_todos = models.BooleanField(blank=True, null=True)
    especifico = models.BooleanField(blank=True, null=True)
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario', blank=True, null=True)
    id_tarea = models.ForeignKey(Tareas, models.DO_NOTHING, db_column='id_tarea', blank=True, null=True)
    id_usuariotarea = models.AutoField(db_column='id_usuarioTarea', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'usuarioTarea'
