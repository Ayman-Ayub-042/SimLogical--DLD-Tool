# -*- coding: utf-8 -*-
"""
Created on %(date)s
@author: %(username)s
"""
import json

#function to process data and extract list of connectors and devices
def refine_input(data):
    connectors=((str(data["input1[]"]).replace("[","")).replace("]","")).replace("'","")
    connectors=(connectors.replace("},{","} , {")).lower()
    devices=((str(data["input2[]"]).replace("[","")).replace("]","")).replace("'","")
    devices=(devices.replace("},{","} , {")).lower()
    devices=devices.replace("dc","in")
    devices=devices.replace("led","out")
    #converting into seperate lists of connectors and devices strings
    connectors=list(connectors.split(" , "))
    devices=list(devices.split(" , "))
    #converting lists of string into lists of dictionary
    connectors_list=[]
    devices_list=[]
    
    for i in range(0,len(connectors)):
        temp1=json.loads(connectors[i])
        connectors_list.append(temp1)
    for j in range(0,len(devices)):
        tempd=json.loads(devices[j])
        devices_list.append(tempd)
    return connectors_list,devices_list

#function to parse the operands of all gates around the central gate
def sides(fromid,expression):
    fromid=str(fromid)
    operands=[]
    for items in connectors: #search the fromid in "'to' values of connectors list to get its operandslist.
        if fromid[0:5] in (items["from"]):
            operands.append(items["to"])
    
    if(len(operands)==1):
        expression=expression.replace(fromid,'('+fromid+str(operands[0])+')')
        expression=sides(operands[0],expression)
        return expression
    elif(operands==[]):
        expression=expression
        return expression
    elif(len(operands)==2):
        expression=expression.replace(fromid,'('+str(operands[0])+fromid+str(operands[1])+')')
        for temp in range(0,len(operands)):
            expression=sides(operands[temp],expression)
        return expression
        
    return expression

#function to get central gate id and form raw expression form    
def parse_gates(data):
    global connectors,devices
    connectors,devices=refine_input(data) #send data and extract and return list of connectors and devices
    for dictionary in devices:  #get the id of central or last gate connected directly to output
       if (dictionary['type']=='out'):
           outid=str(dictionary['id'])    
    for wire in connectors:
        if outid in wire["from"]:
            fromid=wire["to"] #storing the id of last gate in circuit which will be the centre of expression
            
    expression=str(fromid) 
    operands=[]
    for items in connectors: #search the gate id in "'to' values of connectors list to get its operands.
        if (items["from"]==fromid):
            operands.append(items["to"]) # operands value is always one here, as there can only be 1 input for an output variable

    expression=sides(fromid,expression)   #"sides function" being called to parse all the operands around the central gate
    expression=expression.replace("out0","")
    return expression,connectors,devices

#function to convert raw expression into a refined final output expression
def create_expr(data):
    expression,connectors,devices=parse_gates(data)
    
    split_list=list(expression.split("."))
    #print("split:",split_list[-4:])
    for item in split_list:
        for device in devices: 
            if item[-4:] in device["id"]:
                expression=expression.replace(item[-4:],device["type"])
    split_list=list(expression.split("."))
    
    alphabets=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','w','y','z']
    j=0
    for i in range (0,len(split_list)):
        if "in" in split_list[i]:
            new_item=split_list[i].replace("in",alphabets[j])
            j=j+1
            split_list[i]=new_item
    final_expression=""
    for items in split_list:
        final_expression=final_expression+items+" "
    print("\n\n\n",final_expression)
    return final_expression   
    
    
    
    