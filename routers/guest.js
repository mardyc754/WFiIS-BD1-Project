const pool = require('../connection').connect();
const express = require ("express");
const app = express();
const pug = require('pug');

app.get('/', function(req,res) {
	const guestId = req.session.guestId;
	if(guestId){
    	const result = pug.renderFile('templates/guest.pug', {guestId});
		res.status(200).send(result);
	}
	else{
		res.status(401).send('401: Nieautoryzowany dostęp');
	}
})

app.get('/makeReservation', function(req,res) {
	const guestId = req.session.guestId;
    const result = pug.renderFile('templates/reservation.pug', {guestId});
	res.status(200).send(result);
});


app.post('/reservations/:id', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT id_pokoj, id_rezerwacja, data_rozpoczecia, ' 
		+ 'data_zakonczenia, status FROM projekt.rezerwacje_pokoi WHERE id_gosc=$1', [req.params.id]);
		res.status(200).json(rows);
	} catch(err){
		return res.status(400).json({ status: error, message: err });
	}
})

app.post('/makeReservation', async function(req,res) {
	try{
		let {rows} = await pool.query('SELECT * from projekt.make_reservation($1, $2, $3, $4)', 
		[req.body.startDate, req.body.endDate, req.body.roomId, req.body.guestId]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).send({error: err.message})
	}
})

app.post('/services', async function(req,res) {
	try{
		let {rows} = await pool.query('select distinct id_hotel, nazwa_hotelu, id_usluga, nazwa as nazwa_uslugi, cena from ' +
			' projekt.rezerwacje_pokoi natural join projekt.hotel_usluga ' +
			' natural join projekt.usluga u where id_gosc = $1', 
		[req.body.guestId]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).send({error: err.message})
	}
})

app.post('/services/buy', async function(req,res) {
	try{
		let {rows} = await pool.query('update projekt.gosc set pieniadze=pieniadze-$1 where id_gosc=$2', 
		[req.body.price, req.body.guestId]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).send({error: err.message})
	}
});

app.post('/info', async (req, res) => {
	const guestId = req.session.guestId;
	let {rows} = await pool.query('SELECT * FROM projekt.gosc WHERE "id_gosc"=$1', [guestId]);
	res.status(200).json(rows);
});

module.exports = app;