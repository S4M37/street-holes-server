const express = require('express');
// get an instance of the express Router
var router = express.Router();
//filestream API: for managing files
var fs = require('fs');
var mkdirp = require('mkdirp');

var UserStreetHoleReport = require('../models/UserStreetHoleReport');

function replacer(key, value) {
    if (key === "_id") return undefined;
    else return value;
}

/*
 * ElasticSearch Client
 */
var elasticClient = require('../lib/elastic');
var client = elasticClient.ElasticClient().getInstance();

//api health
router.get('/', function (req, res) {
    res.status(200).json({message: 'User Street Holes Reporting is API running ! Test DevOps', Status: "green"});
});

//create Log line comming from IntroMobilePage::Web-User
router.route('/user-street-hole-report')

// create a IntroWebUserLog (accessed at POST http://localhost:8080/api/introwebuserlogs)
    .post(function (req, res) {

        // create a new instance of the IntroWebUserLog model
        var userStreetHoleReport = new UserStreetHoleReport();
        // set the introWebUserLog atttributes (comes from the request)
        userStreetHoleReport = req.body;
        userStreetHoleReport.timestamp = new Date();

        client.search({
            index: 'street-holes',
            type: 'holes',
            body: {
                "query": {
                    "bool": {
                        "must": {"match_all": {}},
                        "filter": {
                            "geo_distance": {
                                "distance": "0.01km",
                                "location": {
                                    "lat": userStreetHoleReport.location.lat,
                                    "lon": userStreetHoleReport.location.lon
                                }
                            }
                        }
                    }
                }
            }
        }).then(function (resp) {
            var hits = resp.hits.hits;
            if (hits.length === 0) {
                client.index({
                    index: 'street-holes',
                    type: 'holes',
                    body: userStreetHoleReport
                }, function (err, resp, status) {
                    console.log(resp);
                });
            }
        }, function (err) {
            console.trace(err.message);
        });


        mkdirp('./public', function (err) {
        });
        fs.appendFile('./public/user-street-holes-report.log', JSON.stringify(userStreetHoleReport, replacer) + '\n', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('file user-street-holes-report was modified !');
            }
        });

        res.status(200).json({
            message: 'UserStreetHoleReport instance was created successfuly',
            UserStreetHoleReport: userStreetHoleReport
        });

    });


function makeId() {
    var _Id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++)
        _Id += possible.charAt(Math.floor(Math.random() * possible.length));
    return _Id;
}

module.exports = router;
