from django.db import models
from diaries.models import Diary
from languages.models import Language
# Create your models here.
class Translation(models.Model):
    translation_id=models.AutoField(primary_key=True)
    diary=models.ForeignKey(Diary,on_delete=models.CASCADE)
    language=models.ForeignKey(Language,on_delete=models.CASCADE, db_column='language')
    translated_content=models.TextField()
    translated_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.diary.title} ({self.language.language_name})'
    class Meta:
        db_table = 'translations'
    