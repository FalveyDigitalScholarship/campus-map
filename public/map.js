window.onload = function() {
    var mymap = L.map("map", {
        center: [40.3440774, -74.6581347],
        zoom: 16,
        zoomSnap: 0.25,
        zoomDelta: 0.5
    });
    //}).setView([40.3440774, -74.6581347], 16);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        minZoom: 16,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiam1yaWNvMDEiLCJhIjoiY2o0MjZvYXZzMDNxeTMzbXphajQ2YmdoayJ9.r5KOkm5E2W9c6o854dXhfw'
    }).addTo(mymap);

    var marker = L.marker([40.3440774, -74.6581347]).addTo(mymap);
    marker.bindPopup("<b>Princeton University</b><br>Test");
};