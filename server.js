const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");
const app = express();

const port = process.env.PORT || 8080;

const debugLogFile = "public/debuglog.txt";

//fs.writeFile(debugLogFile, "", "utf8");

app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, "/public")));

app.listen(port, function() {
    console.log("App listening on port " + port);
});

app.post("/log", function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('log received');

    var message = request.body;
    var timestamp = moment().format("MM-DD HH:mm");
    var fullMsg = timestamp + " - " + message + "\n";
    console.log(fullMsg);
    fs.appendFile(debugLogFile, timestamp + " - " + message + "\n", "utf8");
});