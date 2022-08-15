
console.log("Anything runnig here?");
const myMap = L.map("map").setView([29,31], 6);

      		
const attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
const tile_url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tile_url, { attribution }); 
tiles.addTo(myMap);
//const api_url = "https://api.wheretheiss.at/v1/satellites/25544";

const interaction_div_dynasty = document.getElementById("dynasty");
const interaction_div_pharaoh = document.getElementById("pharaoh");

const pyramid_icon = L.icon({
	iconUrl: 'map_icons/pyramid_icon.png',
	iconSize: [20, 20],
	iconAnchor: [10,10]
});

getmap();

            
async function getmap(){
        const response = await fetch('/api');
                
        const data = await response.json();
       	for (item of data){
       	
       		//variables in use
       		let dynastyDuplicate = false;
       		let pharaohDuplicate = false;
   
       		const dynastyList = document.querySelectorAll(".dynasty_ddl");
       		const pharaohList = document.querySelectorAll(".pharaoh_dll");
       		
       		console.log("How many times does this loop?");
       		
       		
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
       		
       		
       		const marker = L.marker(
       			[item.latitude, item.longitude], 	//LAT + LON
       			{icon: pyramid_icon}).bindTooltip(	//ICON
       					tooltip_string,			//TOOLTIP HTML
       					{direction: 'auto', 		//
       					permanent: false, 		//
       					sticky: false}).addTo(myMap);	//
       		
       		//CHECK FOR DUPLICATES
       		dynastyList.forEach(function(dynasty) {
       			if(dynasty.getAttribute("value") == item.dynasty){
       				dynastyDuplicate = true;
       			}
       		});
       		
		
		pharaohList.forEach(function(pharaoh) {
			if(pharaoh.getAttribute("value") == item.pharaoh){
				pharaohDuplicate = true;
			}
		});
		
		//ADD OPTIONS IF NOT DUPLICATE
		if(dynastyDuplicate == false){
			const dynastyOption = document.createElement("option");
			dynastyOption.textContent = item.dynasty;
			dynastyOption.setAttribute("class", "dynasty_ddl") //Class element used for finding unique values in the list
			dynastyOption.setAttribute("value", item.dynasty);
			interaction_div_dynasty.append(dynastyOption);
		}
		
		if(pharaohDuplicate == false){
			const pharaohOption = document.createElement("option");
			pharaohOption.textContent = item.pharaoh;
			pharaohOption.setAttribute("class", "phaoroah_dll"); //Class element used for finding unique values in the list
			pharaohOption.setAttribute("value", item.pharaoh);
			interaction_div_pharaoh.append(pharaohOption);
		}
       	}
        
        //marker.setLatLng([0, 0]); //TAKES LATITUDE AND LONGITUDE
        //document.getElementById("lat").textContent = latitude;
        //document.getElementById("lon").textContent = longitude;
	//console.log(data);
}

