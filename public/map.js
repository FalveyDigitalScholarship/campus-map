var myMap = null;
var subsitePrototype = null;

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
    "dedicatedToOwner": "#C6ACC7", // purple
    "donatedByOwner": "#ECB4BF", // red
    "dedicatedToTies": "#FBD7B7", // orange
    "donatedByTies": "#C2E3EC", // blue
    "none": "#FFFFFF" // white
};
var categories = {
    "dedicatedToOwner": "Dedicated to slave owner",
    "donatedByOwner": "Donated by slave owner",
    "dedicatedToTies": "Dedicated to someone with ties to slavery",
    "donatedByTies": "Donated by someone with ties to slavery"
};
var legendEntries = {};

var legendEntryColorHighlight = "#222";

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
        var siteString = "";
        if (polygon.options.category !== "none") {
            siteString += "+";
        }
        siteString += subsites.length;
        if (subsites.length == 1) {
            siteString += " site";
        }
        else {
            siteString += " sites";
        }
        content = popupContentSites.format(name, siteString);
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

    $("#bldgName").html(name);
    $("#bldgInfo").css("background-color", color);
    $("#toggleSidebarButton").css("background-color", color);
    if (info.description === null) {
        $("#bldgDescription").html("");
    }
    else {
        $("#bldgDescription").html("<p>" + info.description + "</p>");
    }

    if (info.category === "none") {
        $("#bldgImg").hide();
        $("#bldgCategory").hide();
        if (info.subsites.length === 1) {
            $("#bldgSites").html("1 site");
        }
        else {
            $("#bldgSites").html(info.subsites.length + " sites");
        }
        $("#bldgSites").show();
    }
    else {
        $("#bldgCategory").show();
        $("#bldgCategory").html(categories[info.category]);
        if (info.subsites !== null) {
            if (info.subsites.length === 1) {
                $("#bldgSites").html("+ 1 other site");
            }
            else {
                $("#bldgSites").html("+ " + info.subsites.length + " other sites");
            }
            $("#bldgSites").show();
        }
        else {
            $("#bldgSites").hide();
        }
        $("#bldgImg").show();
        $("#bldgImg").attr("src", "images/" + info.image);
    }

    $(".subsite").remove();
    if (info.subsites !== null) {
        for (var i = 0; i < info.subsites.length; i++) {
            var subName = info.subsites[i].name;
            var subCategory = info.subsites[i].category;

            var $subDiv = $("<div class=\"subsite\"></div>");
            $subDiv.html(subsitePrototype);
            $("#sidebar .simplebar-scroll-content .simplebar-content").append($subDiv);
                
            $subDiv.find(".subName").html(subName);
            $subDiv.find(".subInfo").css("background-color", colors[subCategory]);
            $subDiv.find(".subCategory").html(categories[subCategory]);
            //if ()
            $subDiv.find(".subDescription").html(info.subsites[i].description);
            //$subDiv.find(".subImg").attr("src", "");
        }
    }
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

function UpdateLegendFromPolygon(polygon) {
    if (polygon !== null) {
        var category = polygon.options.category;
        legendEntries[category].css("background-color", legendEntryColorHighlight);
    }
    else {
        for (category in legendEntries) {
            legendEntries[category].css("background-color", "transparent");
        }
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
    UpdateLegendFromPolygon(polygon);
}
function OnMouseExitBldg(event) {
    var polygon = event.target;

    if (popupHover != null) {
        popupHover.remove();
    }
    if (polygon !== polygonSelected) {
        polygon.setStyle(styleIdle);
    }
    UpdateLegendFromPolygon(null);
}

$(function() {
    /*if (isMobile()) {
        $(".desktop").hide();
    }*/

    // Initialize leaflet.js map controls.
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
    L.control.zoom({position: "topright"}).addTo(myMap); // zoom control
    myMap.on("click", OnClickMapEvent);

    // Initialize MapBox tile layer.
    L.tileLayer("https://api.mapbox.com/{style}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        minZoom: 16,
        //style: "styles/v1/jmrico01/cj66ydy6a7m3j2snoyxxom7pw", // light
        style: "styles/v1/jmrico01/cj64oe3nq5ibq2rr8tprzvy56", // dark
        accessToken: "pk.eyJ1Ijoiam1yaWNvMDEiLCJhIjoiY2o0MjZvYXZzMDNxeTMzbXphajQ2YmdoayJ9.r5KOkm5E2W9c6o854dXhfw"
    }).addTo(myMap);

    // Save sidebar subsite prototype.
    var $subsitePrototype = $("#subsitePrototype");
    subsitePrototype = $subsitePrototype.html();
    $subsitePrototype.remove();

    // Generate legend entries.
    var legendEntryPrototype = $("#legendEntryPrototype").html();
    $("#legendEntryPrototype").remove();
    for (var category in categories) {
        var $entry = $("<div class=\"legendEntry\"></div>");
        $entry.html(legendEntryPrototype);
        var $entryText = $entry.find(".legendEntryText");
        $entryText.html(categories[category]);
        $entryText.css("color", colors[category]);
        $entry.find(".legendEntryColor").css("background-color", colors[category]);

        $("#legend").append($entry);
        legendEntries[category] = $entry;
    }
    var $legendLastEntry = $("#legendLastEntry");
    legendEntries["none"] = $legendLastEntry.clone();
    $("#legend").append(legendEntries["none"]);
    $legendLastEntry.remove();

    $("#toggleSidebarButton").click(ToggleSidebar);
    $("#toggleSidebarButton").hover(function() {
        SidebarButtonTooltipVisible(true); // Hover in
    }, function() {
        SidebarButtonTooltipVisible(false); // Hover out
    });
    $("#toggleSidebarButton").hide();

    LoadPolygons();
});