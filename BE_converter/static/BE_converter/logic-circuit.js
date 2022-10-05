const url = window.location.href
var input={};
var connectors;
var devices;
var expression;
var table_array;
var variables;
const csrf = document.getElementsByName('csrfmiddlewaretoken')

function create(event){
  event.preventDefault();
  //delete previous buttons and data
  var be = document.getElementById('be'); //deleting previous 'be' button for truth table
  if ( be != null ) {be.remove(); }
  var circuit = document.getElementById('circuit'); //deleting previous circuit button
  if ( circuit != null )  {circuit.remove();}

  //getting circuit data from workspace
  var $s = simcir;
  var $simcir = $('#mySimcir');
   var getCircuitData = function() {
     return $s.controller(
     $simcir.find('.simcir-workspace') ).text();};

  input=getCircuitData() ; // Get data from workspace
  var obj = JSON.parse(input) //creating JSON object of input
  connectors=JSON.stringify(obj.connectors); //converting devices and connectors to string to send data to python files
  devices=JSON.stringify(obj.devices);
  //errors handlers in input circuit
  if(obj.devices.length==0){ alert("Please add some valid logic circuit first "); }
  else if((obj.connectors.length ==0)  || (obj.connectors.length != obj.devices.length-1 ))
  {alert(" Some devices may have been left un-connected"); }
  else
  {
    
  // create a expression button
  var circuit = document.createElement("button");
  circuit.setAttribute("id", "circuit");
  circuit.setAttribute("type", "button");
  circuit.setAttribute("class", "btn btn-primary m-1");
  circuit.innerHTML = "Get boolean expression";
  circuit.setAttribute("onclick","display_expression();")
  document.getElementById("abc").appendChild(circuit);

  // create a truth table button
  var be = document.createElement("button");
  be.setAttribute("id", "be");
  be.setAttribute("type", "button");
  be.setAttribute("class", "btn btn-primary m-1");
  be.setAttribute("onclick","display_table();")
  be.innerHTML = "Get Truth table";
  document.getElementById("abc").appendChild(be)
    const data = { };
    data['csrfmiddlewaretoken'] = csrf[0].value
    data["input1"]=[connectors]
    data["input2"]=[devices]

    $.ajax({
        type: 'POST',
        url: `http://127.0.0.1:8000/BE_converter/ciruit_operation/`,
        data: data,
        success: function(response){
          expression = response.results
          table_array = response.table
          variables=response.variables},
          error: function(error){  console.log(error)}  });
    }
  } // create(event) function ends here

function display_expression()
{  if(expression != null)
  { var ex = document.getElementById('expression'); //deleting previous boolean_expression
    if ( ex != null ) {  ex.remove();}
    var ex = document.getElementById('tb'); //deleting previous table
    if ( ex != null ) {  ex.remove();  }
    // displaying expression
    const resDiv = document.createElement("div")
    resDiv.innerHTML += expression
    const cls = ['container', 'p-3', 'm-3', 'text-light', 'h6', 'bg-success', 'text-center']
    resDiv.classList.add(...cls)
    resDiv.setAttribute("id", "expression");
    document.getElementById("show_div").append(resDiv)
}}
function display_table()
{ if(expression != null){
          var ex = document.getElementById('tb'); //deleting previous table
          if ( ex != null ) {  ex.remove();  }
          var ex = document.getElementById('expression'); //deleting previous boolean_expression
          if ( ex != null ) {  ex.remove();}

         //constructing and printing table output:
          table = document.createElement('table');
          table.setAttribute("id", "tb");
          table.setAttribute("class","table table-bordered ");

          var tr0 = document.createElement('tr'); //FIRST TABLE ROW THAT CONTAINS VARIABLE NAMES
          //adding variable names as headers in the first row of table
          for (var a = 0; a < variables.length; a++)
          { var t_header = document.createElement('th');
            let text = document.createTextNode(variables[a]);
            t_header.appendChild(text)
            tr0.appendChild(t_header);
            t_header.style.fontSize="30px";
            t_header.style.minInlineSize="70px";
            t_header.style.textAlign="center";
            t_header.style.border="1px solid gray"; }
            table.appendChild(tr0);
            table.style.border="2px solid gray";
        //adding sub arrays as the rows of table:
        for (var loop = 0; loop < table_array.length; loop++)
        { var row = document.createElement('tr');
        //nested loop to populate each row with the data
          for (var nums = 0; nums < variables.length; nums++)
          { var t_data = document.createElement('td');
            var text_2 =document.createTextNode(table_array[loop][nums]);
            t_data.appendChild(text_2);
            t_data.style.border="1px solid gray";
            t_data.style.textAlign="center";
            row.append(t_data); }
        table.appendChild(row);
      } //outer loop to add multiple rows ends here
          document.getElementById("show_div2").appendChild(table)
  }} // function to display table ends here

