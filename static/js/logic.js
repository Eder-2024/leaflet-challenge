// Create the 'basemap' tile layer that will be the default background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "© OpenStreetMap contributors",
  detectRetina: true
});

// OPTIONAL: Step 2
// Create the 'streets' tile layer as an alternative background for the map.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors, HOT'
});

// Create a layer group for earthquake markers.
let earthquakes = new L.LayerGroup();

// Create a layer group for tectonic plate boundaries.
let tectonicPlates = new L.LayerGroup();

// Initialize the map object with center and zoom options.
let map = L.map("map", {
  center: [20, 0], // Centered near the equator for a global view.
  zoom: 2,         // Initial zoom level.
  layers: [basemap, earthquakes] // Default layers visible on load.
});

// OPTIONAL: Step 2
// Create an additional dark mode tile layer for night-time visualization.
let dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
});

// Organizing base maps to provide different styles for users to toggle between.
let baseMaps = {
  "Basemap": basemap,
  "Streets": streets,
  "Dark Mode": dark
};

// Organizing overlay layers that display dynamic data.
let overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

// Add a layer control to allow users to switch between base maps and overlays.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false // Keep control expanded for ease of access.
}).addTo(map);

// Fetch and display earthquake data from the USGS GeoJSON feed.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // Function to style each earthquake marker based on its properties.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.8,
      fillColor: getColor(feature.geometry.coordinates[2]), // Color based on earthquake depth.
      color: "#000000",
      radius: getRadius(feature.properties.mag), // Size based on magnitude.
      stroke: true,
      weight: 0.5
    };
  }

  // Function to determine marker color based on earthquake depth.
  function getColor(depth) {
    return depth > 90 ? "#d73027" :
           depth > 70 ? "#fc8d59" :
           depth > 50 ? "#fee08b" :
           depth > 30 ? "#d9ef8b" :
           depth > 10 ? "#91cf60" :
                        "#1a9850";
  }

  // Function to determine marker size based on earthquake magnitude.
  function getRadius(magnitude) {
    return magnitude === 0 ? 1 : magnitude * 4;
  }

  // Adding earthquake markers to the map.
  L.geoJson(data, {
  pointToLayer: function (feature, latlng) {
    // Ensuring correct coordinate order (latitude, longitude)
    return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
  },
  style: styleInfo,
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      `Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}<br>Depth: ${feature.geometry.coordinates[2]} km`
    );
  }
}).addTo(earthquakes);

  // Create a legend control object for displaying depth categories.
  let legend = L.control({
    position: "bottomright" // Positioning at bottom right corner of the map.
  });

  // Define legend properties and add color indicators.
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90]; // Depth categories.
    let colors = [
      "#1a9850",
      "#91cf60",
      "#d9ef8b",
      "#fee08b",
      "#fc8d59",
      "#d73027"
    ];

    // Loop through depth intervals to create a color-coded legend.
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        `<i style="background:${colors[i]}"></i> ` +
        `${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+"}`;
    }

    return div;
  };

  // Add the legend to the map.
  legend.addTo(map);
});

// OPTIONAL: Step 2
// Fetch and display tectonic plate boundary data.
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
  L.geoJson(plate_data, {
    color: "orange", // Assigning orange color to boundaries.
    weight: 2,       // Line thickness.
    opacity: 0.8,    // Making lines slightly transparent.
    dashArray: "3"   // Dashed lines for better visibility.
  }).addTo(tectonicPlates);

  // Add tectonic plates layer to the map.
  tectonicPlates.addTo(map);
});