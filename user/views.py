from typing import Any
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from diaries.models import Diary
from django.views.generic import DetailView
# Create your views here.

@login_required(login_url='login') ### ensure user must login if not login redirect user to the web login to input username, password
def HomePage(request):
    if request.user.is_authenticated:
        username = request.user.username #get username and user id about current user
        user_id=request.user.id
        list_diaries=Diary.objects.filter(user=request.user).order_by('-created_at') ### get only diaries of current user
        return render(request, 'home.html', {'diaries': list_diaries,
                                             'username':username,
                                             'user_id':user_id})
    else:
        return render(request, 'home.html', {'message': 'Username not found'})

def SignupPage(request):
    if request.method=='POST':
        uname=request.POST.get('username')
        email=request.POST.get('email')
        pass1=request.POST.get('password1')
        pass2=request.POST.get('password2')
        if pass1!=pass2:
            messages.error(request,'Password and confirm password is not the same. Try again!')
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
            messages.error(request,'User name or password is wrong. Please try again!')
            return redirect('login')
    return render(request,'login.html')

def LogoutPage(request):
    logout(request)
    return redirect('login')

def ListDiaries(request):
    list_diaries=Diary.objects.all()
    return render(request, 'home.html', {'diaries': list_diaries})



@login_required
def user_info(request):
    return render(request,'user_in4.html',{'user':request.user})