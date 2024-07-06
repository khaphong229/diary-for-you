from django.urls import path
from .views import (AddDiaryView, 
                    DeleteDiaryView, 
                    UpdateDiaryView, 
                    DiaryDetailView,
                    SaveTranslationView,
                    search_diaries)
urlpatterns = [
    path('add/',AddDiaryView.as_view(),name='add_diary'),
    path('delete-diary/<int:pk>/', DeleteDiaryView.as_view(), name='delete_diary'),
    path('update-diary/<int:pk>/', UpdateDiaryView.as_view(), name='update-diary'),
    path('diary/<int:pk>/', DiaryDetailView.as_view(), name='diary-detail'),
    path('diary/save-translation/', SaveTranslationView.as_view(), name='save-translation'),
    path('search_diaries/', search_diaries, name='search_diaries'),
]
