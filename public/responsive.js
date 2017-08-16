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

function AddScript(fileURL) {
    var scriptId = fileURL;
    if (!document.getElementById(scriptId)) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.id = scriptId;
        script.src = fileURL;
        head.appendChild(script);
    }
}

if (IsMobile()) {
    AddCSS("index-mobile.css");
}
else {
    AddCSS("index-desktop.css");
}