const express = require('express');
// get an instance of the express Router
var router = express.Router();

/*
 * ElasticSearch Client
 */
var elasticClient = require('../lib/elastic');
var client = elasticClient.ElasticClient().getInstance();

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
    res.status(200).json({message: 'Street Holes Elastic API is running !', Status: "green"});
});
//create Log line comming from IntroMobilePage::Web-User
router.route('/holes/nearby')

// create a IntroWebUserLog (accessed at POST http://localhost:8080/api/introwebuserlogs)
    .post(function (req, res) {
        // create a new instance of the IntroWebUserLog model
        client.search({
            index: 'street-holes',
            type: 'report',
            body: {
                "query": {
                    "bool": {
                        "must": {"match_all": {}},
                        "filter": {
                            "geo_distance": {
                                "distance": req.body.radius + "km",
                                "location": {
                                    "lat": req.body.lat,
                                    "lon": req.body.lon
                                }
                            }
                        }
                    }
                }
            }
        }).then(function (resp) {
            var hits = resp.hits.hits;
            res.status(200).json({
                message: 'holes',
                holes: hits
            });
        }, function (err) {
            console.trace(err.message);
        })
    });

module.exports = router;
