//LEAFLET MAP SET UP//
const myMap = L.map("map").setView([29,31], 6);


const attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
const tile_url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tile_url, { attribution }); 
tiles.addTo(myMap);

//Layer groups to store high lights
const rectangles = L.layerGroup([], { attribution }).addTo(myMap);
const option_highlights = L.layerGroup([], { attribution }).addTo(myMap);

//DOM ELEMENTS IN USE
const interaction_div_dynasty = document.getElementById("dynasty");
const interaction_div_pharaoh = document.getElementById("pharaoh");

const information_div = document.getElementById("info");
const information_div_gen = document.getElementById("information_general");
const information_div_img = document.getElementById("information_image");
const information_div_sts = document.getElementById("information_stats");

const pharaohList = [];
const dynastyList = [];

const main = document.querySelector(".mainpage");
const load = document.querySelector(".loadpage");

//Pyramid Icon
const pyramid_icon = L.icon({
	iconUrl: 'map_icons/pyramid_icon.png',
	iconSize: [20, 20],
	iconAnchor: [10,10]
});

//Event Listeners
interaction_div_dynasty.addEventListener("change", dynastyChange);
interaction_div_pharaoh.addEventListener("change", pharaohChange);


//Function: init()
//Replaces loading screen
function init(){
	setTimeout(() => {
		load.style.opacity = 0;
		load.style.display = "none";
		
		
		main.style.display = "block";
		setTimeout(() => {
			main.style.opacity = 1
			}, 50);
		}, 5000);
	myMap.invalidateSize();
}




