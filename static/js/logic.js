// Create the 'basemap' tile layer that will be the default background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "© OpenStreetMap contributors",
  detectRetina: true
});

// Create additional tile layers for different map styles.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors, HOT'
});
let dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
});

// Create layer groups for earthquakes and tectonic plates.
let earthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();

// Initialize the map object.
let map = L.map("map", {
  center: [20, 0], 
  zoom: 2,
  layers: [basemap, earthquakes]
});

// Define base maps and overlays.
let baseMaps = {
  "Basemap": basemap,
  "Streets": streets,
  "Dark Mode": dark
};
let overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

// Add layer control for switching between maps.
L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

// Fetch and display earthquake data from USGS GeoJSON feed.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // Function to style markers based on earthquake properties.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.8,
      fillColor: getColor(feature.geometry.coordinates[2]), 
      color: "#000000",
      radius: getRadius(feature.properties.mag), 
      stroke: true,
      weight: 0.5
    };
  }

  // Function to determine marker color based on depth.
  function getColor(depth) {
    return depth > 90 ? "#d73027" :
           depth > 70 ? "#fc8d59" :
           depth > 50 ? "#fee08b" :
           depth > 30 ? "#d9ef8b" :
           depth > 10 ? "#91cf60" :
                        "#1a9850";
  }

  // Function to determine marker size based on magnitude.
  function getRadius(magnitude) {
    return magnitude === 0 ? 1 : magnitude * 4;
  }

  // Adding earthquake markers to the map.
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      if (!feature.geometry.coordinates || feature.geometry.coordinates.length < 2) {
        console.warn("Skipping invalid data point:", feature);
        return;
      }

      let lat = feature.geometry.coordinates[1];
      let lon = feature.geometry.coordinates[0];

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        console.warn("Skipping out-of-range data point:", feature);
        return;
      }

      return L.circleMarker([lat, lon]);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}<br>Depth: ${feature.geometry.coordinates[2]} km`
      );
    }
  }).addTo(earthquakes);

  // Adjust map bounds dynamically after adding markers.
  setTimeout(() => {
    let bounds = earthquakes.getLayers().length ? L.featureGroup(earthquakes.getLayers()).getBounds() : map.getBounds();
    map.fitBounds(bounds);
  }, 1000);

  // Create a legend for displaying earthquake depth colors.
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];

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

// Fetch and display tectonic plate boundary data.
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
  L.geoJson(plate_data, {
    color: "orange",
    weight: 2,
    opacity: 0.8,
    dashArray: "3"
  }).addTo(tectonicPlates);

  tectonicPlates.addTo(map);
});