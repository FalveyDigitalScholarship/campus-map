var myMap = null;
var locationData = null;

var polygonSelected = null;
var popupSelected = null;
var popupHover = null;

var polygonRecentClick = false;
// Amount of time the recent click flag will be true.
var polygonRecentClickDuration = 150;
// Amount of time the map click event waits to confirm no polygon was clicked.
var polygonRecentClickTime = 50;

var sidebarOpen = false;

var startSelection = "Nassau Hall";
    
var colors = {
    "purple": "#C6ACC7",
    "red": "#ECB4BF",
    "orange": "#FBD7B7",
    "blue": "#C2E3EC",
    "none": "#FFFFFF"
};
var categories = {
    "purple": "Dedicated to slave owner",
    "red": "Donated by slave owner",
    "orange": "Dedicated to someone with ties to slavery",
    "blue": "Donated by someone with ties to slavery"
};

var popupContent = "<div class='bldgPopup'><b>{0}</b></div>";
var popupContentSites = "<div class='bldgPopup'><b>{0}</b><br>{1}</div>";

var styleIdle = {
    weight: 2,
    opacity: 0.75,
    fillOpacity: 0.25
};
var styleHover = {
    weight: 2,
    opacity: 1.0,
    fillOpacity: 0.6
};
var styleSelected = {
    weight: 2,
    opacity: 1.0,
    fillOpacity: 0.6
};

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return (typeof args[number] != 'undefined') ? args[number] : match;
        });
    };
}

function IsMobile() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        return false;
    }
    else {
        return true;
    }
}

function SidebarWidth() {
    return $("#sidebar").width();
}

function RecenterWithSidebar(latLng) {
    var targetPoint = myMap.project(latLng, myMap.zoom).subtract([SidebarWidth() / 2, 0]);
    return myMap.unproject(targetPoint, myMap.zoom);
}

function SidebarButtonTooltipVisible(flag) {
    var $toggleSidebarTooltip = $("#toggleSidebarTooltip");

    if (flag) {
        $("#toggleSidebarTooltip").css("visibility", "visible");
    }
    else {
        $("#toggleSidebarTooltip").css("visibility", "hidden");
    }
}

function ToggleSidebar() {
    var $sidebar = $("#sidebar");
    var $toggleSidebar = $("#toggleSidebar");
    var $toggleSidebarArrow = $("#toggleSidebarArrow");
    var $toggleSidebarTooltip = $("#toggleSidebarTooltip");

    SidebarButtonTooltipVisible(false);

    if (sidebarOpen) {
        $sidebar.css("left", "-" + SidebarWidth() + "px");
        $toggleSidebar.css("margin-left", "0");
        $toggleSidebarArrow.css("margin-left", "9px");
        $toggleSidebarArrow.css("border-color", "transparent transparent transparent black");
        $toggleSidebarTooltip.html("Show side panel");
    }
    else {
        $sidebar.css("left", "0px");
        $toggleSidebar.css("margin-left", SidebarWidth() + "px");
        $toggleSidebarArrow.css("margin-left", "1px");
        $toggleSidebarArrow.css("border-color", "transparent black transparent transparent");
        $toggleSidebarTooltip.html("Hide side panel");
    }
    sidebarOpen = !sidebarOpen;
}

function GetPopupFromPolygon(polygon) {
    var name = polygon.options.name;
    var subsites = polygon.options.subsites;

    var latLng = [polygon.getBounds().getNorth(), polygon.getCenter().lng];

    var content = popupContent.format(name);
    if (subsites != null) {
        if (subsites.length == 1) {
            content = popupContentSites.format(name, "1 site");
        }
        else {
            content = popupContentSites.format(name, subsites.length + " sites");
        }
    }

    var popup = L.popup({
        autoPan: true,
        autoClose: false,
        closeOnClick: false,
        closeButton: false
    })
    .setLatLng(latLng)
    .setContent(content)
    .openOn(myMap)
    .bringToBack();

    return popup;
}

function DisplayBuildingInfo(info) {
    var name = info.name;
    var color = colors[info.category];

    if (info.category === "none") {
        $("#bldgImg").hide();
        $("#bldgCategory").hide();
    }
    else {
        $("#bldgCategory").show();
        $("#bldgCategory").html(categories[info.category]);
        $("#bldgImg").show();
        $("#bldgImg").attr("src", "images/" + info.image);
    }
    $("#bldgInfo").css("background-color", color);
    $("#toggleSidebarButton").css("background-color", color);
    $("#bldgName").html(name);
}

