var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserStreetHoleReport = new Schema({
    clientId: String,
    location: {
        lat: Number,
        lon: Number
    },
    locality: String,
    address: String,
    timestamp: String
});

module.exports = mongoose.model('UserStreetHoleReport', UserStreetHoleReport);