//Function: getmap() | Async
//Receives data directly from the server, data is used to populate the map.
async function getmap(){
        const response = await fetch('/api');
        const data = await response.json();
       	for (item of data){
       		//Tooltip string for map marker.
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
       		
       		//FOR : INFORMATION GENERAL
       		const info_gen_string = "Name: " + item.modernname + " | Pharaoh: " +item.pharaoh+ " | Dynasty: " +
					item.dynasty + " | Location: " + item.location + " | Material: " + item.mat;
					
       		// FOR: INFORMATION IMAGE
       		let pyramid_image = "";
       		
       		if (item.type == "Step"){
       			pyramid_image = "map_icons/step.png";
       		} else if (item.type == "Smooth-sided") {
       			pyramid_image = "map_icons/rough.png";
       		} else if (item.type == "Smooth-faced") {
       			pyramid_image = "map_icons/smooth.png";
       		} else {
       			pyramid_image = "map_icons/none.png";
       		}
       		
       		//FOR: INFORMATION STATS
       		
       		const info_sts_string = "Length: " + item.length + "m | Width: " + item.width + "m | Height: " + item.height + "m";
       		const info_sts_stringtwo = "Slope: "+item.slope+"° | Volume: "+item.volume+"m³";
       		
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
       		//Mouseover and mouse out events, used to populate the Information div.
		marker.on('mouseover', function(event){
			const info_gen = document.createElement("div");
			info_gen.textContent = info_gen_string;
			info_gen.setAttribute('id', "temp_info");
			information_div_gen.append(info_gen);			
			
			const info_img = document.createElement('img');
			info_img.setAttribute('src', pyramid_image);
			info_img.setAttribute('id', "temp_image");
			information_div_img.append(info_img);
			
			const info_sts = document.createElement("p");
			info_sts.textContent = info_sts_string;
			info_sts.setAttribute('id', "temp_stats");
			information_div_sts.append(info_sts);
			
			const info_sts_two = document.createElement("p");
			info_sts_two.textContent = info_sts_stringtwo;
			info_sts_two.setAttribute('id', "temp_stats_two");
			information_div_sts.append(info_sts_two);
			
			//Highlight
			const highlight = L.rectangle(rectangle_points, {color: "#dc143c", weight:1.0});
			rectangles.addLayer(highlight);
			
			
		});
		marker.on('mouseout', function(event){
			const info_gen = document.getElementById("temp_info");
			const info_img = document.getElementById("temp_image");
			const info_sts = document.getElementById("temp_stats");
			const info_sts_two = document.getElementById("temp_stats_two");
			info_gen.remove();
			info_img.remove();
			info_sts.remove();
			info_sts_two.remove();
			rectangles.clearLayers();
		});
		
       	}
        
        //Sorting the pharaoh and dynasty so no value is repeated. Once sorted, drop down lists are populated.
	dynastyList.sort(function(a,b){return a - b});
	pharaohList.sort();
	//Populate the drop down list here:
	dynastyList.forEach(function(item) {
		const dynastyOption = document.createElement("option");
		dynastyOption.textContent = item;
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

//Functions: dynastyChange() and pharaohChange()
//Both functions will query through the dynasties or pharaoh's based on the users selected value.
//Once all map elements have been found, highlights are appended to the map for each.
async function dynastyChange(){
	const select = document.getElementById("dynasty");
	const dynasty = select.options[select.selectedIndex].value;
	
	const other_select = document.getElementById("pharaoh");
	if(pharaoh == "All"){
		option_highlights.clearLayers();
		resetddl(other_select);
		return;
	}
	
	option_highlights.clearLayers();
	resetddl(other_select);
	
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
            		
       		const first_highlight = [[lat + 0.3, long - 0.3] , [lat - 0.3, long + 0.3]];	//First Highlight
       		const second_highlight = [[lat + 0.01, long - 0.01] , [lat - 0.01, long + 0.01]]; //Second Highlight
       		const third_highlight = [[lat + 0.003, long - 0.003] , [lat - 0.003, long + 0.003]]; //Third Highlight
       		const highlight_layer_one = L.rectangle(first_highlight, {color: "#016064", weight:3.0, fill: false}); //Ocean
       		const highlight_layer_two = L.rectangle(second_highlight, {color: "#2832C2", weight:2.0, fill: false}); //Cobalt
       		const highlight_layer_three = L.rectangle(third_highlight, {color: "#82EEFD", weight:1.0}); //Arctic
		option_highlights.addLayer(highlight_layer_one);
		option_highlights.addLayer(highlight_layer_two);
		option_highlights.addLayer(highlight_layer_three);
	}
}

async function pharaohChange(){
	const select = document.getElementById("pharaoh");
	const pharaoh = select.options[select.selectedIndex].value;
	const other_select = document.getElementById("dynasty");
	if(pharaoh == "All"){
		option_highlights.clearLayers();
		resetddl(other_select);
		return;
	}
	
	option_highlights.clearLayers();
	resetddl(other_select);
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
       		
       		const first_highlight = [[lat + 0.3, long - 0.3] , [lat - 0.3, long + 0.3]];	//First Highlight
       		const second_highlight = [[lat + 0.01, long - 0.01] , [lat - 0.01, long + 0.01]]; //Second Highlight
       		const third_highlight = [[lat + 0.003, long - 0.003] , [lat - 0.003, long + 0.003]]; //Third Highlight
       		const highlight_layer_one = L.rectangle(first_highlight, {color: "#016064", weight:3.0, fill:false}); //Ocean
       		const highlight_layer_two = L.rectangle(second_highlight, {color: "#2832C2", weight:2.0, fill:false}); //Cobalt
       		const highlight_layer_three = L.rectangle(third_highlight, {color: "#82EEFD", weight:1.0}); //Arctic
		option_highlights.addLayer(highlight_layer_one);
		option_highlights.addLayer(highlight_layer_two);
		option_highlights.addLayer(highlight_layer_three);
	}
}

//Function: resetddl()
//Params: select_option: Takes the selected option on the drop down menu from the interaction div
//Simply for resetting the other drop down menu if it has a selected value
function resetddl(select_option){
	select_option.selectedIndex = 0;
	return;
}


//Application starts here: 
getmap();
init();
