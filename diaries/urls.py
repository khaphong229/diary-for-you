from django.urls import path
from .views import AddDiaryView, DeleteDiaryView, UpdateDiaryView
urlpatterns = [
    path('add/',AddDiaryView.as_view(),name='add_diary'),
    path('delete-diary/<int:pk>/', DeleteDiaryView.as_view(), name='delete_diary'),
    path('update-diary/<int:pk>/', UpdateDiaryView.as_view(), name='update-diary'),
]