// Get Circut data and Set Circuit data button action
 $(function() {
     var $s = simcir;
     var $simcir = $('#mySimcir');
      var getCircuitData = function() {
        return $s.controller(
        $simcir.find('.simcir-workspace') ).text();};

     var setCircuitData = function(data) {
        $s.setupSimcir($simcir, JSON.parse(data) ); };
      //button click evt
     $('#getDataBtn').click(function() {
        $('#dataArea').val(getCircuitData() );
     });

     $('#setDataBtn').click(function() {
        if(document.getElementById("dataArea").value.trim() == '')
        { alert("Please Load the Data into the text box to get its Simulation"); }

        else { setCircuitData($('#dataArea').val() ); }
    })  });

//save as txt and load selected file code
function saveTextAsFile()
{   if (document.getElementById('inputFileNameToSaveAs').value=="" || document.getElementById('inputFileNameToSaveAs').value==undefined)
    {   alert ("Please Enter a File Name");
        return false; }
    else{
        var textToSave = document.getElementById("dataArea").value;
        var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
        var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
        var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        downloadLink.href = textToSaveAsURL;
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click(); } }

function destroyClickedElement(event) { document.body.removeChild(event.target);}

function loadFileAsText()
{  /* if (!document.getElementById("fileToLoad").value) {
            event.preventDefault();
            alert("Please choose a file which has the circuit data!"); }
        else {*/
        var fileToLoad = document.getElementById("fileToLoad").files[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent)
        {   var textFromFileLoaded = fileLoadedEvent.target.result;
            document.getElementById("inputTextToSave").value = textFromFileLoaded; };
        fileReader.readAsText(fileToLoad, "UTF-8");
    //}
}

