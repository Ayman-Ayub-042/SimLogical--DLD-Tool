from django.shortcuts import render, redirect 
from django.http import HttpResponse
from django.forms import inlineformset_factory
from django.contrib.auth.forms import UserCreationForm

from django.contrib.auth import authenticate, login, logout

from django.contrib import messages

from django.contrib.auth.decorators import login_required

# Create your views here.
from .models import *
from .forms import  CreateUserForm

# Create your views here.

def index(request):
    return render(request, 'BE_converter/Home.html')

def home1(request):
    return render(request, 'BE_converter/Home1.html')

def about(request):
    return render(request, 'BE_converter/About.html')

def help(request):
    return render(request, 'BE_converter/Help.html')



def register(request):
   if request.user.is_authenticated:
       return redirect('Home:home1-view')
   else:
	   form = CreateUserForm()
	   if request.method == 'POST':
		   form = CreateUserForm(request.POST)
		   if form.is_valid():
			   form.save()
			   user = form.cleaned_data.get('username')
			   messages.success(request, 'Account was created for ' + user)

			   return redirect('Home:login')
			

	   context = {'form':form}
	   return render(request, 'BE_converter/a.html', context)

def loginpage(request):
	if request.user.is_authenticated:
		return redirect('Home:home1-view')
	else:
		if request.method == 'POST':
			username = request.POST.get('username')
			password =request.POST.get('password')

			user = authenticate(request, username=username, password=password)

			if user is not None:
				login(request, user)
				return redirect('Home:home1-view')
			else:
				messages.info(request, 'Username OR password is incorrect')

		context = {}
		return render(request, 'BE_converter/login.html', context)

def logoutuser(request):
	logout(request)
	return redirect('Home:main-view')


