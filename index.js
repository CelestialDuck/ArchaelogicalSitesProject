const express = require('express');
const Datastore = require('nedb');
const CSVToJSON = require('csvtojson');
const FileSystem = require('fs');

const app = express();

var PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Listening to server, PORT: 3000"));
app.use(express.static('public'));
app.use(express.json());

FileSystem.unlinkSync('database.db');

const database = new Datastore('database.db');
database.loadDatabase();

CSVToJSON().fromFile('data/pyramids.csv').then(response => {
	//console.log(Object.keys(response).length);
	for(item of response){
		const entry = {
			'latitude': item.Latitude, 
			'longitude' : item.Longitude,
			'pharaoh': item.Pharaoh,
			'ancientname': item.AncientName,
			'modernname': item.ModernName,
			'dynasty': item.Dynasty,
			'location': item.Site,
			'type': item.Type,
			'mat': item.Material,
			'length': item.Base1,
			'width': item.Base2,
			'height': item.Height,
			'slope': item.Slope,
			'volume': item.Volume
	};
		//console.log(entry);
		database.insert(entry);
	}	
});


app.get('/api', (request, response) => {
	database.find({}, (err, data) => {
		if(err){
			response.end();
			return;
		}
		response.json(data);
	});
});

app.post('/pharaohs', (request, response) => {
	const select = request.body;
	database.find({pharaoh: select.pharaoh}, (err, data) => {
		if(err){
			response.end();
			return;
		}
		response.json(data);
	});
});

app.post('/dynasties', (request, response) => {
	const select = request.body;
	database.find({dynasty: select.dynasty}, (err, data) => {
		if(err){
			response.end();
			return;
		}
		response.json(data);
	});
});



