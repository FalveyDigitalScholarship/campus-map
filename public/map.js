var myMap = null;
var subsitePrototype = null;

var polygons = [];

var polygonSelected = null;
var polygonHovered = null; // mobile only
var popupSelected = null;
var popupHover = null;

var polygonRecentClick = false;
// Amount of time the recent click flag will be true.
var polygonRecentClickDuration = 150;
// Amount of time the map click event waits to confirm no polygon was clicked.
var polygonRecentClickTime = 50;

var sidebarOpen = false;
var paneOpen = false;
var paneAnimating = false;
var paneHasOpened = false;

var startSelection = "Nassau Hall";

var popupContent = "<b>{0}</b>";
var popupContentSites = "<b>{0}</b><br>{1}";

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
    //return true; // TODO debug only
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    }
    else {
        return false;
    }
}

function AddCSS(fileURL) {
    var cssId = fileURL;
    if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = fileURL;
        link.media = "all";
        head.appendChild(link);
    }
}

function OnSwipePane(ev) {
    if (!paneOpen && ev.velocityY < -1.0) {
        TogglePane();
    }
    var scrollTop = document.getElementById("outer").scrollTop;
    if (paneOpen && scrollTop == 0 && ev.velocityY > 1.0) {
        TogglePane();
    }
}

function TogglePane() {
    if (paneAnimating) 
        return;

    if (!paneHasOpened) {
        $("#bottomPaneTip").hide();
        paneHasOpened = true;
    }

    var $arrow = $("#paneUpArrow");

    paneAnimating = true;
    if (paneOpen) {
        $arrow.css("border-color", "transparent transparent #222 transparent");
        $arrow.css("margin-top", "15px");

        document.getElementById("outer").scrollTop = 0;

        var windowHeight = $(window).height();
        var bldgImgHeight = $("#bldgImg").height();
        var bttmPaneHeight = $("#bottomPane").height();

        $("#bldgImg").css("position", "absolute");
        $("#bldgImg").css("top", "0");
        $("#bottomPane").css("position", "absolute");
        $("#bottomPane").css("bottom", windowHeight - bldgImgHeight - bttmPaneHeight);
        $("#infoOverlay").height(windowHeight);
        $("#infoOverlay").css("position", "absolute");
        $("#infoOverlay").css("top", bldgImgHeight + bttmPaneHeight);

        $("#outer").css("overflow-y", "hidden");
        $("#main").show();

        $("#bldgImg").css("top", "100%");
        $("#bottomPane").css("bottom", "0");
        $("#infoOverlay").css("top", "100%");
        
        setTimeout(function() {
            $("#infoOverlay").css("height", "auto");
            paneAnimating = false;
        }, 600);
    }
    else {
        $arrow.css("border-color", "#222 transparent transparent transparent");
        $arrow.css("margin-top", "30px");

        $("#bldgImg").css("top", "0");
        var windowHeight = $(window).height();
        var bldgImgHeight = $("#bldgImg").height();
        var bttmPaneHeight = $("#bottomPane").height();
        $("#bottomPane").css("bottom", windowHeight - bldgImgHeight - bttmPaneHeight);
        $("#infoOverlay").height(windowHeight);
        $("#infoOverlay").css("top", bldgImgHeight + bttmPaneHeight);

        setTimeout(function() {
            $("#outer").css("overflow-y", "visible");
            $("#main").hide();

            $("#bottomPane").css("position", "relative");
            $("#bottomPane").css("top", "auto");
            $("#bottomPane").css("bottom", "auto");
            $("#bldgImg").css("position", "relative");
            $("#bldgImg").css("top", "auto");
            $("#infoOverlay").css("position", "relative");
            $("#infoOverlay").css("top", "auto");
            $("#infoOverlay").css("height", "auto");
            paneAnimating = false;
        }, 600);
    }

    paneOpen = !paneOpen;
}

function SidebarWidth() {
    return $("#sidebar").width();
}

