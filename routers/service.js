const pool = require('../connection').connect();
const express = require ("express");
const app = express();


app.post('/:hotel_id', async function(req, res){
	try{
		let {rows} = await pool.query('select * from projekt.uslugi_w_hotelach where id_hotel=$1', 
		[req.params.hotel_id]);
		if(rows){
			res.status(200).json(rows);
		}
	} catch(err){
		console.log(err.message);
		res.status(400).json({error: err.message});
	}
});

app.post('/:hotel_id/:service_id', async function(req, res){
	try{
		let {rows} = await pool.query('select * from projekt.uslugi_w_hotelach where id_hotel=$1 and id_usluga=$2', 
		[req.params.hotel_id, req.params.service_id]);
		if(rows){
			res.status(200).json(rows);
		}
	} catch(err){
		console.log(err.message);
		res.status(400).json({error: err.message});
	}
});

module.exports = app;