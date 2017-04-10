const PORT = 4000;
const express = require('express');
const app = express();

//Model IntroWebUserLog
var UserStreetHoleReport = require('./models/UserStreetHoleReport');

//Body-Parser
//this will let us get the data from a POST
var bodyParser = require('body-parser');

//filestream API: for managing files
var fs = require('fs');

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json());


// get an instance of the express Router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
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

//api health
router.get('/', function (req, res) {
    res.status(200).json({message: 'User Street Holes Reporting is API running !', Status: "green"});
});

function replacer(key, value) {
    if (key == "_id") return undefined;
    else return value;
}

//create Log line comming from IntroMobilePage::Web-User
router.route('/user-street-hole-report')

// create a IntroWebUserLog (accessed at POST http://localhost:8080/api/introwebuserlogs)
    .post(function (req, res) {

        // create a new instance of the IntroWebUserLog model
        var userStreetHoleReport = new UserStreetHoleReport();
        // set the introWebUserLog atttributes (comes from the request)
        userStreetHoleReport = req.body;


        fs.appendFile('./public/user-street-hole-report.log', JSON.stringify(userStreetHoleReport, replacer) + '\n', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('file user-street-hole-report was modified !');
            }
        });

        res.status(200).json({
            message: 'UserStreetHoleReport instance was created successfuly',
            UserStreetHoleReport: userStreetHoleReport
        });

    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(PORT);

console.log('Server Started at port: ' + PORT);

