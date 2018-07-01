var http = require('http');
var fs = require('fs');
// listens for heroku port or 8080
var port = process.env.PORT || 8080;

// list of doctors
var doctors = [
	{name:"Dr. Michael", specialty:"Pediatrics", area:"Scranton", rating:84},
	{name:"Dr. Jim", specialty:"Pediatrics", area:"Scranton", rating:89},
	{name:"Dr. Pam", specialty:"Family Medicine", area:"Scranton", rating:93},
	{name:"Dr. Angela", specialty:"Pediatrics", area:"Scranton", rating:76},
	{name:"Dr. Dwight", specialty:"Family Medicine", area:"Scranton", rating:100},
	{name:"Dr. Stanley", specialty:"Orthopedist", area:"Scranton", rating:70},
	{name:"Dr. Phyllis", specialty:"Orthopedist", area:"Scranton", rating:99},
	{name:"Dr. Oscar", specialty: "Dermatologist", area:"Scranton", rating:87},
	{name:"Dr. Kevin", specialty:"Family Medicine", area:"Scranton", rating:100},
	{name:"Dr. Toby", specialty:"Orthopedist", area:"Costa Rica", rating:50},
];

http.createServer(function (req, res) {
	fs.readFile('similar.html', function(err, data) {
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    // writes the preexisting html code from similar.html
	    res.write(data);
	    res.write("<table><thead><tr><th>Name</th></tr></thead><tbody id='myTable'>");
	    for(var i = 0; i < doctors.length; i++) {
	    	//writes doctors info
	    	res.write("<tr class="+i+"><td>"+doctors[i].name+"<div class='panel"+i+"' id=panel>Specialty: "+doctors[i].specialty+" / Area: "+doctors[i].area+" / Rating: "+doctors[i].rating+"<hr>Similar Care Providers:<br>");
	    	//generates a list of similar doctors
	    	var simlist = [];
	    	for(var j = 0; j < doctors.length; j++) {
	    		// a doctor is similar if they are not the same person, have the same specialty, in the same area, and have a rating within 10 points of eachother
	    		if(j != i && doctors[j].specialty == doctors[i].specialty && Math.abs(doctors[i].rating-doctors[j].rating) < 11 && doctors[i].area == doctors[j].area)
	    			simlist.push(doctors[j]);
	    	}
	    	// sorts the similar doctors by rating
	    	simlist.sort(function(a, b){return b.rating-a.rating});

	    	// if no similar doctors exist
	    	if(simlist.length == 0) {
	    		res.write(" - None<br>")
	    	}
	    	
	    	// writes each of the similar doctors in sorted order
	    	for(var j = 0; j < simlist.length; j++) {
	    		res.write(" - " + simlist[j].name + " / Specialty: " + simlist[j].specialty + " / Area: "+simlist[j].area+" / Rating: " + simlist[j].rating + "<br>");
	    	}
	    	// ends a table entry
	    	res.write("</div></td></tr>");
	    	// adds a panel dropdown script for that specific table entry
	    	res.write("<script>$(document).ready(function(){ $('#myTable tr."+i+"').click(function(){ $('.panel"+i+"').slideToggle('slow');});});</script>");
	    }
	    // ends the html file
	  	res.write("</tbody></table></body></html>");
	    res.end();
  });
}).listen(port);