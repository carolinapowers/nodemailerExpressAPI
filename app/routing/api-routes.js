// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources. 
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var tableData 		= require('../data/table-data.js');
var waitListData 	= require('../data/waitinglist-data.js');
var path 			= require('path');
var nodemailer      = require('nodemailer');
var bodyParser      = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "carolinapoloni@gmail.com",
        pass: ""
    }
});




// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app){

	// API GET Requests
	// Below code handles when users "visit" a page. 
	// In each of the below cases when a user visits a link 
	// (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table) 
	// ---------------------------------------------------------------------------

	app.get('/api/tables', parseUrlencoded, function(req, res){
       res.json(tableData);
	});

	app.get('/api/waitlist', function(req, res){
		res.json(waitListData);
	});
    

	// API POST Requests
	// Below code handles when a user submits a form and thus submits data to the server.
	// In each of the below cases, when a user submits form data (a JSON object)
	// ...the JSON is pushed to the appropriate Javascript array
	// (ex. User fills out a reservation request... this data is then sent to the server...
	// Then the server saves the data to the tableData array)
	// ---------------------------------------------------------------------------

	app.post('/api/tables', function(req, res){
        console.log(req.body);
        console.log('req.body.to ', req.body.to);
        
        var mailOptions={
            to : req.body.to,
            subject : req.body.subject,
            text : req.body.text
        }
        
        
        console.log(mailOptions);
        
        smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log('email error ', error);
        res.end("error");
        }else{
            console.log("Message sent: " + response.message);
            res.end("sent");
         }
        });

        
     
		// Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
		// It will do this by sending out the value "true" have a table 
		if(tableData.length < 5 ){
			tableData.push(req.body);
			res.json(true); // KEY LINE
		}

		// Or false if they don't have a table
		else{
			waitListData.push(req.body);
			res.json(false); // KEY LINE
		}
        
        
	});

	// ---------------------------------------------------------------------------
	// I added this below code so you could clear out the table while working with the functionality.
	// Don't worry about it!

	app.post('/api/clear', function(req, res){
		// Empty out the arrays of data
		tableData = [];
		waitListData = [];

//		console.log(tableData);
//         console.log(req.query.costumerEmail);
		
        
	})
}