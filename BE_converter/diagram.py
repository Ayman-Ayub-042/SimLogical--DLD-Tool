from schemdraw.parsing import logicparse
from .models import Boolean_Expression

def draw(array, pk):
    # primary_key = pk.replace("Boolean_Expression object ","")
    pk = str(pk).replace("Boolean_Expression object (","")
    pk = pk.replace(")","")
    path = "Home/media/"
    image = str(pk)+".png"
    pk = int(pk)
    logic = ''
    len_array = len(array)
    counter_array = 0
    for elements in array:
        len_elements = len(elements)
        counter_elements = 0
        for el in elements:
            if "'" in el:
                el = ' not ' + el.replace("'","")
            if len_elements == 1:
                logic = logic + '(' + el + ')'
            elif counter_elements == 0:
                logic = logic + '(' + el
            elif counter_elements == len_elements-1:
                logic = logic +' and ' + el + ' ) '
            else:
                logic = logic + ' and ' + el
            counter_elements = counter_elements+1
        if len_array==1:
            pass
        elif counter_array != len_array-1:
            logic = logic + ' or '
        counter_array = counter_array+1
    print(logic)
    d = logicparse(logic , outlabel='$Output$')
    d.draw(show=False)
    d.save(path+image)
    Boolean_Expression.objects.filter(pk=pk).update(image=image)
    return(pk)
