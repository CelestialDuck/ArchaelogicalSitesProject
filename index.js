const express = require('express');
const Datastore = require('nedb');
const CSVToJSON = require('csvtojson');
const FileSystem = require('fs');

const app = express();

app.listen(3000, () => console.log("Listening to server, PORT: 3000"));
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
			'pharoah': item.Pharoah,
			'ancientname': item.AncientName,
			'modernname': item.ModernName,
			'dynasty': item.Dynasty,
			'location': item.Site
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


