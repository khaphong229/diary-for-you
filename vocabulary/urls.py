from django.urls import path
from .views import trans_word

urlpatterns = [
    path('trans-word/',trans_word,name='trans_word'),
]
