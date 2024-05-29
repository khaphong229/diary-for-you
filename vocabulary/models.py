from django.db import models
from django.contrib.auth.models import User
from translations.models import Translation
from diaries.models import Diary
# Create your models here.
class Vocabulary(models.Model):
    vocabulary_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.CharField(max_length=100)
    meaning = models.TextField()
    translation = models.ForeignKey(Translation, on_delete=models.CASCADE, null=True, blank=True)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.word} ({self.user.username})'

    class Meta:
        db_table='vocabulary'