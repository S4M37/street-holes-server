const PORT = process.env.PORT || '3000';
const express = require('express');
const app = express();
const http = require('http');
const api = require('./routes/street-holes.api');
const elasticApi = require('./routes/elastic.api');

//Model IntroWebUserLog
var UserStreetHoleReport = require('./models/UserStreetHoleReport');

//Body-Parser
//this will let us get the data from a POST
var bodyParser = require('body-parser');


// configure app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json());


// middleware to use for all requests
app.use(function (req, res, next) {
    // do logging
    console.log('');
    console.log('###### Request Triggered ######');

    console.log('From :' + req.url);
    if (req.body !== null) {
        console.log('With a body content :');
        console.log(JSON.stringify(req.body));
    }
    console.log('###############################');
    console.log('');

    next(); // make sure we go to the next routes and don't stop here
});


// REGISTER OUR ROUTES -------------------------------

app.use('/api', api);
app.use('/api/elastic', elasticApi);
app.set('port', PORT);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(PORT, function () {
    console.log('Server Started at port: ' + PORT);
});

