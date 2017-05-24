const express = require('express');
// get an instance of the express Router
var router = express.Router();
var fs = require('fs');
var mkdirp = require('mkdirp');

/*
 * ElasticSearch Client
 */
var elasticClient = require('../lib/elastic');
var client = elasticClient.ElasticClient().getInstance();


//api health
router.get('/', function (req, res) {
    res.status(200).json({message: 'Continuous Feedback API is running !', Status: "green"});
});
//create Log line comming from IntroMobilePage::Web-User
router.route('/broadcast')

// create a IntroWebUserLog (accessed at POST http://localhost:8080/api/introwebuserlogs)
    .post(function (req, res) {
        // create a new instance of the IntroWebUserLog model
        mkdirp('./public', function (err) {
        });
        fs.appendFile('./public/track-user-broadcast.log', JSON.stringify(req.body) + '\n', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('file track-user-broadcast was modified !');
            }
        });
        res.status(200).json({
            message: 'TrackUserBroadcast instance was created successfuly',
            UserStreetHoleReport: req.body
        });
    });

module.exports = router;
