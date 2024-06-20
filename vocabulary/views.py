from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests
import json
from .models import Vocabulary
from django.contrib.auth.decorators import login_required
from translations.models import Translation
from diaries.models import Diary
from django.views.generic import ListView, View
from .forms import VocabularyForm
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin

@login_required
@csrf_exempt
def trans_word(request):
    if request.method=='POST':
        data=json.loads(request.body)
        word=data.get('word')
        
        api_url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
        response = requests.get(api_url)
        if response.status_code==200:
            data = response.json()[0]
            meaning = data['meanings'][0]['definitions'][0]['definition']
            pronunciation = data['phonetics'][0]['text'] if data['phonetics'] else ''
            audio = data['phonetics'][0]['audio'] if data['phonetics'] else ''
            examples = data['meanings'][0]['definitions'][0]['example'] if 'example' in data['meanings'][0]['definitions'][0] else ''

            return JsonResponse({
                'success': True,
                'meaning': meaning,
                'pronunciation': pronunciation,
                'audio': audio,
                'examples': [examples]
            }, status=200)
        else:
            return JsonResponse({'success': False, 'message': 'Word not found'}, status=404)
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def save_word(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        word = data.get('word')
        meaning = data.get('meaning')
        pronunciation = data.get('pronunciation')
        audio = data.get('audio')
        example_sentence = data.get('example_sentence')

        # Kiểm tra user_id
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User does not exist'}, status=400)

        try:
            vocabulary = Vocabulary.objects.create(
                user=user,
                word=word,
                meaning=meaning,
                pronunciation=pronunciation,
                audio=audio,
                example_sentence=example_sentence
            )
            return JsonResponse({'success': True, 'message': 'Word saved successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)

class VocalbularyListView(LoginRequiredMixin,ListView):
    model=Vocabulary
    template_name='list_vocab.html'
    context_object_name='vocabs'
    def get_queryset(self):
        return Vocabulary.objects.filter(user=self.request.user).order_by('-added_at')


def vocabulary_form(request):
    return render(request, 'add_vocab.html')

@csrf_exempt
def delete_vocabulary(request, vocabulary_id):
    if request.method == 'DELETE':
        try:
            vocabulary = Vocabulary.objects.get(pk=vocabulary_id)
            vocabulary.delete()
            return JsonResponse({'message': 'Vocabulary deleted successfully.'}, status=204)
        except Vocabulary.DoesNotExist:
            return JsonResponse({'error': 'Vocabulary not found.'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    

def edit_vocabulary(request,vocabulary_id):
    vocabulary=get_object_or_404(Vocabulary, vocabulary_id=vocabulary_id)
    return render(request,'edit_vocab.html',context={
        'vocabulary':vocabulary,
    })

@csrf_exempt
def update_vocabulary(request, vocabulary_id):
    if request.method=='PUT':
        vocabulary=get_object_or_404(Vocabulary,vocabulary_id=vocabulary_id)
        data=json.loads(request.body)
        vocabulary.word=data.get('word',vocabulary.word)
        vocabulary.meaning=data.get('meaning',vocabulary.meaning)
        vocabulary.pronunciation = data.get('pronunciation', vocabulary.pronunciation)
        vocabulary.audio = data.get('audio', vocabulary.audio)
        vocabulary.example_sentence = data.get('example_sentence', vocabulary.example_sentence)
        vocabulary.save()
        return JsonResponse({'success': True, 'message': 'Vocabulary updated successfully!'}, status=200)
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)