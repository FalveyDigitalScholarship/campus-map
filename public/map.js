var myMap = null;
//var hoverPopup = null;

function isSidebarOpen() {
    if (typeof isSidebarOpen.$sidebar === "undefined") {
        isSidebarOpen.$sidebar = $("#sidebar");
    }

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
        $sidebar.css("left", "-400px");
        $toggleSidebar.css("margin-left", "0");
        $toggleSidebarArrow.css("margin-left", "9px");
        $toggleSidebarArrow.css("border-color", "transparent transparent transparent black");
        $toggleSidebarTooltip.html("Show side panel");
    }
    else {
        $sidebar.css("left", "0px");
        $toggleSidebar.css("margin-left", "400px");
        $toggleSidebarArrow.css("margin-left", "1px");
        $toggleSidebarArrow.css("border-color", "transparent black transparent transparent");
        $toggleSidebarTooltip.html("Hide side panel");
    }
}

function onClickBldg(event) {
    var bldgName = event.target.options.name;

    var randImgs = ["dickinson.jpg", "firestone.jpg", "nassau.jpg"];
    var imgInd = Math.floor(Math.random() * randImgs.length);

    var randColors = ["#C6ACC7", "#ECB4BF", "#FBD7B7", "#C2E3EC"];
    var colorInd = Math.floor(Math.random() * randColors.length);

    $("#bldgImg").attr("src", "images/" + randImgs[imgInd]);
    $("#bldgNameDiv").css("background-color", randColors[colorInd]);
    $("#bldgName").html(bldgName);

    if (!isSidebarOpen()) {
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
    var name = event.target.options.name;

    /*event.target.bindPopup(name, {
        autoPan: false
    }).openPopup();*/
    $("#bldgNameHover").html("<b>" + name + "</b>");
}
function onMouseExitBldg(event) {
    $("#bldgNameHover").html("");
    //myMap.closePopup();
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
        accessToken: 'pk.eyJ1Ijoiam1yaWNvMDEiLCJhIjoiY2o0MjZvYXZzMDNxeTMzbXphajQ2YmdoayJ9.r5KOkm5E2W9c6o854dXhfw'
    }).addTo(myMap);

    L.control.zoom({position: "topright"}).addTo(myMap);

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
            opacity: 1.0,
            bubblingMouseEvents: false
        }).addTo(myMap);
        
        //hoverPopup = L.popup();
        myMap.on("click", onClickMap);
        polygon.on("click", onClickBldg);
        polygon.on("mouseover", onMouseEnterBldg);
        polygon.on("mouseout", onMouseExitBldg);

        //myMap.on("mouseover", onMouseEnterMap);
    }
};