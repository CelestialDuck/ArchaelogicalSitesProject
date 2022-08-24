//LEAFLET MAP SET UP//
const myMap = L.map("map").setView([29,31], 6);


const attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
const tile_url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tile_url, { attribution }); 
tiles.addTo(myMap);

//Layer groups to store high lights
const rectangles = L.layerGroup([], { attribution }).addTo(myMap);
const option_highlights = L.layerGroup([], { attribution }).addTo(myMap);

const interaction_div_dynasty = document.getElementById("dynasty");
const interaction_div_pharaoh = document.getElementById("pharaoh");

const information_div =  document.getElementById("info");

const pharaohList = [];
const dynastyList = [];


const pyramid_icon = L.icon({
	iconUrl: 'map_icons/pyramid_icon.png',
	iconSize: [20, 20],
	iconAnchor: [10,10]
});


getmap();
getddl();

interaction_div_dynasty.addEventListener("change", dynastyChange);
interaction_div_pharaoh.addEventListener("change", pharaohChange);

async function getmap(){
        const response = await fetch('/api');
        const data = await response.json();
       	for (item of data){
       		const information_string = "LOREM IPSUM TEXT";
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
       		
       		const long = parseFloat(item.longitude);
       		const lat = parseFloat(item.latitude);
       		
       		const rectangle_points = [[lat + 0.25, long - 0.25] , [lat - 0.25, long + 0.25]];
       		
       		if(!dynastyList.includes(item.dynasty)){
       			dynastyList.push(item.dynasty);
       		} 
       		
       		if(!pharaohList.includes(item.pharaoh)){
       			pharaohList.push(item.pharaoh);
       		}
       		
       		//Add each database entry to the map div//
       		const marker = L.marker(
       			[item.latitude, item.longitude], 	//LAT + LON
       			{
       			icon: pyramid_icon,
			opacity: 1.0       			
       			}).bindTooltip(	//ICON
       					tooltip_string,			//TOOLTIP HTML
       					{direction: 'auto', 		//
       					permanent: false, 		//
       					sticky: false}).addTo(myMap);	//
       		
       		//INFORMATION TOGGLE		
		marker.on('mouseover', function(event){
			const info_html = document.createElement("div");
			info_html.textContent = information_string;
			info_html.setAttribute("id", "temporary_string");
			information_div.append(info_html);
			//Highlight
			const highlight = L.rectangle(rectangle_points, {color: "#dc143c", weight:1.0});
			rectangles.addLayer(highlight);
			
		});
		marker.on('mouseout', function(event){
			const info_html = document.getElementById("temporary_string");
			info_html.remove();
			
			//Highlight
			rectangles.clearLayers();
		});
		
		//RECTANGLE HIGH LIGHT TOGGLE
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

async function dynastyChange(){
	const select = document.getElementById("dynasty");
	const dynasty = select.options[select.selectedIndex].value;
	
	
	option_highlights.clearLayers();
	resetddl();
	const data = {dynasty};
	//console.log("Test here:");
	//console.log(JSON.stringify(data));
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	};
	
	const response = await fetch('/dynasties', options);
	const json_data = await response.json();
	
	for (item of json_data){
		const long = parseFloat(item.longitude);
       		const lat = parseFloat(item.latitude);
            		
       		const highlight_points = [[lat + 0.3, long - 0.3] , [lat - 0.3, long + 0.3]];
       		const closer_highlight = [[lat + 0.009, long - 0.009] , [lat - 0.009, long + 0.009]];
       		const highlight = L.rectangle(highlight_points, {color: "#1100BB", weight:1.0});
       		const highlight_two = L.rectangle(closer_highlight, {color: "#AEF359", weight:1.0});
		option_highlights.addLayer(highlight);
		option_highlights.addLayer(highlight_two);
	}
}

async function pharaohChange(){
	const select = document.getElementById("pharaoh");
	const pharaoh = select.options[select.selectedIndex].value;
	
	
	option_highlights.clearLayers();
	resetddl();
	const data = {pharaoh};
	//console.log("Test here:");
	//console.log(JSON.stringify(data));
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	};
	
	const response = await fetch('/pharaohs', options);
	const json_data = await response.json();
	
	for (item of json_data){
		const long = parseFloat(item.longitude);
       		const lat = parseFloat(item.latitude);
       		
       		const highlight_points = [[lat + 0.3, long - 0.3] , [lat - 0.3, long + 0.3]];
       		const closer_highlight = [[lat + 0.009, long - 0.009] , [lat - 0.009, long + 0.009]];
       		const highlight = L.rectangle(highlight_points, {color: "#1100BB", weight:1.0});
       		const highlight_closer = L.rectangle(closer_highlight, {color: "#AEF349", weight:1.0});
		option_highlights.addLayer(highlight);
		option_highlights.addLayer(closer_highlight);
	}
}

//
function resetddl(){

}

function getddl(){
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

