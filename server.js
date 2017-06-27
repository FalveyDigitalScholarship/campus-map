var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

/*app.get("/", function(req, res) {
    res.send("Hello, world!");
});*/
app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log("App listening on port " + port);
});