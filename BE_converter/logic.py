import numpy as np
no_of_inputs = int(input("Enter number of inputs: "))

no_of_rows = pow(2,no_of_inputs)

print(no_of_rows)
print(no_of_inputs)
inputs = [[0 for x in range(no_of_inputs+1)] for y in range(no_of_rows)]
print(inputs)

initialize = '@'
for a in range(0,no_of_rows):
    for b in range(0,no_of_inputs):
        # inputs[a][b] = int(input("Enter value for row "+str(a+1)+" Input "+str(b+1)+" "))
        b=b+1
    inputs[a][no_of_inputs] = int(input("Enter Output for row "+str(a)+" "))
    a=a+1

np_array = np.array(inputs)
print("input array is given below")
print(np_array)
mask = np_array[:, -1] == 1 #slecting rows with output 1
output_ARRAY = np_array[:, -1]
if no_of_inputs == 3:
    output_ARRAY = output_ARRAY.reshape(2, 4)
else:
    output_ARRAY = output_ARRAY.reshape(no_of_inputs, no_of_inputs)
true_indices = np.where(output_ARRAY == 1)  #slecting rows with output 1
listOfCoordinates= np.array(list(zip(true_indices[0], true_indices[1])))
print(listOfCoordinates)
print(len(listOfCoordinates))
print(output_ARRAY)
array_1 = np_array[mask, :]
len_array = len(array_1)
boolean_expression = ''
for a in range(0,len_array):
    boolean_expression = boolean_expression + "( "
    for b in range(0,no_of_inputs):
        if array_1[a][b]==1:
            if b!=no_of_inputs-1:
                input_name = chr(ord(initialize) + b+1)
                boolean_expression = boolean_expression + input_name + " AND "
            else:
                input_name = chr(ord(initialize) + b+1)
                boolean_expression = boolean_expression + input_name
        else:
            if b!=no_of_inputs-1:
                input_name = chr(ord(initialize) + b+1)
                boolean_expression = boolean_expression + " NOT " + input_name + " AND "
            else:
                input_name = chr(ord(initialize) + b+1)
                boolean_expression = boolean_expression + " NOT " + input_name
    if a!=len_array-1:
        boolean_expression = boolean_expression + ") OR "
    else:
        boolean_expression = boolean_expression + ")"

print("Boolean Expression = " + boolean_expression)
