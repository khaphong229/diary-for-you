from django.urls import path

from .views import (trans_word, 
                    save_word, 
                    VocalbularyListView, 
                    vocabulary_form, 
                    delete_vocabulary,
                    edit_vocabulary,
                    update_vocabulary)

urlpatterns = [
    path('trans-word/',trans_word,name='trans_word'),
    path('save-word/',save_word,name='save_word'),
    path('list-vocabs/',VocalbularyListView.as_view(),name='list-vocabs'),
    path('add_vocabulary/',vocabulary_form,name='add_vocabulary'),
    path('delete-vocabulary/<int:vocabulary_id>/', delete_vocabulary, name='delete_vocabulary'),
    path('edit-vocabulary/<int:vocabulary_id>/',edit_vocabulary,name='edit_vocabulary'),
    path('update-vocabulary/<int:vocabulary_id>/',update_vocabulary,name='update_vocabulary'),
]
