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


//outdoors
//pencil, comic, dark



//--------- TESTING

// let basemaps = createBasemaps();

// let overlays = {};

// let sourceMap = L.map("map", {
//     center: [37.29809, -97.387701],
//     zoom: 4,
//     layers: [ basemaps.Outdoors]
   
//     });


// //- Table of Contents
// L.control.layers(basemaps, overlays).addTo(sourceMap);


function createStyleForPlate(){
    /* Creates the style used for the plates; properties: https://leafletjs.com/reference-1.5.0.html#path-stroke

    Accepts : nothing

    Returns : (pathOptions) used to style GeoJSON lines and polygons
    */

    return {
        stroke: true,
        color: '#ff8000',
        weight: 5,
        opacity: 1.0,
        fill: false
    };
}

function createMarkerForEarthquake(sourceFeature, latlng){
    /* For each of the earthquakes features found in the geoJson, returns the marker symbol that is to be used
    based on the magnitude of the earthquake.  https://leafletjs.com/reference-1.5.0.html#circlemarker

    Accepts : sourceFeature (dictionary) geoJson feature to determine symbology for
              latlng (dictionary) contains location of feature
    
    Returns : (circleMarker) symbol information for the feature
    */


    // console.log(sourceFeature.properties.mag);

    // console.log(latlng);


    //- Create Default SymbolInfo
    symbolInfo = {
        "color": "#BF1900",
        "radius": 56
    };


    if (sourceFeature.properties.mag <= 1.0){
        symbolInfo.color = "#23A606";
        symbolInfo.radius = 8;
    }
    else if (sourceFeature.properties.mag <= 2.0){
        symbolInfo.color = "#9FB004";
        symbolInfo.radius = 12;
    }
    else if (sourceFeature.properties.mag <= 3.0){
        symbolInfo.color = "#B49B03";
        symbolInfo.radius = 18;
    }
    else if (sourceFeature.properties.mag <= 4.0){
        symbolInfo.color = "#B77202";
        symbolInfo.radius = 26;
    }
    else if (sourceFeature.properties.mag <= 5.0){
        symbolInfo.color = "#BB4701";
        symbolInfo.radius = 36;
    }


    return L.circleMarker(latlng,
        {
            fillColor: symbolInfo.color,
            fillOpacity: 0.7,
            stroke: false,
            radius: symbolInfo.radius
        }
    );
}

//https://cartographicperspectives.org/index.php/journal/article/view/cp76-donohue-et-al/1307
//circle marker
//pointToLayer


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(sourceEarthquakes => {

    d3.json("static/data/PB2002_plates.json").then(sourcePlates => {
        console.log("got the plates");

        console.log(sourcePlates);
        console.log(sourceEarthquakes);


        let basemaps = createBasemaps();

        

        let sourceMap = L.map("map", {
            center: [37.29809, -97.387701],
            zoom: 9,
            layers: [ basemaps.Outdoors]
        
            });


        //- Plates
        let platesOverlayLayer = L.geoJSON(sourcePlates, 
            {style: createStyleForPlate}).addTo(sourceMap);


        //- Earthquake
        let earthquakeOverlayLayer = L.geoJSON(sourceEarthquakes,
            {pointToLayer: createMarkerForEarthquake}).addTo(sourceMap);
        
        let overlays = {
            "Plates":  platesOverlayLayer,
            "Earthquakes": earthquakeOverlayLayer
        };

        


        //- Table of Contents
        L.control.layers(basemaps, overlays).addTo(sourceMap);

    });    
});
