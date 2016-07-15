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
var jsonfile = require('jsonfile');



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
        
        var file ='data';
        var incrementor = 0; 
        var obj =  {
                to: req.body.subject,
                time: req.body.phoneNumber,
                food: req.body.to,
                water: req.body.text
            
            }

        console.log(obj);
        jsonfile.spaces=4
        jsonfile.writeFileSync (file+'json', obj); 
        
        jsonfile.readFile(file, function (err, obj){
            if (obj != null) {
                file = file + (incrementor + 1) + '.json';
                jsonfile.writeFileSync (file, obj); 
            }
        })
//        var mailOptions={
//            to : req.body.to,
//            subject : "New Visit Update from WhatsPup",
//            text : req.body.text,
//            template: 'email_body',
//            context : {
//                to: req.body.to,
//                time: req.body.time,
//                food: req.body.food,
//                water: req.body.water,
//                play: req.body.play,    
//                treats: req.body.treats,
//                meds: req.body.meds,
//                message: req.body.message
//            }
//        }
//        console.log(req.body);
//        transporter.use('compile', hbs(handlebarOptions));
//        
//        transporter.sendMail(mailOptions, function(error, response){
//        if(error){
//            console.log('email error ', error);
//        res.end("error");
//        }else{
//            console.log("Message sent: " + response);
//            res.end("sent");
//         }
//        });
//        
//		if(tableData.length < 5 ){
//			tableData.push(req.body);
//			res.json(true); // KEY LINE
//		}
//		else{
//			waitListData.push(req.body);
//			res.json(false); // KEY LINE
//		}
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