from django.urls import path
from . import views

app_name = 'Home'

urlpatterns = [
    
    path('register/', views.register, name="register"),
	path('login/', views.loginpage, name="login"),  
    path('logout/', views.logoutuser, name="logout"),
   path('', views.index, name='main-view'),
   path('home/', views.home1, name='home1-view'),
   path('about/', views.about, name='about-view'),
   path('help/', views.help, name='help-view'),
  

]
