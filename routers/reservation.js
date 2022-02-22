const pool = require('../connection').connect();
const express = require ("express");
const app = express();

app.post('/:reservation_id/delete', async function(req, res){
	try{
		let {rows} = await pool.query('DELETE from projekt.rezerwacja where id_rezerwacja=$1',
		[req.params.reservation_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(500).json({error: err.message});
	}
});


app.post('/:guest_id', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.rezerwacje_pokoi where id_gosc=$1', 
		[req.params.guest_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).send({error: err.message})
	}
});

module.exports = app;