function SelectPolygon(polygon) {
    // Deselect polygon and remove popup.
    if (polygonSelected !== null) {
        polygonSelected.setStyle(styleIdle);
    }
    polygonSelected = polygon;
    if (popupSelected !== null) {
        popupSelected.remove();
    }

    // Display new polygon info if it's not null.
    if (polygon !== null) {
        $("#toggleSidebarButton").show();
        DisplayBuildingInfo(polygon.options);

        polygon.setStyle(styleSelected);
        popupSelected = GetPopupFromPolygon(polygon);
    }
    else {
        $("#toggleSidebarButton").hide();
    }
}

function OnClickBldg(event) {
    polygonRecentClick = true;

    var polygon = event.target;
    myMap.panTo(RecenterWithSidebar(polygon.getCenter()));

    SelectPolygon(polygon);

    if (!sidebarOpen) {
        ToggleSidebar();
    }

    setTimeout(function() {
        polygonRecentClick = false;
    }, polygonRecentClickDuration);
}
function OnClickMap() {
    // "True" map click.
    if (sidebarOpen) {
        ToggleSidebar();
    }

    // Remove polygon selection.
    SelectPolygon(null);
}
function OnClickMapEvent(event) {
    // First check if a polygon has also been clicked (event propagates).
    setTimeout(function() {
        if (!polygonRecentClick) {
            // If no polygon has been clicked, we're sure it's the map.
            OnClickMap();
        }
    }, polygonRecentClickTime);
}
function OnMouseEnterBldg(event) {
    var polygon = event.target;

    if (popupHover !== null) {
        popupHover.remove();
    }
    popupHover = GetPopupFromPolygon(polygon);

    polygon.setStyle(styleHover);
}
function OnMouseExitBldg(event) {
    var polygon = event.target;

    if (popupHover != null) {
        popupHover.remove();
    }
    if (polygon !== polygonSelected) {
        polygon.setStyle(styleIdle);
    }
}

$(function() {
    /*if (isMobile()) {
        $(".desktop").hide();
    }*/

    myMap = L.map("map", {
        center: [40.3440774, -74.6581347],
        zoom: 17,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        maxBounds: [
            [40.3062834,-74.6837298],
            [40.3615089,-74.6441935]
        ],
        zoomControl: false // add manually later to top right
    });

    L.tileLayer("https://api.mapbox.com/{style}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        minZoom: 16,
        //style: "styles/v1/mapbox/dark-v9",
        style: "styles/v1/***REMOVED***",
        accessToken: "***REMOVED***"
    }).addTo(myMap);
    
    L.control.zoom({position: "topright"}).addTo(myMap);

    $("#toggleSidebarButton").click(ToggleSidebar);
    $("#toggleSidebarButton").hover(function() {
        SidebarButtonTooltipVisible(true); // Hover in
    }, function() {
        SidebarButtonTooltipVisible(false); // Hover out
    });
    $("#toggleSidebarButton").hide();

    $.ajax({
        dataType: "json",
        url: "/locationData.json",
        success: function(data, textStatus, jqXHR) {
            locationData = data;

            $.ajax({
                dataType: "json",
                url: "/locationCoords.json",
                success: function(coords, textStatus, jqXHR) {
                    for (var i = 0; i < locationData.length; i++) {
                        var locName = locationData[i]["name"];

                        if (!(locName in coords))
                            continue;

                        var color = colors[locationData[i]["category"]];
                        if (locationData[i]["category"] == "none"
                        && locationData[i]["subsites"].length == 1) {
                            color = colors[locationData[i]["subsites"][0]["category"]];
                        }
                        var image = locationData[i]["image"];
                        if (image === null || image === undefined) {
                            image = "nassau.jpg";
                        }
                        var subsites = null;
                        if ("subsites" in locationData[i]) {
                            subsites = locationData[i]["subsites"];
                        }

                        var polygon = L.polygon(coords[locName], {
                            name: locName,
                            category: locationData[i]["category"],
                            image: image,
                            color: color,
                            subsites: subsites,
                            bubblingMouseEvents: false
                        }).addTo(myMap);
                        
                        polygon.setStyle(styleIdle);
                        
                        polygon.on("click", OnClickBldg);
                        polygon.on("mouseover", OnMouseEnterBldg);
                        polygon.on("mouseout", OnMouseExitBldg);

                        if (locName === startSelection) {
                            // TODO fix panning, take into account sidebar width
                            myMap.panTo(RecenterWithSidebar(polygon.getCenter()), {
                                animate: false
                            });

                            SelectPolygon(polygon);

                            if (!sidebarOpen) {
                                ToggleSidebar();
                            }
                        }
                    }

                    myMap.on("click", OnClickMapEvent);
                }
            });
        }
    });
});