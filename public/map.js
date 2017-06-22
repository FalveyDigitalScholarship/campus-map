window.onload = function() {
    /*var mymap = L.map("map").setView([40.3440774, -74.6581347], 16);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        minZoom: 16,
        id: 'mapbox.streets',
        accessToken: '***REMOVED***'
    }).addTo(mymap);*/

    var startLoc = new mapboxgl.LngLat(-74.6581347, 40.3440774);
    mapboxgl.accessToken = '***REMOVED***';
    
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        minZoom: 15,
        maxZoom: 20,
        center: startLoc,
        zoom: 15
    });
};