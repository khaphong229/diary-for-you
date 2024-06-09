from django import forms
from .models import Diary

class DiaryForm(forms.ModelForm):
    created_at=forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type':'datetime-local'}),
        required=False,
        initial=None
    )
    class Meta:
        model = Diary
        fields = ['title','content','created_at']
