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

function AddCSS(fileURL, id = null) {
    var cssID = id;
    if (id === null) {
        cssID = fileURL;
    }
    if (!document.getElementById(cssID)) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.id = cssID;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = fileURL;
        link.media = "all";
        head.appendChild(link);
    }
}

function AddScript(fileURL, id = null) {
    var scriptID = id;
    if (id === null) {
        scriptID = fileURL;
    }
    if (!document.getElementById(scriptID)) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.id = scriptID;
        script.src = fileURL;
        head.appendChild(script);
    }
}

if (IsMobile()) {
    AddCSS("index-mobile.css");

    // Hammer.js mobile touch events : http://hammerjs.github.io/
    AddScript("https://hammerjs.github.io/dist/hammer.min.js", "hammer-js");
}
else {
    AddCSS("index-desktop.css");
    
    // Custom scrollbar : https://github.com/Grsmto/simplebar
    AddCSS("https://unpkg.com/simplebar@latest/dist/simplebar.css", "simplebar-css");
    AddScript("https://unpkg.com/simplebar@latest/dist/simplebar.js", "simplebar-js");
}