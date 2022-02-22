const pool = require('../connection').connect();
const express = require ("express");
const app = express();
const pug = require('pug');

app.get('/', function(req,res) {
	const employeeId = req.session.employeeId;
	if(employeeId){
    	const result = pug.renderFile('templates/employee.pug', {employeeId});
		res.status(200).send(result);
	}
	else{
		res.status(401).send('401: Nieautoryzowany dostęp');
	}
});

app.post('/info', async (req, res) => {
	const employeeId = req.session.employeeId;
	let {rows} = await pool.query('SELECT * FROM projekt.pracownik WHERE "id_pracownik"=$1', [employeeId]);
	res.status(200).json(rows);
});


app.post('/:id/hotels', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.opis_hotelu where id_pracownik=$1', 
		[req.params.id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});

app.get('/hotels', async function(req, res){
	let session = req.session;
	result = pug.compileFile('templates/management.pug');
	res.status(200).send(result({sessionType: session.sessionType,
								employeeId: session.employeeId}));
});

app.post('/salaries', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.pracownicy_w_hotelach where id_pracownik=$1', 
		[req.body.employeeId]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});

app.post('/:hotel_id/others', async function(req, res){
	try{
		let {rows} = await pool.query('select * from projekt.pracownik where' + 
		' id_pracownik not in (select id_pracownik from projekt.pracownik_hotel where id_hotel=$1)', 
		[req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(500).json({error: err.message});
	}
});

module.exports = app;