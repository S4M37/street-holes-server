const express = require('express');
// get an instance of the express Router
var router = express.Router();
//filestream API: for managing files
var fs = require('fs');

var UserStreetHoleReport=require('../models/UserStreetHoleReport');

function replacer(key, value) {
    if (key == "_id") return undefined;
    else return value;
}

/*
 * ElasticSearch Client
 */
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'http://elastic:changeme@localhost:9200',
    log: 'trace'
});

client.ping({
    requestTimeout: 1000,
}, function (error) {
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Elasticsearch cluster is up');
    }
});

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
        userStreetHoleReport.timestamp=new Date();

        client.index({
            index: 'user-street-holes',
            id: makeId(),
            type: 'user-reports',
            body: userStreetHoleReport
        },function(err,resp,status) {
            console.log(resp);
        });

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


function makeId() {
    var _Id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++)
        _Id += possible.charAt(Math.floor(Math.random() * possible.length));
    return _Id;
}

module.exports = router;
