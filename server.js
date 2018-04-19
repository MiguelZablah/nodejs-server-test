const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// Set hbs partial views
hbs.registerPartials(__dirname + '/views/partials');
// Set the view engine to use
app.set('view engine', 'hbs');

// Regist midelwear
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log.');
		}
	});
	next();// requiere to continue exectuion
});

// Midelwear for web in maintenance, we not call next()
// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// })

// Make static all public directory public to server
app.use(express.static(__dirname + '/public'));

// hbs regist helper to get current year
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});
// hbs regist helper to get capitalize
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

// returns on root
app.get('/', (req, res) => {
	// res.send('<h1>Hello Expres!</h1>');
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to express server!'
	}); // renders using hbs views and send obj
});

// /about return a html h1
app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page',
	}); // renders using hbs views and send obj
});

// /bad - send back json with error
app.get('/bad', (req, res) => {
	res.send({
		error: {
			status: 404,
			message: 'Not Found'
		},
	});
});

// Set server port and send a message
app.listen(3000, () => {
	console.log('Server is up on port 3000');
});