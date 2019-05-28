/* UCSD Data Science Assignment: Visualizing Data with Leaflets 

Scott McEachern
May 28, 2019
*/

console.log("--> app.js");


// basemaps

// operational layers



function createBasemaps(){
    /*

    Accepts : nothing

    Returns : (dictionary) key is the name for table of contents control, value basemap object for map
                "Satelite": 
                "Grayscale":
                "Outdoors"
    */

    console.log("-> createBasemaps");


    //- Light Grey
    let lightBasemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
       });
    
    //- Satellite
    let satelliteBasemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
       });

    //- Outdoor
    let outdoorsBasemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
       });
    
    return {
        Light: lightBasemap,
        Satellite: satelliteBasemap,
        Outdoors: outdoorsBasemap
    }
}






//--------- TESTING

let basemaps = createBasemaps();

let overlays = {};

let sourceMap = L.map("map", {
    center: [37.29809, -97.387701],
    zoom: 4,
    layers: [ basemaps.Outdoors]
   
    });

//- Table of Contents
L.control.layers(basemaps, overlays).addTo(sourceMap);


// L.control.layers()