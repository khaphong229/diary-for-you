from django.db import models

# Create your models here.
class Language(models.Model):
    language_code=models.CharField(max_length=10, primary_key=True)
    language_name=models.CharField(max_length=50)
    class Meta:
        db_table='languages'
    def __str__(self):
        return self.language_name