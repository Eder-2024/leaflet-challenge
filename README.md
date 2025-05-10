# leaflet-challenge
# 🌍 Leaflet Earthquake Visualization

This project visualizes global earthquake activity using real-time data from the [USGS Earthquake GeoJSON Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php). It uses **Leaflet.js** and **D3.js** to display interactive maps and markers that reflect the **magnitude** and **depth** of earthquakes, with additional tectonic plate boundary data overlaid for deeper insight.

## 🔹 Features

- Earthquake markers sized by magnitude and colored by depth
- Interactive popups with magnitude, location, and depth info
- Live data from the past 7 days via USGS GeoJSON API
- Legend showing depth color scale
- Tectonic plate boundaries from [Fraxen's GeoJSON data](https://github.com/fraxen/tectonicplates)
- Layer controls to toggle:
  - Earthquakes
  - Tectonic plates
  - Multiple base maps: Satellite, Grayscale, and Outdoors views

## 🛠 Technologies Used

- [Leaflet.js](https://leafletjs.com/)
- [D3.js](https://d3js.org/)
- USGS Earthquake GeoJSON Feed
- Mapbox & CartoDB tile layers

## 📁 Project Structure
```
leaflet-challenge/

├── index.html
├── Images/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── logic.js
```


## 🚀 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/Eder-2024/leaflet-challenge.git
   ```
2. Navigate into the project folder:
   ```bash
    cd leaflet-challenge
   ```
3. Open index.html in your web browser.
✅ Note: If you're using Mapbox tile layers, make sure to add your own Mapbox access token in logic.js.
