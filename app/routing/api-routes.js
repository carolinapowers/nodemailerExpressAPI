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
var options = require ('../credentials.js');
var hbs = require('nodemailer-express-handlebars');
var smtpTransport = require('nodemailer-smtp-transport');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var transporter = nodemailer.createTransport(smtpTransport(options));

var handlebarOptions = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'app/routing/views/email/',
         defaultLayout : 'email_body',
         partialsDir : 'views/partials/'
     },
     viewPath: 'app/routing/views/email/',
     extName: '.hbs'
 };

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app){
	app.post('/api/tables', function(req, res){         
        var mailOptions={
            to : req.body.to,
            subject : req.body.subject,
            text : req.body.text,
            template: 'email_body',
            context : {
                phoneNumber : req.body.phoneNumber
            }
        }
        
        console.log(mailOptions);
        transporter.use('compile', hbs(handlebarOptions));
        
        transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log('email error ', error);
        res.end("error");
        }else{
            console.log("Message sent: " + response);
            res.end("sent");
         }
        });
        
		if(tableData.length < 5 ){
			tableData.push(req.body);
			res.json(true); // KEY LINE
		}
		else{
			waitListData.push(req.body);
			res.json(false); // KEY LINE
		}
    });
    
    
	app.get('/api/tables', parseUrlencoded, function(req, res){
       res.json(tableData);
	});

	app.get('/api/waitlist', function(req, res){
		res.json(waitListData);
	});
        
	app.post('/api/clear', function(req, res){
		tableData = [];
		waitListData = [];        
	});
}