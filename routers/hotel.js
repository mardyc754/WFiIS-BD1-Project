const pool = require('../connection').connect();
const express = require ("express");
const app = express();


app.post('/', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.opis_hotelu');
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});


app.post('/create', async function(req, res){
	try{
		let {rows} = await pool.query('select * from projekt.create_new_hotel($1,$2,$3,$4,$5)',
		[req.body.name, req.body.location, req.body.isElevator, req.body.website, req.body.employeeId]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).json({error: err.message});
	}
});

app.post('/:hotel_id', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.opis_hotelu where id_hotel=$1', 
		[req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});

app.post('/:hotel_id/rooms', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.opis_pokoi where id_hotel=$1', [req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});


app.post('/:hotel_id/rooms/:room_id', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.opis_pokoi where id_hotel=$1 AND id_pokoj=$2', 
		[req.params.hotel_id, req.params.room_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.json({error: err});
	}
});

app.post('/:hotel_id/rooms/:room_id/update', async function(req, res){
	try{
		let newStandard = req.body.newStandard;
		let {rows} = await pool.query('SELECT * from projekt.change_standard($1, $2, $3)', 
		[newStandard, req.params.room_id, req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		res.status(400).json({error: err.message});
	}
});


app.post('/:hotel_id/services', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.uslugi_w_hotelach where id_hotel=$1', 
		[req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});

app.post('/:hotel_id/services/:service_id/update', async function(req, res){
	try{
		let newPrice = parseFloat(req.body.newPrice);
		if(!newPrice){
			res.status(400).json({error: 'Zły typ danych'});
		}
		else{
			newPrice = newPrice.toFixed(2);
			let {rows} = await pool.query('UPDATE projekt.hotel_usluga SET cena=$1 where id_hotel=$2 and id_usluga=$3', 
			[newPrice, req.params.hotel_id, req.params.service_id]);
			res.status(200).json(rows);
		}
	} catch(err){
		res.status(500).json({error: err.message});
	}
});

app.post('/:hotel_id/rooms/:room_id', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.opis_pokoi where id_hotel=$1 AND id_pokoj=$2', 
		[req.params.hotel_id, req.params.room_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});

app.post('/:hotel_id/employees', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.pracownicy_w_hotelach where id_hotel=$1', 
		[req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});

app.post('/:hotel_id/employees/:employee_id/update', async function(req, res){
	try{
		let newSalary = parseFloat(req.body.newSalary);
		if(!newSalary){
			res.status(400).json({error: 'Zły typ danych'});
		}
		else{
			newSalary = newSalary.toFixed(2);
			let {rows} = await pool.query('UPDATE projekt.pracownik_hotel SET wynagrodzenie=$1 where id_hotel=$2 and id_pracownik=$3', 
			[newSalary, req.params.hotel_id, req.params.employee_id]);
			res.status(200).json(rows);
		}
	} catch(err){
		console.log(err.message);
		res.status(500).json({error: err.message});
	}
});


app.post('/:hotel_id/employees/:employee_id/delete', async function(req, res){
	try{
		let {rows} = await pool.query('DELETE from projekt.pracownik_hotel where id_hotel=$1 and id_pracownik=$2', 
		[req.params.hotel_id, req.params.employee_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(500).json({error: err.message});
	}
});

app.post('/:hotel_id/employees/:employee_id/removeManagement', async function(req, res){
	try{
		let {rows} = await pool.query('UPDATE projekt.pracownik_hotel set wlasciciel=false where id_hotel=$1 and id_pracownik=$2', 
		[req.params.hotel_id, req.params.employee_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).json({'error': err.message});
	}
});

app.post('/services/other', async function(req, res){
	try{
		let {rows} = await pool.query('select * from projekt.usluga where id_usluga not in (select id_usluga from projekt.hotel_usluga where id_hotel =$1)', 
		[req.body.hotelId]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
	}
});



app.post('/:hotel_id/addService', async function(req, res){
	try{
		let {rows} = await pool.query('INSERT into projekt.hotel_usluga values($1, $2, $3)', 
		[req.params.hotel_id, req.body.newServiceId, 10]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(409).json({error: err.message});
	}
});

app.post('/:hotel_id/addStandard', async function(req, res){
	try{
		let {rows} = await pool.query('INSERT into projekt.cennik values($1, $2, $3)', 
		[req.params.hotel_id, req.body.newStandardId, 50]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).json({error: err.message});
	}
});

app.post('/:hotel_id/addRoom', async function(req, res){
	try{
		let {rows} = await pool.query('insert into projekt.pokoj (id_hotel, pietro, id_standard) values ($1, $2, $3)', 
		[req.body.hotelId, req.body.floor, req.body.standardId]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).json({error: err.message});
	}
});

app.post('/:hotel_id/employees/:employee_id/makeManager', async function(req, res){
	try{
		let {rows} = await pool.query('UPDATE projekt.pracownik_hotel set wlasciciel=true where id_hotel=$1 and id_pracownik=$2', 
		[req.params.hotel_id, req.params.employee_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(500).json({error: err.message});
	}
});

app.post('/:hotel_id/standards', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT * from projekt.standardy_w_hotelach where id_hotel=$1', 
		[req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(500).json({error: err.message});
	}
});

app.post('/:hotel_id/standards/:standard_id/update', async function(req, res){
	try{
		let newPrice = parseFloat(req.body.newPrice);
		if(!newPrice){
			res.status(400).json({error: 'Zły typ danych'});
		}
		else{
			newPrice = newPrice.toFixed(2);
			let {rows} = await pool.query('UPDATE projekt.cennik SET cena=$1 where id_hotel=$2 and id_standard=$3', 
			[newPrice, req.params.hotel_id, req.params.standard_id]);
			res.status(200).json(rows);
		}
	} catch(err){
		res.status(500).json({error: 'Coś poszło nie tak'});
		console.log(err.message);
	}
});

app.post('/:hotel_id/reservations', async function(req, res){
	try{
		let {rows} = await pool.query('SELECT DISTINCT id_hotel, id_pokoj, id_rezerwacja,' +
		' data_rozpoczecia, data_zakonczenia, status, id_status from projekt.rezerwacje_pokoi where id_hotel=$1', 
		[req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(500).json({error: err.message});
	}
});

app.post('/:hotel_id/reservations/:reservation_id/update', async function(req, res){
	try{
		const newStatus = req.body.newStatus;
		let {rows} = await pool.query('UPDATE projekt.rezerwacja set id_status=$1 where id_rezerwacja=$2',
		[newStatus, req.params.reservation_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).json({error: err.message});
	}
});


app.post('/:hotel_id/addEmployee', async function(req, res){
	try{
		let newEmployeeId = req.body.newEmployeeId;
		let {rows} = await pool.query('INSERT into projekt.pracownik_hotel values($1, $2, $3, $4)', 
		[newEmployeeId, 2000.00, false, req.params.hotel_id]);
		res.status(200).json(rows);
	} catch(err){
		console.log(err.message);
		res.status(400).json({error: err.message});
	}
});

module.exports = app;