function RecenterWithSidebar(latLng) {
    var targetPoint = myMap.project(latLng, myMap.zoom)
    if (!IsMobile()) {
        targetPoint = targetPoint.subtract([SidebarWidth() / 2, 0]);
    }
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

function MakePopupFromPolygon(polygon, small = false) {
    var name = polygon.options.name;
    var subsites = polygon.options.subsites;

    var latLng = [polygon.getBounds().getNorth(), polygon.getCenter().lng];

    var content = popupContent.format(name);
    if (!small && subsites != null) {
        var siteString = "";
        if (polygon.options.description !== null) {
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

    if (small) {
        content = "<div style=\"font-size: 10px\">" + content + "</div>";
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

    $("#bldgName").html(name);
    if (info.image === null) {
        $("#bldgImg").css("height", "0px");
        $("#bldgImg").hide();
    }
    else {
        $("#bldgImg").show();
        $("#bldgImg").css("height", "auto");
        $("#bldgImg").attr("src", "images/" + info.image);
    }
    if (info.description === null) {
        $("#bldgDescription").html("");

        if (info.subsites.length === 1) {
            $("#bldgSites").html("1 site");
        }
        else {
            $("#bldgSites").html(info.subsites.length + " sites");
        }
        $("#bldgSites").show();
    }
    else {
        $("#bldgDescription").html("<p>" + info.description + "</p>");

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
    }

    $(".subsite").remove();
    if (info.subsites !== null) {
        for (var i = 0; i < info.subsites.length; i++) {
            var subName = info.subsites[i].name;

            var $subDiv = $("<div class=\"subsite\"></div>");
            $subDiv.html(subsitePrototype);
            if (IsMobile()) {
                $("#infoOverlay").append($subDiv);
            }
            else {
                $("#sidebar .simplebar-scroll-content .simplebar-content").append($subDiv);
            }
                
            $subDiv.find(".subName").html(subName);
            $subDiv.find(".subDescription").html(info.subsites[i].description);
            var $subImg = $subDiv.find(".subImg");
            if ("image" in info.subsites[i]) {
                $subImg.show();
                $subImg.attr("src", "images/" + info.subsites[i].image);
            }
            else {
                $subImg.hide();
            }
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
        popupSelected = MakePopupFromPolygon(polygon);
    }
    else {
        $("#toggleSidebarButton").hide();
    }
}

function OnClickBldg(event) {
    if (paneOpen || paneAnimating)
        return; // catastrophic failure if this isn't done (mobile)
    
    polygonRecentClick = true;

    var polygon = event.target;
    myMap.panTo(RecenterWithSidebar(polygon.getCenter()));

    SelectPolygon(polygon);

    if (IsMobile()) {
        $("#bottomPane").show();
        if (!paneHasOpened) {
            $("#bottomPaneTip").show();
        }
        ClearPolygonHover();
    }
    else {
        if (!sidebarOpen) {
            ToggleSidebar();
        }
    }

    setTimeout(function() {
        polygonRecentClick = false;
    }, polygonRecentClickDuration);
}
function OnClickMap() {
    if (paneOpen || paneAnimating)
        return; // catastrophic failure if this isn't done (mobile)

    // "True" map click.
    if (IsMobile()) {
        $("#bottomPane").hide();
        if (!paneHasOpened) {
            $("#bottomPaneTip").hide();
        }
    }
    else {
        if (sidebarOpen) {
            ToggleSidebar();
        }
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

// Desktop only
function OnMouseEnterBldg(event) {
    var polygon = event.target;

    if (popupHover !== null) {
        popupHover.remove();
    }
    popupHover = MakePopupFromPolygon(polygon);

    polygon.setStyle(styleHover);
}
// Desktop only
function OnMouseExitBldg(event) {
    var polygon = event.target;

    if (popupHover != null) {
        popupHover.remove();
    }
    if (polygon !== polygonSelected) {
        polygon.setStyle(styleIdle);
    }
}

function ApproxLatLngDistance(latLng1, latLng2) {
    return Math.sqrt(
        (latLng1.lat - latLng2.lat) * (latLng1.lat - latLng2.lat)
        + (latLng1.lng - latLng2.lng) * (latLng1.lng - latLng2.lng));
}

// mobile only
function ClearPolygonHover() {
    if (polygonHovered !== null) {
        //polygonHovered.setStyle(styleIdle);
        polygonHovered = null;
    }
    if (popupHover !== null) {
        popupHover.remove();
        popupHover = null;
    }
}

// Mobile only, called every 0.X seconds
function UpdatePopup() {
    if (paneOpen)
        return;

    var mapCenter = myMap.getCenter();

    var minInd = -1;
    var minDist = 100000000.0; // large number
    for (var i = 0; i < polygons.length; i++) {
        var polygonCenter = polygons[i].getCenter();
        var dist = ApproxLatLngDistance(mapCenter, polygonCenter);
        if (dist < minDist) {
            minDist = dist;
            minInd = i;
        }
    }

    var polygon = polygons[minInd];
    if (minDist < 0.0015) {
        if (polygon === polygonSelected && polygon !== polygonHovered) {
            ClearPolygonHover();
        }
        if (polygon !== polygonSelected && polygonHovered !== polygon) {
            ClearPolygonHover();

            popupHover = MakePopupFromPolygon(polygon, true);
            //polygon.setStyle(styleHover);
            polygonHovered = polygon;
        }
    }
    else {
        ClearPolygonHover();
    }
}

$(function() {
    var zoomPos = "bottomright";

    if (IsMobile()) {
        AddCSS("index-mobile.css");
        $(".desktop").remove();
        zoomPos = "topleft";
        $("#instruction").html("Tap on a highlighted location to explore<br> sites related to Princeton & Slavery");
    }
    else {
        AddCSS("index-desktop.css");
        $(".mobile").remove();
    }

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
    L.control.zoom({position: zoomPos}).addTo(myMap); // zoom control
    myMap.on("click", OnClickMapEvent);

    // Initialize MapBox tile layer.
    L.tileLayer("https://api.mapbox.com/{style}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        minZoom: 16,
        style: "styles/v1/***REMOVED***", // color (classic)
        //style: "styles/v1/***REMOVED***", // light
        //style: "styles/v1/***REMOVED***", // dark
        accessToken: "***REMOVED***"
    }).addTo(myMap);
    //myMap.attributionControl.setPosition("topleft");

    // Save sidebar subsite prototype.
    var $subsitePrototype = $("#subsitePrototype");
    subsitePrototype = $subsitePrototype.html();
    $subsitePrototype.remove();

    if (IsMobile()) {
        $("#paneUpButton").click(TogglePane);
        var bttmPaneHammer = new Hammer($("#bottomPane")[0]);
        bttmPaneHammer.get("swipe").set({
            direction: Hammer.DIRECTION_VERTICAL
        });
        bttmPaneHammer.on("swipe", OnSwipePane);

        setInterval(UpdatePopup, 500);
    }
    else {
        $("#toggleSidebarButton").click(ToggleSidebar);
        $("#toggleSidebarButton").hover(function() {
            SidebarButtonTooltipVisible(true); // Hover in
        }, function() {
            SidebarButtonTooltipVisible(false); // Hover out
        });
        $("#toggleSidebarButton").hide();
    }

    LoadData();
});