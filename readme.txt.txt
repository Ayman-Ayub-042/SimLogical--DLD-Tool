TruthTableConverter

The Quine-McCluskey algorithm is used to generate the boolean expression. 
Here is the description link of this method: 
https://en.wikipedia.org/wiki/Quine%E2%80%93McCluskey_algorithm

Schemdraw library is used to draw circuit diagrams through logic parser. 
Diagram is converted into image and saved in database. 
The webpage display diagram through database.

First setup django environment in your system then naigate to converter folder which contains file "manage.py"
Run command:

python manage.py runserver

This command will generate the link of local server
Open this link in web browser and enjoy converting truth tables:)

