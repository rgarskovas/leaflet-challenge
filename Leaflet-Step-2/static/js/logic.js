


// create the tile layer of the map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v10",
  accessToken: API_KEY
});




// Initialize all of the LayerGroups we'll be using
var layers = {
  EARTHQUAKES: new L.LayerGroup(),
  TECTONIC_PLATES: new L.LayerGroup(),
};


// Create a map object
var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3
});



// Add our 'lightmap' tile layer to the map
lightmap.addTo(myMap);


// Create an overlays object to add to the layer control
var overlays = {
  "Earthquakes": layers.EARTHQUAKES,
  "Tectonic Plates": layers.TECTONIC_PLATES
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(myMap);


// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";



// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// Insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};

// Add the info legend to the map
info.addTo(myMap);



// Assemble API query URL
var url = baseURL;

// Grab the data with d3
d3.json(url, function(response) {



  // Loop through the earthquake array and create one marker for each earthquake object
  for (var i = 0; i < response.features.length; i++) {


  // convert magnitude to a float
  var magnitude = parseFloat(response.features[i].properties.mag)


    // Conditionals for magnitude size
    var color = "";
    if (magnitude > 5) {
      color = "#800026";
    }
    else if (magnitude > 4) {
      color = "#BD0026";
    }
    else if (magnitude > 3) {
      color = "#E31A1C";
    }
    else if (magnitude > 2) {
      color = "#FC4E2A";
    }
    else if (magnitude > 1) {
      color = "#FD8D3C";
    }
    else {
      color = "#FEB24C";
    }


    // drop last number on coordinates
    var coordinates = response.features[i].geometry.coordinates
    coordinates.pop()

    // create variables for latitude and longitude
    var latitude = response.features[i].geometry.coordinates[0]
    var longitude = response.features[i].geometry.coordinates[1]

    // store the new coordinates in coordinates
    var coordinates = [];
    coordinates.push(longitude)
    coordinates.push(latitude)

    // multiply magnitude to make radius
    radius_size = magnitude * 30000



    
    // Add circles to map
    L.circle(coordinates, {
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      // Adjust radius
      radius: radius_size
      // add the pop-up info
    }).bindPopup(
      "Magnitude: "
        + response.features[i].properties.mag
        + "<br>"
        + response.features[i].geometry.coordinates[0]
        + "<br>"
        + response.features[i].geometry.coordinates[1]
        + "<br>Place: "
        + response.features[i].geometry.coordinates[1]
        + "<br>Place: "
        + response.features[i].properties.place).addTo(layers["EARTHQUAKES"]);


      }})

      // Update the legend's innerHTML with the magnitude and colors
      document.querySelector(".legend").innerHTML = [
        '<ul class="legend">',
        "<li> Magnitude of earthquake: " + "</li>" + "<br>",
        "<li><span class='fiveormore'></span> 5+" + "</li>" + "<br>",
        "<li><span class='fourtofive'></span> 4-5" + "</li>" + "<br>",
        "<li><span class='threetofour'></span> 3-4" + "</li>" + "<br>",
        "<li><span class='twotothree'></span> 2-3" + "</li>" + "<br>",
        "<li><span class='onetotwo'></span> 1-2" + "</li>" + "<br>",
        "<li><span class='lessthanone'></span> 0-1" + "</li>" + "<br>",
      ].join("");