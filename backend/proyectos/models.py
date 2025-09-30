from django.db import models
from tasks.models import Usuario

class Proyect(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Proyecto(models.Model):
    nombreproyecto = models.CharField(db_column='nombreproyecto', max_length=30)
    fechacreacion = models.DateTimeField(db_column='fechacreacion', auto_now_add=True)
    id_usuario = models.ForeignKey(Usuario, models.CASCADE, db_column='id_usuario')
    id_proyecto = models.AutoField(models.CASCADE, primary_key=True)

    class Meta:
        db_table = 'proyecto'

class ColaboradorProyecto(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    fecha_asignacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'colaborador_proyecto'
        unique_together = ('usuario', 'proyecto')
    