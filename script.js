// LEAFLET MAP

// Initialize my own map
var map = L.map('washMap').setView([38.0832, -90.691], 15);

// Initialize the basemap
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(map);

// A style for the trails
var trailStyle = {
    "color": "#840000",
    "weight": 3,
    "opacity": 0.6
};

// Add the trails to the map
jQuery.getJSON("https://raw.githubusercontent.com/Molten-Sulfur/project1-Leaflet/main/WASH.geojson",function(data){
    L.geoJson(data, {
    style: trailStyle
}).addTo(map);
  });

// A function we'll use later that will add a popup to each marker.
function onEachFeature(feature, layer) {layer.bindPopup(feature.properties.description);}

// Add the petroglyphs to the map
// It's easier just to make separate geoJSONs for separate symbols
//than doing one layer and assigning different symbology.
jQuery.getJSON("https://raw.githubusercontent.com/Molten-Sulfur/project1-Leaflet/main/WASH-petroglyph.geojson",function(data) {
  //define the logo for petroglyphs
  var petroglyphIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/Molten-Sulfur/project1-Leaflet/main/petroglyph.png',
    iconSize: [42,25]
  });
  L.geoJson(data,{
    onEachFeature: onEachFeature,
    pointToLayer: function(feature,latlng){
	  return L.marker(latlng,{icon: petroglyphIcon});
    }
  }  ).addTo(map);
});

//Add the overlooks to the map
jQuery.getJSON("https://raw.githubusercontent.com/Molten-Sulfur/project1-Leaflet/main/WASH-overlooks.geojson",function(data) {
  //define the logo for overlooks
  var overlookIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/Molten-Sulfur/project1-Leaflet/main/lookout.png',
    iconSize: [30,30]
  });
  L.geoJson(data,{
    onEachFeature: onEachFeature,
    pointToLayer: function(feature,latlng){
	  return L.marker(latlng,{icon: overlookIcon});
    }
  }  ).addTo(map);
});

//Add the other sites to the map
jQuery.getJSON("https://raw.githubusercontent.com/Molten-Sulfur/project1-Leaflet/main/WASH-otherSites.geojson",function(data) {
  //define the logo for points of interest.
  var overlookIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/Molten-Sulfur/project1-Leaflet/main/poi6.png',
    iconSize: [18,18]
  });
  L.geoJson(data,{
    onEachFeature: onEachFeature,
    pointToLayer: function(feature,latlng){
	  return L.marker(latlng,{icon: overlookIcon});
    }
  }  ).addTo(map);
});












//ARCGIS API 2D MAP

require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], (Map, MapView, FeatureLayer) => {
  const map = new Map({
    basemap: "topo-vector"
  });
  
  // The MapView sets the extent.
  const view = new MapView({
    container: "washMap2",
    map: map,
    zoom: 15,
    center: [-90.691, 38.0832]
  });
  
  //Add the trails
  const featureLayer1 = new FeatureLayer({
  url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/Washington_State_Park_trails/FeatureServer",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [ 0,0,0,0 ], 
        outline: { 
          width: 2,
          color: [ 132, 0, 0, 0.6 ]
        }
      }
    }
  });
  map.add(featureLayer1);
  
  //Add the sites
  const featureLayer2 = new FeatureLayer({
  url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/WASH_sites/FeatureServer",
    popupTemplate: {title:"{Description}"      
    },
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 8
      },
      visualVariables: [{
        type: "color",
        field: "SYMBOLOGY",
        stops: [{ value: 1, color: "#FF2644" },
                { value: 2, color: "#2b96e6" },
                { value: 3, color: "#E6982b" }]
      }]
    }
  });
  map.add(featureLayer2);

});











// ARCGIS API 3D MAP

require([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/Camera",
  "esri/widgets/Home",
  "esri/widgets/Legend",
  "dojo/domReady!"
], function(WebScene, SceneView, Camera, Home, Legend) {
  //Now we call this web map:
  // https://slustl.maps.arcgis.com/home/webscene/viewer.html?webscene=a8789ca00ebc4def96ad3aec57c3cb13
  var scene = new WebScene({
    portalItem:{
      id:"a8789ca00ebc4def96ad3aec57c3cb13"
    }
  });
  
  // Where the camera starts out looking
  // Also used by the home button
  var camera = new Camera({
    position: [
      -90.688, // longitude
      38.053, // latitude
      3500// elevation in meters
    ],
    tilt: 45,
    heading: 0
  });
  
  // Create the div.
  var view = new SceneView({
    container: "washMap3",
    map: scene,
    camera: camera,
		viewingMode:'global'
  });
  
  // Create the home button, which returns us to the default camera.
  var homeBtn = new Home({
    view: view
  });
  // Add the home button to the top left corner of the view
  view.ui.add(homeBtn, "top-left");
  
  //Add a legend to map.
  let myLegend = new Legend({
    view: view
  });
  view.ui.add(myLegend, "top-right");
});
