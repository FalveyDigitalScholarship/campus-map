function FormatDescription(description) {
    var formatted = "<p>";
    var newlines = 0;
    for (var i = 0; i < description.length; i++) {
        var char = description.charAt(i);
        if (char == "\n") {
            newlines += 1;
        }
        else if (char == "\r") {
            // Ignore these, but don't reset newline count.
            // This will take care of /r/n line endings.
        }
        else {
            if (newlines > 1) {
                formatted += "</p><p>"
            }
            else if (newlines == 1) {
                formatted += " ";
            }
            newlines = 0;
            formatted += char;
        }
    }
    formatted += "</p>"

    var converter = new showdown.Converter();
    return converter.makeHtml(description);
    console.log(converter.makeHtml(description));

    return formatted;
}

function IsDescriptionLoaded(description) {
    if (description === null || description === undefined)
        return true;

    return description.slice(description.length - 4, description.length - 1) !== ".txt";
}

function IsPolygonLoaded(polygon) {
    var info = polygon.options;
    if (!IsDescriptionLoaded(info.description))
        return false;

    if (info.subsites !== null) {
        for (var i = 0; i < info.subsites.length; i++) {
            if (!IsDescriptionLoaded(info.subsites[i].description))
                return false;
        }
    }
    return true;
}

function FetchSiteDescription(siteInfo, polygon) {
    if (siteInfo.description === null || siteInfo.description === undefined)
        return;

    $.ajax({
        dataType: "text",
        url: "/descriptions/" + siteInfo.description,
        success: function(description, textStatus, jqXHR) {
            siteInfo.description = FormatDescription(description);

            // Open start selection building once its description is loaded.
            if (polygon.options.name === startSelection && IsPolygonLoaded(polygon)) {
                myMap.panTo(RecenterWithSidebar(polygon.getCenter()), {
                    animate: false
                });

                SelectPolygon(polygon);

                if (!sidebarOpen) {
                    ToggleSidebar();
                }
            }
        }
    });
}

function FetchPolygonDescriptions(polygon) {
    var siteInfo = polygon.options;
    FetchSiteDescription(siteInfo, polygon);

    if (siteInfo.subsites !== null) {
        for (var i = 0; i < siteInfo.subsites.length; i++) {
            FetchSiteDescription(siteInfo.subsites[i], polygon);
        }
    }
}

function CreatePolygons(locationData, coords) {
    for (var i = 0; i < locationData.length; i++) {
        var locName = locationData[i].name;
        if (!(locName in coords)) {
            console.error(locName + " has no coordinates");
        }

        var image = locationData[i].image;
        if (image === null || image === undefined) {
            // TODO temporary
            image = "nassau.jpg";
        }
        var description = null;
        if ("description" in locationData[i]) {
            description = locationData[i].description;
        }
        var subsites = null;
        if ("subsites" in locationData[i]) {
            subsites = locationData[i].subsites;
        }

        var polygon = L.polygon(coords[locName], {
            name: locName,
            category: locationData[i].category,
            // File name is written into description, then used to fetch it.
            description: description,
            image: image,
            color: colors[locationData[i].category],
            subsites: subsites,
            bubblingMouseEvents: false
        }).addTo(myMap);

        polygon.setStyle(styleIdle);

        FetchPolygonDescriptions(polygon); // Fetches from file name.
        
        polygon.on("click", OnClickBldg);
        polygon.on("mouseover", OnMouseEnterBldg);
        polygon.on("mouseout", OnMouseExitBldg);
    }
}

function LoadPolygons() {
    $.ajax({
        dataType: "json",
        url: "/locationData.json",
        success: function(locationData, textStatus, jqXHR) {
            $.ajax({
                dataType: "json",
                url: "/locationCoords.json",
                success: function(coords, textStatus, jqXHR) {
                    CreatePolygons(locationData, coords);
                }
            });
        }
    });
}