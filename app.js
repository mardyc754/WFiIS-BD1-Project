const bodyParser = require('body-parser');
const express = require ("express");
const session = require("express-session");
const app = express();
const pug = require('pug');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const pool = require('./connection').connect();
const path = require("path")

const reservationRouter = require('./routers/reservation');
const hotelRouter = require('./routers/hotel');
const guestRouter = require('./routers/guest');
const employeeRouter = require('./routers/employee');
const serviceRouter = require('./routers/service');


app.use(session({
	secret: 'nothingspecialishere',
	resave: true,
	saveUninitialized: true,
	guestId: null,
	employeeId: null,
	sessionType: 'offline'
}));

app.use('/reservations', reservationRouter);
app.use('/hotel', hotelRouter);
app.use('/services', serviceRouter);
app.use('/guest', guestRouter);
app.use('/employee', employeeRouter);


app.get("/", (req, res) => {
	let session = req.session;
	result = pug.compileFile('templates/home.pug');
	res.status(200).send(result({sessionType: session.sessionType,
								guestId: session.guestId,
								employeeId: session.employeeId}));
});


app.get('/public/js/url.js', function(req,res) {
    res.sendFile(__dirname + '/public/js/url.js');
})

app.get('/public/js/guest.js', function(req,res) {
    res.sendFile(__dirname + '/public/js/guest.js');
})

app.get('/public/js/main.js', function(req,res) {
    res.sendFile(__dirname + '/public/js/main.js');
})

app.get('/public/js/hotelInfo.js', function(req,res) {
    res.sendFile(__dirname + '/public/js/hotelInfo.js');
})

app.get('/public/js/hotelManagement.js', function(req,res) {
    res.sendFile(__dirname + '/public/js/hotelManagement.js');
})

app.get('/public/css/style.css', function(req,res) {
    res.sendFile(__dirname + '/public/css/style.css');
})

app.get('/loginGuest', function(req,res) {
    const result = pug.compileFile('templates/login.pug');
	res.status(200).send(result({role: 'Guest'}));
});

app.get('/loginEmployee', function(req,res) {
    const result = pug.compileFile('templates/login.pug');
	res.status(200).send(result({role: 'Employee'}));
});

app.get('/registerGuest', function(req,res) {
    const result = pug.compileFile('templates/register.pug');
	res.status(200).send(result({role: 'Guest'}));
})

app.get('/registerEmployee', function(req,res) {
    const result = pug.compileFile('templates/register.pug');
	res.status(200).send(result({role: 'Employee'}));
})

app.get('/hotels', async function(req, res){
	const result = pug.renderFile('templates/hotels.pug');
	res.status(200).send(result);
});

app.get('/logout', (req, res) => {
	req.session.employeeId = null;
	req.session.guestId = null;
	req.session.sessionType = 'offline';
	const result = pug.renderFile('templates/logout.pug')
	res.status(200).send(result);
});


app.post('/loginGuest', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	let {rows} = await pool.query('SELECT id_gosc FROM projekt.gosc WHERE email=$1 AND "haslo"=$2', [email, password]);
	let session = req.session;
	if(rows.length >= 1){
		session.sessionType = 'online';
		session.employeeId = null;
		session.guestId = rows[0].id_gosc;
		res.status(200).json(rows);
	}
	else{
		res.status(400).send({error: 'Podanego użytkownika nie ma w bazie'});
		session.sessionType = 'offline';
	}
});

app.post('/loginEmployee', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	let {rows} = await pool.query('SELECT id_pracownik FROM projekt.pracownik WHERE email=$1 AND "haslo"=$2', [email, password]);
	let session = req.session;
	if(rows.length >= 1){
		session.sessionType = 'online';
		session.guestId = null;
		session.employeeId = rows[0].id_pracownik;
		res.status(200).json(rows);
	}
	else{
		session.sessionType = 'offline';
		res.status(400).send({error: 'Podanego użytkownika nie ma w bazie'});
	}
});

app.post('/registerGuest', (req, res) => {
	const name = req.body.name;
	const lastName = req.body.lastName;
	const phone = req.body.phone;
	const email = req.body.email;
	const password = req.body.password;

	pool.query('insert into projekt.gosc ("imie", "nazwisko", "telefon", "email", "haslo", "pieniadze") values ($1, $2, $3, $4, $5, $6);', 
				[name, lastName, phone, email, password, 10000.00], error => {
	  if (error) {
		console.log(error.message);
		res.status(400).json({ status: 'failed', message: error.message });
	  } else {
		res.status(201).json({ status: 'success', message: 'Customer added.' });
	  }
	});
});

app.post('/registerEmployee', (req, res) => {
	const name = req.body.name;
	const lastName = req.body.lastName;
	const phone = req.body.phone;
	const email = req.body.email;
	const password = req.body.password;
	pool.query('insert into projekt.pracownik ("imie", "nazwisko", "telefon", "email", "haslo") values ($1, $2, $3, $4, $5);', 
				[name, lastName, phone, email, password], error => {
	if (error) {
		console.log(error.message);
		res.status(400).json({ status: 'failed', message: error.message });
	  } else {
		res.status(201).json({ status: 'success', message: 'Pomyślnie zarejestrowano' });
	  }
	});
});

app.post('/standards/:hotel_id/others', async function(req, res){
	try{
		let {rows} = await pool.query('select * from projekt.standard where' + 
		' id_standard not in (select id_standard from projekt.cennik where id_hotel=$1)', 
		[req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).json({error: err.message});
	}
});



module.exports = app;