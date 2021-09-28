var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    console.log(data.features);
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

//create function that takes in the magnitude of the earth quake and returns a corresponding RGB color
function circlecolor (mag){
    if (mag >=8){
        return "rgb(240, 71, 34)"
    } else{
        if (mag>7){
            return "rgb(245, 146, 125)"
        }else {
            if (mag>6){
                return "rgb(237, 178, 166)"
            } else {
                if (mag>5.5){
                    return "rgb(240, 206, 199)"
                } else {
                    if (mag >2.5){
                        return "rgb(240, 206, 199)"
                    } else {
                        return "rgb(237, 227, 225)"
                    }
                }
            }
        }
    }
};

//create the function createFeatures 
function createFeatures(earthquakeData){
    var earthquakes =L.geoJSON(earthquakeData);
    //pass the earthquake data to create createMap function.
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: "pk.eyJ1IjoibWF4Y2xpZmY5IiwiYSI6ImNrdTMwMzg5MjFqZmEzMXM4NDdhMnplY2oifQ.SiYGPRWs2ZPATYF9BlKCAQ"
    });
  
   
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street
      
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        29.876019, -107.224121
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  }