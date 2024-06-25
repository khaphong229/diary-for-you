from django.shortcuts import render
from .models import Diary
from translations.models import Translation
from languages.models import Language
from django.views import View
from django.views.generic import CreateView, DetailView
from django.views.generic.edit import DeleteView, UpdateView
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json
import requests
from .forms import DiaryForm
from django.utils import timezone
import datetime
import pytz
# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class AddDiaryView(CreateView):
    model = Diary
    form_class = DiaryForm
    template_name = 'add_diary.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        form.instance.user = self.request.user
        selected_date = form.cleaned_data['created_at']
        vietnam_tz = pytz.timezone('Asia/Ho_Chi_Minh')
        current_time_vn = datetime.datetime.now(vietnam_tz).time()
        combined_datetime = datetime.datetime.combine(selected_date, current_time_vn)
        form.instance.created_at = combined_datetime
        self.object = form.save()
        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest': ## check request ajax from javascript ??
            return JsonResponse({'message': 'Diary created successfully!', 'redirect_url': str(self.success_url)}, status=200)
        else:
            return super().form_valid(form)

    def form_invalid(self, form):
        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse(form.errors, status=400)
        else:
            return super().form_invalid(form)
    
class DeleteDiaryView(DeleteView):
    model = Diary
    success_url = reverse_lazy('home')
    
    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.object.delete()
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'message': 'Diary deleted successfully!'}, status=200)
        return super().delete(request, *args, **kwargs)
    
@method_decorator(csrf_exempt, name='dispatch')
class UpdateDiaryView(UpdateView):
    model=Diary
    fields=['title','content','created_at']
    template_name='update_diary.html'
    success_url=reverse_lazy('home')
    
    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        data = json.loads(request.body)
        form = self.get_form()
        form.data = data
        if form.is_valid():
            diary = form.save(commit=False)
            created_at_str = data.get('created_at')
            if created_at_str:
                created_date = datetime.datetime.strptime(created_at_str, '%Y-%m-%d').date()
                current_time = timezone.now().time()
                created_at = datetime.datetime.combine(created_date, current_time)
                diary.created_at = timezone.make_aware(created_at, timezone.get_default_timezone())
            diary.save()
            return JsonResponse({'message': 'Diary updated successfully!', 'title': diary.title, 'content': diary.content, 'created_at':diary.created_at}, status=200)
        return JsonResponse({'errors': form.errors}, status=400)
    
class DiaryDetailView(DetailView):
    model=Diary
    template_name='diary_detail.html'
    context_object_name='diary'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        diary=self.get_object()
        translations=Translation.objects.filter(diary=diary)
        print(translations)
        context["translations"] = translations
        return context
    
@method_decorator(csrf_exempt, name='dispatch')
class SaveTranslationView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        diary_id = data.get('diary_id')
        language_code = data.get('language')
        translated_text = data.get('translated_text')

        try:
            diary = Diary.objects.get(pk=diary_id)
            language = Language.objects.get(language_code=language_code)
        except Diary.DoesNotExist:
            return JsonResponse({'error': 'Diary not found'}, status=404)
        except Language.DoesNotExist:
            return JsonResponse({'error': 'Language not found'}, status=404)

        translation, created = Translation.objects.update_or_create(
            diary=diary,
            language=language,
            defaults={'translated_content': translated_text}
        )

        return JsonResponse({'message': 'Translation saved successfully!'}, status=200)