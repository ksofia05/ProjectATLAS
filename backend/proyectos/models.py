from django.db import models
from tasks.models import Usuario

class Proyect(models.Model):
    title = models.CharField(max_length=200)
    # descripcion2=models.TextField(blank=True)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class Proyecto(models.Model):
    nombreproyecto = models.CharField(db_column='nombreproyecto', max_length=30)  # Field name made lowercase.
    fechacreacion = models.DateTimeField(db_column='fechacreacion', auto_now_add=True)  # Field name made lowercase.
    enlace = models.CharField(blank=True, null=True)
    id_usuario = models.ForeignKey(Usuario, models.CASCADE, db_column='id_usuario')
    id_proyecto = models.AutoField(primary_key=True)

    class Meta:
        db_table = 'proyecto'
# Create your models here.
