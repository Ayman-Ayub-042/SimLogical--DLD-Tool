from django.shortcuts import render
from django.http import JsonResponse
from .convert import min_terms # to calculate minimized expr from truth table, used in convert_truthtbale view
from .diagram import draw #used in convert_truthtable view for drawing circuit diagram from table
from .exp_to_circuit import easy_draw #for drawing circuit from expression, in convert expression view (similar to .diagram)
from .generate_table_array import Truthtable #to create truth table from expression in convert_circuit and convert_expression views
from .models import Boolean_Expression
from .circuit_to_exp import create_expr # to form expression from circuit,in last view of convert_circuit
# Create your views here.

def index(request):
    return render(request, 'BE_converter/main.html')

def convert_truth_table(request):
    if request.is_ajax():
        minterms = []
        data = request.POST
        data_ = dict(data.lists()) #convert querydictionary into ordinary dictionary
        data_.pop('csrfmiddlewaretoken')
        for name,value in data_.items():
            if value[0] == '1':
                minterms.append(int(name)) #extracting minterms
        total_inputs=(len(data_)/2)
        boolean_expression = min_terms(minterms,total_inputs)
       # boolean_expression = min_terms(minterms)
        result = ' + '.join(''.join(i) for i in boolean_expression)
        Boolean_Expression.objects.create(expression=result) #creating expression
        expression_pk = Boolean_Expression.objects.latest('pk') #primary key of expression just created
        circuit_image_path = draw(boolean_expression, expression_pk) #creating circuit diagram
        print(circuit_image_path)
        return JsonResponse({ 'results': result,
                                'expression': boolean_expression,
                                'image': circuit_image_path})

def equation_main(request):
    return render(request, 'BE_converter/user_equation.html')

def convert_expression(request):
    if request.is_ajax():
        data = request.POST
        result = dict(data) #convert querydictionary into ordinary dictionary
        result.pop('csrfmiddlewaretoken')
        result2=str(result)
        result2=result2.replace("[","")
        result2=result2.replace("]","")
        Boolean_Expression.objects.create(expression=str(result2))
        expression_pk = Boolean_Expression.objects.latest('pk') #primary key of expression just created
        circuit_image_path = easy_draw(result, expression_pk) #creating circuit diagram and fetch its key
        table_array,variables= Truthtable (result) #creating output truth table array  and the variables array
        return JsonResponse({ 'results': table_array,
                                'variables':variables,
                                'image': circuit_image_path})

def logic_circuit(request):
    return render(request, 'BE_converter/logic_circuit.html')

def convert_circuit(request):
    if request.is_ajax():
        data = request.POST
        input = dict(data) #convert querydictionary into ordinary dictionary
        input.pop('csrfmiddlewaretoken')
        express=create_expr(input)
        print("this is output: ",express)
        dict_exp={}
        dict_exp["input[]"]=express
        tb,variables= Truthtable (dict_exp)
        print("tb:",tb)
        return JsonResponse({ 'results': express,
                                'table':tb,
                                'variables':variables})
