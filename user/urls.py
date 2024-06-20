from django.urls import path
from .views import SignupPage, LoginPage, LogoutPage, HomePage, ListDiaries, user_info

urlpatterns=[
    path('signup/',SignupPage,name='signup'),
    path('login/',LoginPage,name='login'),
    path('home/',HomePage,name='home'),
    path('logout/',LogoutPage,name='logout'),
    path('setting-user',user_info,name='setting-user'),
]