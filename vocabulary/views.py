from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests
import json
from .models import Vocabulary
@csrf_exempt
def trans_word(request):
    if request.method=='POST':
        data=json.loads(request.body)
        word=data.get('word')
        
        api_url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
        response = requests.get(api_url)
        if response.status_code==200:
            definition = response.json()[0]['meanings'][0]['definitions'][0]['definition']
            pronunciation = response.json()[0]['phonetic']
            return JsonResponse({'success': True, 'meaning': definition, 'pronunciation': pronunciation}, status=200)
        else:
            return JsonResponse({'success': False, 'message': 'Word not found'}, status=404)
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def save_word(request):
    if request.method=='POST':
        data=json.loads(request.body)
        word=data.get('word')
        meaning = data.get('meaning')
        pronunciation = data.get('pronunciation')
        
        Vocabulary.objects.create(word=word, meaning=meaning, pronunciation=pronunciation)
        
        
        return JsonResponse({'success': True, 'message': 'Word saved successfully!'}, status=200)
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)