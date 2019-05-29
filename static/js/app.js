/* UCSD Data Science Assignment: Visualizing Data with Leaflets 

Scott McEachern
May 28, 2019
*/

console.log("--> app.js");



//-- Globals
const LEGENDINFO = [
    {
        color: "#23A606",
        radius: 8,
        legend: "0-1"
    },
    {
        color: "#9FB004",
        radius: 12,
        legend: "1-2"
    },
    {
        color: "#B49B03",
        radius: 18,
        legend: "2-3"
    },
    {
        color: "#B77202",
        radius: 26,
        legend: "3-4"
    },
    {
        color: "#BB4701",
        radius: 36,
        legend: "4-5"
    },
    {
        color: "#BF1900",
        radius: 56,
        legend: "5+"
    },
];


function createBasemaps(){
    /* Creates the basemap layers for use with the map

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


function createPopupForEarthquake(sourceFeature, sourceLayer){
    /* Creates the HTML for the popup for the earthquake layer

    Accepts : sourceFeature (geoJson feature) feature to apply popup
              sourceLayer (layer) reference to the layer
    
    Returns : undefined
    */

    sourceLayer.bindPopup('<h6><a href="' + sourceFeature.properties.url + '" target="_blank">' + 
        sourceFeature.properties.place + "</a></h6>Magnitude: " + sourceFeature.properties.mag );
}


function createMarkerForEarthquake(sourceFeature, latlng){
    /* For each of the earthquakes features found in the geoJson, returns the marker symbol that is to be used
    based on the magnitude of the earthquake.  https://leafletjs.com/reference-1.5.0.html#circlemarker

    Accepts : sourceFeature (dictionary) geoJson feature to determine symbology for
              latlng (dictionary) contains location of feature
    
    Returns : (circleMarker) symbol information for the feature
    */


    //- Create Default SymbolInfo
    let symbolInfo = null;


    //- Determine Symbol based on Magnitude
    if (sourceFeature.properties.mag <= 1.0){
        symbolInfo = LEGENDINFO[0];
    }
    else if (sourceFeature.properties.mag <= 2.0){
        symbolInfo = LEGENDINFO[1];
    }
    else if (sourceFeature.properties.mag <= 3.0){
        symbolInfo = LEGENDINFO[2];
    }
    else if (sourceFeature.properties.mag <= 4.0){
        symbolInfo = LEGENDINFO[3];
    }
    else if (sourceFeature.properties.mag <= 5.0){
        symbolInfo = LEGENDINFO[4];
    }
    else
    {
        symbolInfo = LEGENDINFO[5];
    }


    //- Create Circle Symbol
    return L.circleMarker(latlng,
        {
            fillColor: symbolInfo.color,
            fillOpacity: 0.7,
            stroke: false,
            radius: symbolInfo.radius
        }
    );
}


function createLegend(sourceMap){
    /* Creates control that hosts the static legend information

    Accepts: sourceMap (map control) reference to the map control

    Returns : undefined
    */

    //- Create Legend Control
    let legendControl = L.control({
            position: "bottomright"
        });

    
    //- Create Content
    legendControl.onAdd = function(mapControl) {

        let legendDiv = L.DomUtil.create("div", "info legend");

        for (let counter = 0; counter < LEGENDINFO.length; counter++){
            legendDiv.innerHTML += '<i style="background:' + LEGENDINFO[counter].color + 
                '"></i>' + LEGENDINFO[counter].legend + '<br>';
        }

        return legendDiv;
    };


    //- Add Control to map
    legendControl.addTo(sourceMap);
}


//- Get Data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(sourceEarthquakes => {

    d3.json("static/data/PB2002_plates.json").then(sourcePlates => {
        
        console.log("-> Received data");


        //- Create Basemaps
        let basemaps = createBasemaps();

        //- Create Map Control
        let sourceMap = L.map("map", {
            center: [37.29809, -119.064497],
            zoom: 6,
            layers: [ basemaps.Light]
            });


        //- Overlay Layer: Plates
        let platesOverlayLayer = L.geoJSON(sourcePlates, 
            {style: createStyleForPlate}).addTo(sourceMap);


        //- Overlay Layer: Earthquake
        let earthquakeOverlayLayer = L.geoJSON(sourceEarthquakes,
            {pointToLayer: createMarkerForEarthquake,
            onEachFeature: createPopupForEarthquake}).addTo(sourceMap);
        
        let overlays = {
            "Tectonic Plates":  platesOverlayLayer,
            "Earthquakes": earthquakeOverlayLayer
        };

        
        //- Table of Contents
        L.control.layers(basemaps, overlays, {
                position: "topright",
                collapsed: false
            }).addTo(sourceMap);


        //- Create Legend
        createLegend(sourceMap);
    });    
});
