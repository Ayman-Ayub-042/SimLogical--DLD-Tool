const url = window.location.href

var bool_table_array
var variables
var image_no

const outputForm = document.getElementById('output-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

function Create(event) {
  event.preventDefault();
  var user_input = document.getElementById("input").value; //expression input

  var be = document.getElementById('be'); //deleting previous 'be' button for truth table
  if ( be != null ) {be.remove(); }
  var circuit = document.getElementById('circuit'); //deleting previous circuit button
  if ( circuit != null )  {circuit.remove();}
  var ex = document.getElementById('tb'); //deleting previous truth table
  if ( ex != null )  {  ex.remove();  }
  var c_image = document.getElementById('c_image'); //deleting previous circuit_image
  if ( c_image != null )  {  c_image.remove();}

  // create a 'generate truth table' button
  var be = document.createElement("button");
  be.setAttribute("id", "be");
  be.setAttribute("type", "button");
  be.setAttribute("class", "btn btn-primary m-1");
  be.setAttribute("onclick","send_output_table();")
  be.innerHTML = "Generate Truth table";
document.getElementById("table_button_div").appendChild(be)
// create a circuit button
var circuit = document.createElement("button");
circuit.setAttribute("id", "circuit");
circuit.setAttribute("type", "button");
circuit.setAttribute("class", "btn btn-primary m-1");
circuit.innerHTML = "Generate Circuit";
circuit.setAttribute("onclick","send_output_circuit();")
document.getElementById("circuit_button_div").appendChild(circuit);

const data = {}
data['csrfmiddlewaretoken'] = csrf[0].value
data["input"]=[user_input]

 $.ajax({
      type: 'POST',
      url: `http://127.0.0.1:8000/BE_converter/equation_operation/`,
      data: data,
      success: function(response){
        bool_table_array = response.results
        variables=response.variables
        image_no = response.image },
        error: function(error){  console.log(error)}  }) }

function send_output_table()
{      if(bool_table_array != null){
        var ex = document.getElementById('tb'); //deleting previous table
        if ( ex != null ) {  ex.remove();  }
        var c_image = document.getElementById('c_image'); //deleting previous circuit_image
        if ( c_image != null ){  c_image.remove();  }
//constructing and printing table output:
        table = document.createElement('table');
        table.setAttribute("id", "tb");
        table.setAttribute("class","table table-bordered ");

        //FIRST TABLE ROW THAT CONTAINS VARIABLE NAMES
        var tr0 = document.createElement('tr');
        //adding variable names as headers in the first row of table
        for (var a = 0; a < variables.length; a++)
        {
          var t_header = document.createElement('th');

          let text = document.createTextNode(variables[a]);
          t_header.appendChild(text)
          tr0.appendChild(t_header);
          t_header.style.fontSize="30px";
          t_header.style.minInlineSize="70px";
          t_header.style.textAlign="center";
          t_header.style.border="1px solid gray";

        }
          table.appendChild(tr0);
          table.style.border="2px solid gray";
      //adding sub arrays as the rows of table:
      for (var loop = 0; loop < bool_table_array.length; loop++){
        var row = document.createElement('tr');
      //nested loop to populate each row with the data
        for (var nums = 0; nums < variables.length; nums++)
        {
          var t_data = document.createElement('td');
          var text_2 =document.createTextNode(bool_table_array[loop][nums]);
          t_data.appendChild(text_2);
          t_data.style.border="1px solid gray";
          t_data.style.textAlign="center";
          row.append(t_data);
        } table.appendChild(row);
    } //outer loop to add multiple rows ends here
        document.getElementById("output_div").appendChild(table)
}} // function to display table ends here

function send_output_circuit()
{      if(bool_table_array != null){
        var ex = document.getElementById('tb'); //deleting previous table
        if ( ex != null ) {  ex.remove();  }
        var c_image = document.getElementById('c_image'); //deleting previous circuit_image
        if ( c_image != null ){  c_image.remove();  }

        //posting the circuit image in output_img_div

        const circuit_image = document.createElement("img")
        circuit_image.src = `http://127.0.0.1:8000/media/${image_no}.png`
        circuit_image.setAttribute("id", "c_image");
        const cls = ['container', 'bg-white', 'image-center']
        circuit_image.classList.add(...cls)
        document.getElementById("output_img_div").append(circuit_image)

        }
}
