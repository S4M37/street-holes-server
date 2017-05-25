module.exports = {
    ElasticClient: function () {
        var elasticClient;

        function createInstance() {
            var elasticsearch = require('elasticsearch');
            return new elasticsearch.Client({
                host: 'http://elastic:changeme@ec2-52-209-159-7.eu-west-1.compute.amazonaws.com:9200/',
                log: 'trace'
            });
        }

        return {
            getInstance: function () {
                if (!elasticClient) {
                    elasticClient = createInstance();
                }
                if (!elasticClient) {
                    console.log("elasticClient is Null");
                } else {
                    console.log("elasticClient is Setted");
                }
                return elasticClient;
            }
        };
    }
};

 