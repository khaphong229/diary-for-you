from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from diaries.models import Diary
# Create your views here.


@login_required(login_url='login')
def HomePage(request):
    if request.user.is_authenticated:
        username = request.user.username
        list_diaries=Diary.objects.filter(user=request.user).order_by('-created_at')
        return render(request, 'home.html', {'diaries': list_diaries,
                                             'username':username})
    else:
        return render(request, 'home.html', {'message': 'Username not found'})

def SignupPage(request):
    if request.method=='POST':
        uname=request.POST.get('username')
        email=request.POST.get('email')
        pass1=request.POST.get('password1')
        pass2=request.POST.get('password2')
        if pass1!=pass2:
            messages.error(request,'password and confirm password is not the same')
            return redirect('signup')
        my_user=User.objects.create_user(uname, email, pass1)
        my_user.save()
        return redirect('login')
        
    return render(request, 'signup.html')

def LoginPage(request):
    if request.method=='POST':
        username=request.POST.get('username')
        pass1=request.POST.get('pass')
        user=authenticate(request,username=username,password=pass1)
        if user is not None:
            login(request,user)
            return redirect('home')
        else:
            messages.error(request,'user name or password is wrong')
            return redirect('login')
    return render(request,'login.html')

def LogoutPage(request):
    logout(request)
    return redirect('login')

def ListDiaries(request):
    list_diaries=Diary.objects.all()
    return render(request, 'home.html', {'diaries': list_diaries})
