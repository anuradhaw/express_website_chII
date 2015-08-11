// Declare Variables
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

// build the REST operation for the base for clients - http://127.0.0.1:3000/ourclients
router.route('/')
	router.get('/clients',function(req,res,next){
		mongoose.model('Client').find({}, function(err, clients){
			if(err){
				return console.err(err);
			} else{
				res.format({
					html: function(){
						res.render('clients/index', {title: 'Our Clients', "clients" : clients});
					},
				
				// respond to JSON - diplay in JSON forms
					json: function(){
						res.json(infophotos);
					}
				});
			}
		});	
	});
	


    // Add New Client
	router.post('/clients',function(req,res){
		// Get values from POST request
		var name = req.body.name;
		var email = req.body.email;
		var phone = req.body.phone;
		
		mongoose.model('Client').create({
			name: name,
			email: email,
		    phone: phone
		}, function(err, client){
			if(err){
				res.send("Sorry, we couldn't add your data to the database");
			} else{
				console.log('POST creating new client:' + client);
				res.format({
					html: function(){
						res.location("clients");
						res.redirect("/clients");
					},
					json: function(){
						res.json(client);
					}
				});
			}
		});
	});
	
	
		
		
		
//GET Clients page 
router.get('/new_client', function(req,res){
		res.render('clients/new_client', { title: 'Add New Client'});
});	



// route middleware to validate :id
router.param('id', function(req, res, next, id) {
     //find the ID in the Database
    mongoose.model('Client').findById(id, function (err, client) {
        //Respond with a 404 if it is not found
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        } else {
            req.id = id;
            next(); 
        } 
    });
});


// Show and List Client Details
router.route('/:id')
	router.get('/clients/:id', function(req,res){
		mongoose.model('Client').findById( req.id, function(err, client){
			if (err) {
				console.log('GET Error: There was a problem retrieving: ' + err);
			} else {
				console.log('GET Retrieving ID: ' + client._id);
				res.format({
					html: function(){
						res.render('clients/show_client', { title: 'Client Details', "client": client});
					},
					json: function(){
						res.json(client);
					}
				});
			}
		});
	});
	
// Edit, Update, and Delete Client Details


router.route('/:id/edit_client')
	// Get individual client by MongoID and Edit Client Details
	router.get('/clients/:id/edit_client', function(req,res){
		//Search for the client within the database
		mongoose.model('Client').findById(req.id, function(err, client){
			if(err){
				console.log('GET Error: There was a problem retrieving: ' + err);
			} else {
				console.log('GET Retrieving ID: ' + client._id);
				res.format({
					html:function(){
						res.render('clients/edit_client',{ title: 'Update Client Details', "client" : client});
					},
					json: function(){
						res.json(client);
					}
				})
			}
			
		});
	});
	
	// Update Client details in the database
	router.put('/clients/:id/edit_client', function(req,res){
		var name = req.body.name;
		var email = req.body.email;
		var phone = req.body.phone;
		
        // Find the client by ID
		mongoose.model('Client').findById(req.id, function(err, client){
			// Update client details
			client.update({
				name : name,
	            email : email,
	            phone : phone
			}, function (err, clientID){
				if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	            } else {
					  //Redirects to client list page
	                  res.format({
	                      html: function(){
	                           res.redirect("/clients/" + client.id);
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(client);
	                     }
	                  });
				}
			})
		});
	});
	
	// Delete a client by ID
	router.delete('/clients/:id/edit_client', function(req,res){
		mongoose.model('Client').findById(req.id, function(err,client){
				client.remove(function(err, client){
				console.log('DELETE removing ID: ' + client._id);
				res.format({
					html:function(){
						res.redirect("/clients");
					}
				});
			});
		});
	});
	
module.exports = router;
