from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Usuario(models.Model):
    nombre = models.CharField(max_length=45)
    apellido = models.CharField(max_length=45)
    estado = models.TextField() 
    correoelectronico = models.CharField(db_column='correoElectronico', max_length=45)
    contraseña = models.CharField(max_length=45)
    rol_idrol = models.ForeignKey('Rol', models.CASCADE, db_column='rol_idRol', blank=True, null=True)
    suscripcion = models.TextField()
    idusuario = models.AutoField(models.CASCADE, db_column='idUsuario', primary_key=True)
    terminoservicio = models.BooleanField(db_column='terminoServicio')
    token = models.CharField(max_length=255, blank=True, null=True)
    uuid_supabase = models.UUIDField(unique=False, null=True, blank=True)
    enlacePerfil = models.URLField(blank=True, null=True)

    class Meta:
        db_table = 'Usuario'

class Rol(models.Model):
    nombre = models.CharField(max_length=45, null=False, blank=False)
    idrol = models.AutoField(models.CASCADE, primary_key=True)

    class Meta:
        db_table = 'rol'

# todo para la tabla tarea (no lo cambien porfi)

class Tarea(models.Model):
    id_Tarea = models.AutoField(primary_key=True)
    nombreTarea = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    fechaCreacion = models.DateField(blank=True, null=True)
    fechaLimite = models.TimeField(blank=True, null=True)
    fechaActual = models.DateTimeField(blank=True, null=True)
    filtro = models.CharField(max_length=50, default='por completar')
    tipoTarea = models.CharField(max_length=50, blank=True, null=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, blank=True, null=True)
    id_proyecto = models.IntegerField(blank=True, null=True) 

    def __str__(self):
        return self.nombreTarea
