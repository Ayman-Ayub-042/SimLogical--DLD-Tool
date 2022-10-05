# -*- coding: utf-8 -*-
"""
Created on Wed Sep  1 12:28:09 2021

@author: hera
"""
# -*- coding: utf-8 -*-
"""
Created on Sat Aug 21 23:46:46 2021

@author: hera
"""
from itertools import product
alphabets=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','w','y','z']
#Truth Table Generator
def fullreplacement(expression):
    expression = expression.replace("xnor","#")
    expression = expression.replace("nand","?")
    expression = expression.replace("and","&")
    expression = expression.replace("xor","^")
    expression = expression.replace("nor","!")
    expression = expression.replace("or","|")
    expression = expression.replace("not","~")
    expression=expression.replace(" ","")
    expression=expression.replace("  ","")
    expression=expression.replace("   ","")
    expression=expression.replace("{","(")
    expression=expression.replace("}",")")
    expression=expression.replace("[","(")
    expression=expression.replace("]",")")
    nor_gates=((expression.count("!")) +(expression.count("#"))+(expression.count("?")))  #change#1
    print("gates count",nor_gates)
    print('exp:-------',expression)
    incr_1=0
    while (incr_1 != nor_gates):
        expression=replace_NOR(expression)
        incr_1= incr_1+1  
    print("exp",incr_1,": ",expression)
    return expression
#function to replace the NOR gates in given expression;
def replace_NOR(expression):
    print("inside fucntion !",expression)
    if ("!" in expression):
        location=expression.index("!")
        temp="!"
    elif ("#" in expression):
        location=expression.index("#")
        temp="#"
    elif  "?" in expression:
         location=expression.index("?")
         temp="?"
         
    if(expression[location-1] in  alphabets): #findin left hand side variable of the NOR gate
        if (expression[location]=="!"): #replacing nor gate
            prev= '~(' + expression[location-1] + "|"
        elif (expression[location]== "#"): #replacing xnor gate
            prev= '~(' + expression[location-1] + "^"
        elif (expression[location]== "?"): #replacing nand gate
            prev= '~(' + expression[location-1] + "&"
        leftear= expression[:location-1]
        rightear= expression[location:]
        expression= leftear+prev+rightear
        
    elif(expression[location-1] == ")"):
        incr=location-1
        string_a=""
        string_decr=")"      
        while(string_decr.count(")")!=string_decr.count("(") and (incr >=0)):
            string_a= expression[incr] +string_a
            incr=incr-1
            string_decr=string_a
        
        if (location== "!"):
            prev='~(' + string_a + "|"
        elif (location== "#"):
              prev='~(' + string_a + "^"
        elif (location== "?"):
              prev='~(' + string_a + "&"
        expression=expression.replace(expression[incr+1:location],prev,1)

    elif(expression[location-1] == "("):
        print("unnecessary brackets usage around NOR gate! Please retry")

    expression=expression   #finding the right hand side variable of the NOR gate
    
    location2= expression.index(temp)
    if(expression[location2+1] in  alphabets):
        nextt= expression[location2+1]+")"
        leftear= expression[:location2]
        rightear= expression[location2+2:]
        expression= leftear+nextt+rightear
        
    elif(expression[location2+1] == "("):
        incr=location2+1
        string_b=""
        string_incr="("           
        while(string_incr.count(")")!=string_incr.count("(") and (incr <= len(expression))):
            string_b= string_b +expression[incr]
            incr=incr+1
            string_incr=string_b
        nextt= string_b +")"
        expression=expression.replace(expression[location2:incr],nextt,1)
        
    elif(expression[location2+1] == ")"):
        print("unnecessary brackets usage around NOR gate! Please retry")    
    return expression

def Truthtable(indict):
  expression=indict["input[]"]
  expression=str(expression)
  expression=expression.replace("[","")
  expression=expression.replace("]","")
  expression=expression.replace("'","")
  expression=expression.replace("''","'") 
 
  print("Output: X = " + expression.upper())
  expression=expression.lower()
  opened=expression.count("(")
  closed=expression.count(")")
  
  if(opened != closed):
      print("unbalanced braces, try again")
      return 

  expression=fullreplacement(expression)

  #finding number of variables in input
  unique_set= list(set(expression))
  variables=[]
  for el in range(0, len(unique_set)):
    if(unique_set[el] in alphabets):
        variables.append(unique_set[el])
        variables=sorted(variables)

  inputs=len(variables)   #count number of inputs

#replacing user variables with program variables so that user can use any variable name for its input
  variables=""
  for i in range(0, len(expression)):
     if (expression[i] in alphabets):
         variables= variables+expression[i]
  ordered=list(variables)

#replacing bitwise AND operator with logic AND, bcz bitwise convert NOT into -ve OR NULL num

  print('expression refined= X= ',expression)
  print("\nTruth Table:\n")
  table_array=[] #main array that will store the table values and return to views.py
  variables=ordered #list to hold vaariable names, to be used as headers of the columns

  temp=[[0,1]]*len(variables)
  for ordered in product(*temp):
      iterating_values=[]
      iterating_values.append(ordered)

      expr=expression
      sub_array=[]
      for i in range(0,len(variables)):
          expr=expr.replace(variables[i],str(iterating_values[0][i]))
          sub_array.append(int(iterating_values[0][i]))
      x=str(eval(expr))
      x=x.replace('False','0')
      x=x.replace('True','1')
      x=x.replace('-1','1')
      x=x.replace('-2','0')

      sub_array.append(int(x))
      table_array.append(sub_array)

  variables.append("X")
  return table_array,variables
