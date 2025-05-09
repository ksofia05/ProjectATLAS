from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    # descripcion2=models.TextField(blank=True)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Usuario(models.Model):
    nombre = models.CharField(max_length=45)
    apellido = models.CharField(max_length=45)
    estado = models.TextField()  # This field type is a guess.
    correoelectronico = models.CharField(db_column='correoElectronico', max_length=45)  # Field name made lowercase.
    contraseña = models.CharField(max_length=45)
    rol_idrol = models.ForeignKey('Rol', models.DO_NOTHING, db_column='rol_idRol', blank=True, null=True)  # Field name made lowercase.
    suscripcion = models.TextField()  # This field type is a guess.
    idusuario = models.AutoField(db_column='idUsuario', primary_key=True)  # Field name made lowercase.
    terminoservicio = models.BooleanField(db_column='terminoServicio')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Usuario'

class Rol(models.Model):
    nombre = models.CharField(max_length=45,null=True)
    idrol = models.AutoField(db_column='idRol', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'rol'



# Create your models here.
