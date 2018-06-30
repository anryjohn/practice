var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 8080;

var doctors = [
	{name:"Dr. Michael", specialty:"Pediatrics", rating:84},
	{name:"Dr. Jim", specialty:"Pediatrics", rating:89},
	{name:"Dr. Pam", specialty:"Family Medicine", rating:93},
	{name:"Dr. Angela", specialty:"Pediatrics", rating:76},
	{name:"Dr. Dwight", specialty:"Family Medicine", rating:100},
	{name:"Dr. Toby", specialty:"Orthopedist", rating:50},
];

http.createServer(function (req, res) {
	fs.readFile('similar.html', function(err, data) {
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    res.write(data);
	    res.write("<table><thead><tr><th>Name</th></tr></thead><tbody id='myTable'>");
	    for(var i = 0; i < doctors.length; i++) {
	    	res.write("<tr class="+i+"><td>"+doctors[i].name+"<div class='panel"+i+"' id=panel>Specialty: "+doctors[i].specialty+"  /  Rating: "+doctors[i].rating+"<hr>Similar Care Providers:<br>");
	    	var simlist = [];
	    	for(var j = 0; j < doctors.length; j++) {
	    		if(j != i && doctors[j].specialty == doctors[i].specialty && Math.abs(doctors[i].rating-doctors[j].rating) < 11)
	    			simlist.push(doctors[j]);
	    	}

	    	simlist.sort(function(a, b){return b.rating-a.rating});

	    	if(simlist.length == 0) {
	    		res.write(" - None<br>")
	    	}
	    	
	    	for(var j = 0; j < simlist.length; j++) {
	    		res.write(" - " + simlist[j].name + " / Specialty: " + simlist[j].specialty + " / Rating: " + simlist[j].rating + "<br>");
	    	}
	    	res.write("</div></td></tr>");
	    	res.write("<script>$(document).ready(function(){ $('#myTable tr."+i+"').click(function(){ $('.panel"+i+"').slideToggle('slow');});});</script>");
	    }
	  	res.write("</tbody></table></body></html>");
	    res.end();
  });
}).listen(port);