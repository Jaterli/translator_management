from django.db import models

class SavedQuery(models.Model):
    name = models.CharField(max_length=100)  # Nombre descriptivo de la consulta
    query = models.JSONField()  # Almacenar los filtros/criterios como JSON
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

