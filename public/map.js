var $sidebar;
var $main;
var $toggleSidebar;

function toggleSidebar() {
    if ($sidebar.width() === 0) {
        $sidebar.width(250);
        $main.css("margin-left", "250px");
        $toggleSidebar.css("margin-left", "250px");
    }
    else {
        $sidebar.width(0);
        $main.css("margin-left", "0");
        $toggleSidebar.css("margin-left", "0");
    }
}

window.onload = function() {
    var myMap = L.map("map", {
        center: [40.3440774, -74.6581347],
        zoom: 16,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        maxBounds: [
            [40.3062834,-74.6837298],
            [40.3615089,-74.6441935]
        ],
        zoomControl: false // add manually later to top right
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        minZoom: 16,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiam1yaWNvMDEiLCJhIjoiY2o0MjZvYXZzMDNxeTMzbXphajQ2YmdoayJ9.r5KOkm5E2W9c6o854dXhfw'
    }).addTo(myMap);

    L.control.zoom({position: "topright"}).addTo(myMap);

    var marker = L.marker([40.3440774, -74.6581347]).addTo(myMap);
    marker.bindPopup("<b>Princeton University</b><br>Test");

    $sidebar = $("#sidebar");
    $main = $("#main");
    $toggleSidebar = $("#toggleSidebar");
    $("#toggleSidebarButton").click(toggleSidebar);
};