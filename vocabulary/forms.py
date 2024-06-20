from django import forms
from .models import Vocabulary

class VocabularyForm(forms.ModelForm):
    class Meta:
        model=Vocabulary
        fields=['word', 'meaning', 'pronunciation', 'audio', 'example_sentence']