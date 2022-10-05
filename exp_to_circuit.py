# -*- coding: utf-8 -*-
"""
Created on Sun Aug 22 16:03:47 2021

@author: hera
"""

from schemdraw.parsing import logicparse
from .models import Boolean_Expression

def easy_draw(indict, pk):
    array=indict["input[]"]
    array=str(array)
    array=array.replace("[","")
    array=array.replace("]","")
    array=array.replace("'","")
    array=array.replace("''","'")
    array=array.replace(" ","")
    array=array.replace("  ","")
    array=array.replace("   ","")
    array=array.lower()
    opened=array.count("(")
    closed=array.count(")")
    if(opened != closed):
      print("unbalanced braces, try again")
      return

    pk = str(pk).replace("Boolean_Expression object (","")
    pk = pk.replace(")","")
    path = "Home/media/"
    image = str(pk)+".png"
    pk = int(pk)
    d = logicparse(array , outlabel='$Output$')
    d.draw(show=True)
    d.save(path+image)
    Boolean_Expression.objects.filter(pk=pk).update(image=image)
    return(pk)