if(sessionStorage.getItem("2bitcomparator")) //load 2-bit counter code
{  var comparator= {
  "width":1100,
  "height":1070,
  "showToolbox":true,
  "toolbox":[
    {"type":"Joint"},
    {"type":"DC"},
    {"type":"LED"},
    {"type":"PushOff"},
    {"type":"PushOn"},
    {"type":"Toggle"},
    {"type":"BUF"},
    {"type":"NOT"},
    {"type":"AND"},
    {"type":"NAND"},
    {"type":"OR"},
    {"type":"NOR"},
    {"type":"NAND","numInputs":"3","label":"NAND(3in)"},
    {"type":"XOR"},
    {"type":"XNOR"},
    {"type":"OSC"},
    {"type":"BusIn"},
    {"type":"BusOut"},
    {"type":"RS-FF"},
    {"type":"JK-FF"},
    {"type":"T-FF"},
    {"type":"D-FF"},
    {"type":"D-FF-custom"},
    {"type":"DSO","numInputs":8} ],

  "devices":[
    {"type":"NOR","id":"dev0","x":616,"y":240,"label":"NOR"},
    {"type":"NOR","id":"dev1","x":616,"y":320,"label":"NOR"},
    {"type":"Toggle","id":"dev2","x":128,"y":144,"label":"Toggle","state":{"on":true}},
    {"type":"DC","id":"dev3","x":88,"y":56,"label":"DC"},
    {"type":"DC","id":"dev4","x":208,"y":56,"label":"DC"},
    {"type":"DC","id":"dev5","x":328,"y":56,"label":"DC"},
    {"type":"DC","id":"dev6","x":448,"y":56,"label":"DC"},
    {"type":"Joint","id":"dev7","x":192,"y":256,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev8","x":408,"y":240,"label":"Joint","state":{"direction":0}},
    {"type":"Toggle","id":"dev9","x":496,"y":144,"label":"Toggle","state":{"on":false}},
    {"type":"Toggle","id":"dev10","x":360,"y":144,"label":"Toggle","state":{"on":false}},
    {"type":"Joint","id":"dev11","x":288,"y":320,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev12","x":536,"y":336,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev13","x":816,"y":336,"label":"Joint","state":{"direction":0}},
    {"type":"LED","id":"dev14","x":856,"y":264,"label":"LED"},
    {"type":"AND","id":"dev15","x":752,"y":264,"label":"AND"},
    {"type":"NOT","id":"dev16","x":376,"y":440,"label":"NOT"},
    {"type":"NOT","id":"dev17","x":504,"y":440,"label":"NOT"},
    {"type":"NAND","id":"dev18","x":712,"y":504,"label":"NAND"},
    {"type":"NAND","numInputs":"3","label":"NAND(3in)","id":"dev19","x":720,"y":720},
    {"type":"Joint","id":"dev20","x":192,"y":504,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev21","x":424,"y":520,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev22","x":312,"y":608,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev23","x":432,"y":624,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev24","x":544,"y":632,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev25","x":176,"y":712,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev26","x":336,"y":728,"label":"Joint","state":{"direction":0}},
    {"type":"Joint","id":"dev27","x":568,"y":736,"label":"Joint","state":{"direction":0}},
    {"type":"NAND","numInputs":"3","label":"NAND(3in)","id":"dev28","x":712,"y":616},
    {"type":"NAND","numInputs":"3","label":"NAND(3in)","id":"dev29","x":856,"y":616},
    {"type":"NOR","id":"dev30","x":880,"y":416,"label":"NOR"},
    {"type":"Joint","id":"dev31","x":832,"y":472,"label":"Joint","state":{"direction":0}},
    {"type":"LED","id":"dev32","x":928,"y":616,"label":"LED"},
    {"type":"LED","id":"dev33","x":936,"y":416,"label":"LED"},
    {"type":"Toggle","id":"dev34","x":240,"y":144,"label":"Toggle","state":{"on":true}} ],
  "connectors":[
    {"from":"dev0.in0","to":"dev8.out0"},
    {"from":"dev0.in1","to":"dev7.out0"},
    {"from":"dev1.in0","to":"dev11.out0"},
    {"from":"dev1.in1","to":"dev12.out0"},
    {"from":"dev2.in0","to":"dev3.out0"},
    {"from":"dev7.in0","to":"dev2.out0"},
    {"from":"dev8.in0","to":"dev10.out0"},
    {"from":"dev9.in0","to":"dev6.out0"},
    {"from":"dev10.in0","to":"dev5.out0"},
    {"from":"dev11.in0","to":"dev34.out0"},
    {"from":"dev12.in0","to":"dev9.out0"},
    {"from":"dev13.in0","to":"dev15.out0"},
    {"from":"dev14.in0","to":"dev15.out0"},
    {"from":"dev15.in0","to":"dev0.out0"},
    {"from":"dev15.in1","to":"dev1.out0"},
    {"from":"dev16.in0","to":"dev10.out0"},
    {"from":"dev17.in0","to":"dev9.out0"},
    {"from":"dev18.in0","to":"dev20.out0"},
    {"from":"dev18.in1","to":"dev21.out0"},
    {"from":"dev19.in0","to":"dev25.out0"},
    {"from":"dev19.in1","to":"dev26.out0"},
    {"from":"dev19.in2","to":"dev27.out0"},
    {"from":"dev20.in0","to":"dev2.out0"},
    {"from":"dev21.in0","to":"dev16.out0"},
    {"from":"dev22.in0","to":"dev34.out0"},
    {"from":"dev23.in0","to":"dev21.out0"},
    {"from":"dev24.in0","to":"dev17.out0"},
    {"from":"dev25.in0","to":"dev2.out0"},
    {"from":"dev26.in0","to":"dev22.out0"},
    {"from":"dev27.in0","to":"dev24.out0"},
    {"from":"dev28.in0","to":"dev22.out0"},
    {"from":"dev28.in1","to":"dev23.out0"},
    {"from":"dev28.in2","to":"dev24.out0"},
    {"from":"dev29.in0","to":"dev18.out0"},
    {"from":"dev29.in1","to":"dev28.out0"},
    {"from":"dev29.in2","to":"dev19.out0"},
    {"from":"dev30.in0","to":"dev13.out0"},
    {"from":"dev30.in1","to":"dev31.out0"},
    {"from":"dev31.in0","to":"dev29.out0"},
    {"from":"dev32.in0","to":"dev29.out0"},
    {"from":"dev33.in0","to":"dev30.out0"},
    {"from":"dev34.in0","to":"dev4.out0"} ]}
    document.querySelector(".simcir")
    var html1=JSON.stringify(comparator);   //set all the settings as string inside div
    document.querySelector(".simcir").innerHTML=html1;
    document.querySelector(".simcir").classList.add("unclickable");  //makes the simulation place active only for tonggle ON/OFF
  }
else{  var obj={
        "width":1000,
        "height":500,
        "showToolbox":true,
        "toolbox":[
          {"type":"In"},{"type":"Out"},
         
          {"type":"DC"},
          {"type":"LED"},
         
          {"type":"BUF"},
          {"type":"NOT"},
          {"type":"AND"},
         
          {"type":"NAND"},
         
          {"type":"OR"},
         
          {"type":"NOR"},
         
          {"type":"XOR"},
         
          {"type":"XNOR"},
         
          
],
        "devices":[ ],
        "connectors":[ ] };
    var html=JSON.stringify(obj);
    document.querySelector(".simcir").innerHTML=html; }

$("#load2bit").click(function(event) {
    sessionStorage.setItem("2bitcomparator",1);
    location.reload(); });

$("#clear-workspace").click(function(event) {
    sessionStorage.removeItem("2bitcomparator");
    location.reload(); });
