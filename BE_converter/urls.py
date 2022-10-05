from django.urls import path
from . import views

app_name = 'BE_converter'

urlpatterns = [

   path('ex/', views.equation_main, name='expression-main-view'),
   path('tb/', views.index, name='main-view'),
   path('lc/', views.logic_circuit, name='circuit-main-view'),
   path('convert/', views.convert_truth_table, name='convert-view'),
   path('equation_operation/', views.convert_expression, name='expression-view'),
   path('ciruit_operation/', views.convert_circuit, name='circuit-view'),

]
