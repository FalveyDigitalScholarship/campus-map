window.onload = function() {
    var startLoc = new mapboxgl.LngLat(-74.6581347, 40.3440774);
    mapboxgl.accessToken = '***REMOVED***';
    
    var map = new mapboxgl.Map({
        container: 'map',
        style: "mapbox://styles/jmrico01/cj44gwrz90dqk2rmn7j9uy822", //'mapbox://styles/mapbox/streets-v9',
        minZoom: 15,
        maxZoom: 18,
        center: startLoc,
        zoom: 15
    });
};