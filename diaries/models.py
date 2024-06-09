from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.
class Diary(models.Model):
    diary_id=models.AutoField(primary_key=True)
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    title=models.CharField(max_length=100)
    content=models.TextField()
    created_at=models.DateTimeField(default=timezone.now)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'diaries'
    def __str__(self):
        return self.title
    