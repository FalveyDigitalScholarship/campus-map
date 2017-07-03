var myMap = null;
var selectedPolygon = null;

var sidebarOpen = false;
    
var colors = {
    "idle": "#444444",
    "purple": "#C6ACC7",
    "red": "#ECB4BF",
    "orange": "#FBD7B7",
    "blue": "#C2E3EC"
};
var categories = {
    "purple": "Dedicated to slave owner",
    "red": "Donated by slave owner",
    "orange": "Dedicated to someone with ties to slavery",
    "blue": "Donated by someone with ties to slavery"
};

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

    if (sidebarOpen) {
        console.log("open");
        $sidebar.css("left", "-400px");
        $toggleSidebar.css("margin-left", "0");
        $toggleSidebarArrow.css("margin-left", "9px");
        $toggleSidebarArrow.css("border-color", "transparent transparent transparent black");
        $toggleSidebarTooltip.html("Show side panel");

        if (selectedPolygon !== null) {
            selectedPolygon.setStyle({
                color: colors["idle"]
            });
        }
    }
    else {
        console.log("close");
        $sidebar.css("left", "0px");
        $toggleSidebar.css("margin-left", "400px");
        $toggleSidebarArrow.css("margin-left", "1px");
        $toggleSidebarArrow.css("border-color", "transparent black transparent transparent");
        $toggleSidebarTooltip.html("Hide side panel");

        if (selectedPolygon !== null) {
            selectedPolygon.setStyle({
                color: colors[selectedPolygon.options.category]
            });
        }
    }
    sidebarOpen = !sidebarOpen;
}

function onClickBldg(event) {
    var polygon = event.target;
    var bldgName = polygon.options.name;
    var bldgColor = colors[polygon.options.category];
    var bldgImgPath = "images/" + polygon.options.image;

    $("#bldgImg").attr("src", bldgImgPath);
    $("#bldgNameDiv").css("background-color", bldgColor);
    $("#bldgName").html(bldgName);
    $("#bldgCategory").html(categories[polygon.options.category]);

    if (selectedPolygon !== null) {
        selectedPolygon.setStyle({
            color: colors["idle"]
        });
    }
    polygon.setStyle({
        color: bldgColor
    });
    selectedPolygon = polygon;

    if (!sidebarOpen) {
        toggleSidebar();
    }
}
function onClickMap(event) {
    /*console.log("map click");

    if (isSidebarOpen()) {
        toggleSidebar();
    }*/
}
function onMouseEnterBldg(event) {
    var polygon = event.target;
    var name = polygon.options.name;

    $("#bldgNameHover").html("<b>" + name + "</b>");
    polygon.setStyle({
        color: colors[polygon.options.category]
    });
}
function onMouseExitBldg(event) {
    var polygon = event.target;

    $("#bldgNameHover").html("");

    if (polygon !== selectedPolygon || !sidebarOpen) {
        polygon.setStyle({
            color: colors["idle"]
        });
    }
}

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

    $("#toggleSidebarButton").click(toggleSidebar);
    $("#toggleSidebarButton").hover(function() {
        sidebarButtonTooltipVisible(true); // Hover in
    }, function() {
        sidebarButtonTooltipVisible(false); // Hover out
    });

    for (var i = 0; i < locations.length; i++) {
        var bldgName = locations[i]["name"];
        for (var j = 0; j < locationData["individual"].length; j++) {
            if (bldgName === locationData["individual"][j]["name"]) {
                var polygon = L.polygon(locations[i]["coords"], {
                    name: bldgName,
                    category: locationData["individual"][j]["category"],
                    image: locationData["individual"][j]["image"],
                    color: colors["idle"],
                    weight: 2,
                    fillOpacity: 0.25,
                    bubblingMouseEvents: false
                }).addTo(myMap);
                
                myMap.on("click", onClickMap);
                polygon.on("click", onClickBldg);
                polygon.on("mouseover", onMouseEnterBldg);
                polygon.on("mouseout", onMouseExitBldg);
            }
        }

    }
};