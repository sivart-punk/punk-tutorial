const express = require('express');
var app = express();
app.use(express.static('public'));

const addressPort = 8081

var server = app.listen(addressPort, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log('Server listening at ' + 'http://localhost:' + addressPort )
})