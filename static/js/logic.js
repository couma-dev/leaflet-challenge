var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    console.log(data.features[0]);
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

//create function that takes in the magnitude of the earth quake and returns a corresponding RGB color
function circlecolor (mag){
    if (mag >=5){
        return "rgb(214, 22, 9)"
    } else{
        if (mag>4){
            return "rgb(237, 144, 74)"
        }else {
            if (mag>3){
                return "rgb(237, 147, 12)"
            } else {
                if (mag>2){
                    return "rgb(207, 237, 12)"
                } else {
                    if (mag >1){
                        return "rgb(207, 237, 12)"
                    } else {
                        return "rgb(12, 237, 31)"
                    }
                }
            }
        }
    }
};

//create the function createFeatures 
function createFeatures(earthquakeData) {
    // Create popup layers using earthquake title, type and magnitude
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>" +
            "<p>Type: " + feature.properties.type + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>");
    }
    //Create circle markers for each earthquake in the data set.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Make circle radius dependent on the magnitude and get color based on the same feature
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag *4,
                fillOpacity: 1,
                color: circlecolor(feature.properties.mag)
            })
        },
        // Append popups on each feature
        onEachFeature: onEachFeature
    });
    // Call create map function using the earthquakes data
    createMap(earthquakes);
};

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 15,
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
      zoom: 4.5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    //add Legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            "rgb(12, 237, 31)",
            "rgb(207, 237, 12)",
            "rgb(207, 237, 12)",
            "rgb(237, 147, 12)",
            "rgb(237, 144, 74)",
            "rgb(214, 22, 9)"];
        var labels = [];

        var legendInfo = "<h1>Earthquake intensity<h1>" + 
            "<div class=\"labels\">" +
                "<div class=\"max\">5+</div>" +
                "<div class=\"fourth\">4-5</div>" +
                "<div class=\"third\">3-4</div>" +
                "<div class=\"second\">2-3</div>" +
                "<div class=\"first\">1-2</div>" +
                "<div class=\"min\">0-1</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        colors.forEach(function(color) {
            labels.push("<li style=\"background-color: " + color + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Append label to the map
    legend.addTo(myMap);

  
  }