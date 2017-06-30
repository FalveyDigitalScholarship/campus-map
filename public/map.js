var myMap = null;
//var hoverPopup = null;

function isSidebarOpen() {
    if (typeof isSidebarOpen.$sidebar === "undefined") {
        isSidebarOpen.$sidebar = $("#sidebar");
    }

    console.log(isSidebarOpen.$sidebar.css("left"));
    return isSidebarOpen.$sidebar.css("left") === "0px";
}

function sidebarButtonTooltipVisible(flag) {
    var $toggleSidebarTooltip = $("#toggleSidebarTooltip");

    if (flag) {
        $("#toggleSidebarTooltip").css("visibility", "visible");
    }
    else {
        $("#toggleSidebarTooltip").css("visibility", "hidden");
    }
}

function toggleSidebar() {
    var $sidebar = $("#sidebar");
    var $toggleSidebar = $("#toggleSidebar");
    var $toggleSidebarArrow = $("#toggleSidebarArrow");
    var $toggleSidebarTooltip = $("#toggleSidebarTooltip");

    sidebarButtonTooltipVisible(false);

    if (isSidebarOpen()) {
        console.log("close");
        $sidebar.css("left", "-400px");
        $toggleSidebar.css("margin-left", "0");
        $toggleSidebarArrow.css("margin-left", "9px");
        $toggleSidebarArrow.css("border-color", "transparent transparent transparent black");
        $toggleSidebarTooltip.html("Show side panel");
    }
    else {
        console.log("open");
        $sidebar.css("left", "0px");
        $toggleSidebar.css("margin-left", "400px");
        $toggleSidebarArrow.css("margin-left", "1px");
        $toggleSidebarArrow.css("border-color", "transparent black transparent transparent");
        $toggleSidebarTooltip.html("Hide side panel");
    }
}

function onMouseClickBldg(event) {
    var pos = event.latlng;
    var bldgName = event.target.options.name;
    console.log(event);
}
function onMouseEnterBldg(event) {
    var pos = event.target.getBounds().getCenter();
    var name = event.target.options.name;

    /*hoverPopup.setLatLng(pos);
    hoverPopup.setContent(name);
    hoverPopup.openOn(myMap);*/
    event.target.bindPopup(name, {
        autoPan: false
    }).openPopup();
}
function onMouseExitBldg(event) {
    var pos = event.latlng;
    var bldgName = event.target.options.name;

    myMap.closePopup();
}
/*function onMouseEnterMap(event) {
    myMap.closePopup();
}*/

window.onload = function() {
    myMap = L.map("map", {
        center: [40.3440774, -74.6581347],
        zoom: 16.5,
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
        accessToken: '***REMOVED***'
    }).addTo(myMap);

    L.control.zoom({position: "topright"}).addTo(myMap);

    var marker = L.marker([40.3440774, -74.6581347]).addTo(myMap);
    marker.bindPopup("<b>Princeton University</b><br>Test");

    $("#toggleSidebarButton").click(toggleSidebar);
    $("#toggleSidebarButton").hover(function() {
        sidebarButtonTooltipVisible(true); // Hover in
    }, function() {
        sidebarButtonTooltipVisible(false); // Hover out
    });

    for (var i = 0; i < locations.length; i++) {
        var polygon = L.polygon(locations[i]["coords"], {
            name: locations[i]["name"],
            color: "#FF0000",
            weight: 2,
            opacity: 1.0
        }).addTo(myMap);
        
        //hoverPopup = L.popup();
        polygon.on("click", onMouseClickBldg);
        polygon.on("mouseover", onMouseEnterBldg);
        polygon.on("mouseout", onMouseExitBldg);

        //myMap.on("mouseover", onMouseEnterMap);
    }
};