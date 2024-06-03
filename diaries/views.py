from django.shortcuts import render
from .models import Diary
from django.views.generic import CreateView
from django.views.generic.edit import DeleteView, UpdateView
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json
# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class AddDiaryView(CreateView):
    model = Diary
    fields = ['title', 'content']
    template_name = 'add_diary.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        form.instance.user = self.request.user 
        self.object = form.save()
        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'message': 'Diary created successfully!'}, status=200)
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
    
        
class UpdateDiaryView(UpdateView):
    model=Diary
    fields=['title','content']
    template_name='update_diary.html'
    success_url=reverse_lazy('home')
    
    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        data = json.loads(request.body)
        form = self.get_form()
        form.data = data
        if form.is_valid():
            diary = form.save()
            return JsonResponse({'message': 'Diary updated successfully!', 'title': diary.title, 'content': diary.content}, status=200)
        return JsonResponse({'errors': form.errors}, status=400)
    