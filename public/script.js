
//LEAFLET MAP SET UP//
const myMap = L.map("map").setView([29,31], 6);


const attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
const tile_url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tile_url, { attribution }); 
tiles.addTo(myMap);
//const api_url = "https://api.wheretheiss.at/v1/satellites/25544";


const interaction_div_dynasty = document.getElementById("dynasty");
const interaction_div_pharaoh = document.getElementById("pharaoh");

const pharaohList = [];
const dynastyList = [];

var currentDynasty;
var currentPharaoh;
const pyramid_icon = L.icon({
	iconUrl: 'map_icons/pyramid_icon.png',
	iconSize: [20, 20],
	iconAnchor: [10,10]
});

getmap();
getddl();
            
async function getmap(){
        const response = await fetch('/api');
                
        const data = await response.json();
       	for (item of data){
       		//variables in use
       		const tooltip_string = "<h2>"+
       		item.modernname+
       		"</h2> <p> Ancient Name: "+
       		item.ancientname+
       		"</p> <p> Pharaoh: "+
       		item.pharaoh+
       		"</p> <p> Dynasty: "+
       		item.dynasty+
       		"</p> <p> Location: "+
       		item.location+
       		"</p>";
       		
       		if(!dynastyList.includes(item.dynasty)){
       			dynastyList.push(item.dynasty);
       		} 
       		
       		if(!pharaohList.includes(item.pharaoh)){
       			pharaohList.push(item.pharaoh);
       		}
       		
       			
       		//Add each database entry to the map div//
       		const marker = L.marker(
       			[item.latitude, item.longitude], 	//LAT + LON
       			{icon: pyramid_icon}).bindTooltip(	//ICON
       					tooltip_string,			//TOOLTIP HTML
       					{direction: 'auto', 		//
       					permanent: false, 		//
       					sticky: false}).addTo(myMap);	//
       	}
        
        //marker.setLatLng([0, 0]); //TAKES LATITUDE AND LONGITUDE
        //document.getElementById("lat").textContent = latitude;
        //document.getElementById("lon").textContent = longitude;
	//console.log(data);
	dynastyList.sort(function(a,b){return a - b});
	pharaohList.sort();
	//Populate the drop down list here:
	dynastyList.forEach(function(item) {
		const dynastyOption = document.createElement("option");
		dynastyOption.textContent = item;
		//dynastyOption.setAttribute("class", "dynasty_ddl") //Class element used for finding unique values in the list
		dynastyOption.setAttribute("value", item);
		interaction_div_dynasty.append(dynastyOption);
	});
	
	pharaohList.forEach(function(item) {
		const pharaohOption = document.createElement("option");
		pharaohOption.textContent = item;
		pharaohOption.setAttribute("value", item);
		interaction_div_pharaoh.append(pharaohOption);
	});
}

function getddl(){
	console.log(dynastyList);
	
	//CHECKING FOR DUPLICATES//
       		/*console.log("Dynasties:");
       		console.log(dynastyList);
       		console.log("Pharaohs:");
       		console.log(pharaohList);*/ //test code
       		
       		
       		
       		//Check dynasty:
       		/*if(dynastyList.length == 0){
       			console.log("It gets here right?");
       			dynastyDuplicate = true;
       			const dynastyOption = document.createElement("option");
			dynastyOption.textContent = item.dynasty;
			dynastyOption.setAttribute("class", "dynasty_ddl") //Class element used for finding unique values in the list
			dynastyOption.setAttribute("value", item.dynasty);
			interaction_div_dynasty.append(dynastyOption);
       		} else {
       		dynastyList.forEach(function(dynasty) {
       			if(dynasty.getAttribute("value") === item.dynasty){
       				dynastyDuplicate = true;
       			}
       		});
       		}
       		
		//Check pharoah:
		if(pharaohList.length == 0){
			//console.log("What about here?");
			pharoahDuplucate = true; //avoids the next if for first entry
			const pharaohOption = document.createElement("option");
			pharaohOption.textContent = item.pharaoh;
			pharaohOption.setAttribute("class", "pharaoh_ddl"); //Class element used for finding unique values in the list
			pharaohOption.setAttribute("value", item.pharaoh);
			interaction_div_pharaoh.append(pharaohOption);	
		} else {
		pharaohList.forEach(function(pharaoh) {
			const pharaohname = pharaoh.getAttribute("value");
			//console.log(pharaohname); //TESSST CODE
			if((pharaohname === item.pharaoh) || (pharaohname.includes(item.pharaoh))){
				pharaohDuplicate = true;
				//console.log("Is this turning out true?");
			}
		});
		}
		//ADD OPTIONS IF NOT DUPLICATE
		if(dynastyDuplicate === false){
			const dynastyOption = document.createElement("option");
			dynastyOption.textContent = item.dynasty;
			dynastyOption.setAttribute("class", "dynasty_ddl") //Class element used for finding unique values in the list
			dynastyOption.setAttribute("value", item.dynasty);
			interaction_div_dynasty.append(dynastyOption);
		}
		
		if(pharaohDuplicate === false){
			const pharaohOption = document.createElement("option");
			pharaohOption.textContent = item.pharaoh;
			pharaohOption.setAttribute("class", "pharaoh_ddl"); //Class element used for finding unique values in the list
			pharaohOption.setAttribute("value", item.pharaoh);
			interaction_div_pharaoh.append(pharaohOption);
		}*/
}

