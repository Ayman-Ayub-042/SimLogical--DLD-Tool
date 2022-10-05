const url = window.location.href

var boolean_expression_text
var image_no
function Create(event) {
    event.preventDefault();
    var no_of_inputs = document.getElementById("input").value;
    tableCreate(no_of_inputs);
}
function tableCreate(no_of_inputs) {
  var pre_table = document.getElementById('tb'); //previous table
  if (typeof pre_table != 'undefined') //deleting previous table
  {
    pre_table.parentNode.removeChild(pre_table);
  }
  var sub = document.getElementById('sub'); //deleting previous submit data button
  if ( sub != null )
  {
    sub.remove();
  }
  var be = document.getElementById('be'); //deleting previous be button
  if ( be != null )
  {
    be.remove();
  }

  var circuit = document.getElementById('circuit'); //deleting previous circuit button
  if ( circuit != null )
  {
    circuit.remove();
  }
  var ex = document.getElementById('expression'); //deleting previous boolean_expression
  if ( ex != null )
  {
    ex.remove();
  }
  var c_image = document.getElementById('c_image'); //deleting previous circuit_image
  if ( c_image != null )
  {
    c_image.remove();
  }
  table = document.createElement('table')
  table.setAttribute("id", "tb");
  table.setAttribute("class","table table-bordered")
  var input_name = 'A';

  var tr = document.createElement('tr');
  for (var a = 0; a < no_of_inputs; a++) {
    var th = document.createElement('th');
    var text = document.createTextNode(input_name);
    th.appendChild(text);
    tr.appendChild(th);
    input_name = String.fromCharCode(input_name.charCodeAt(0) + 1);
  }
  table.appendChild(tr);

  var th = document.createElement('th');
  var text = document.createTextNode("Output");
  th.appendChild(text);
  tr.appendChild(th);
  var no_of_rows = Math.pow(2, no_of_inputs)
    for (var i = 0; i < no_of_rows*2; i++){
        var tr = document.createElement('tr');
        for (var j = no_of_inputs; j >= 0; j--) {
          if (i%2==0) {
            if (j!=0){
              var td = document.createElement('td');
              var value = (i & Math.pow(2,j)) ? 1 : 0
              var text = document.createTextNode(value);
              td.appendChild(text);
              tr.appendChild(td); // appending inputs
            }
            else {
              var td = document.createElement('td');
              var FN = document.createElement("input");
              FN.setAttribute("type", "number");
              FN.setAttribute("class", "out");
              FN.setAttribute("name", i/2);
              FN.setAttribute("min", "0");
              FN.setAttribute("max", "1");
              FN.setAttribute("required", "True");
              td.appendChild(FN);
              tr.appendChild(td); // appending outputs
            }
          }
          }
      table.appendChild(tr); //appending rows
  }

  document.getElementById("truth_table1").appendChild(table); //creating new table
    // create a submit data button
  var submit = document.createElement("button");
  submit.setAttribute("id", "sub");
  submit.setAttribute("type", "submit");
  submit.setAttribute("class", "btn btn-primary m-1");
  submit.innerHTML = "Submit Data";
  document.getElementById("truth_table2").appendChild(submit);

}
const outputForm = document.getElementById('output-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

function sendData(event) {
  event.preventDefault();
  document.getElementById("sub").style.display = 'none'
  // create a boolean_expression button
  var be = document.createElement("button");
  be.setAttribute("id", "be");
  be.setAttribute("type", "button");
  be.setAttribute("class", "btn btn-primary m-1");
  be.setAttribute("onclick","sendData_boolean();")
  be.innerHTML = "Generate Boolean Expression";
  document.getElementById("truth_table4").appendChild(be);

  // create a circuit button
  var circuit = document.createElement("button");
  circuit.setAttribute("id", "circuit");
  circuit.setAttribute("type", "button");
  circuit.setAttribute("class", "btn btn-primary m-1");
  circuit.innerHTML = "Generate Circuit";
  circuit.setAttribute("onclick","sendData_circuit();")
  document.getElementById("truth_table3").appendChild(circuit);
  const data = {}
  const elements = [...document.getElementsByClassName('out')]
  data['csrfmiddlewaretoken'] = csrf[0].value
  elements.forEach(el=>{
        data[el.name] = el.value
      })

  $.ajax({
      type: 'POST',
      url: `http://127.0.0.1:8000/BE_converter/convert/`,
      data: data,
      success: function(response){
        boolean_expression_text = response.results
        image_no = response.image
        },
        error: function(error){
          console.log(error)
        }
      })
}

function sendData_boolean()
{
  if(boolean_expression_text != null)
  {
    var ex = document.getElementById('expression'); //deleting previous boolean_expression
    if ( ex != null )
    {
      ex.remove();
    }
    var c_image = document.getElementById('c_image'); //deleting previous circuit_image
    if ( c_image != null )
    {
      c_image.remove();
    }
    const resDiv = document.createElement("div")
    resDiv.innerHTML += boolean_expression_text
    const cls = ['container', 'p-3', 'm-3', 'text-light', 'h6', 'bg-success', 'text-center']
    resDiv.classList.add(...cls)
    resDiv.setAttribute("id", "expression");
    document.getElementById("truth_table").append(resDiv)
  }
}
function sendData_circuit() {
  if (boolean_expression_text != null) {
    var ex = document.getElementById('expression'); //deleting previous boolean_expression
    if ( ex != null )
    {
      ex.remove();
    }
    const circuit_image = document.createElement("img")
    circuit_image.src = `http://127.0.0.1:8000/media/${image_no}.png`
    circuit_image.setAttribute("id", "c_image");

    document.getElementById("truth_table5").append(circuit_image)
  }
}
