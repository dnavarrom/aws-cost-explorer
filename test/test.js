'use strict';

var expect = require('chai').expect;
var ace = require('../index');



describe('#awsCostExplorer', function() {
    it('should return a cost explorer instance', function() {
        var costsApi = ace();
        expect(costsApi).not.null;
    });

    it('should fail due lack of configuration', function() {
        var costsApi = ace();
        costsApi.getLastMonthCosts(null, function(error, data){
            expect(error).not.null;
        });
    });

    it('should fail due invalid secretAccessKey configuration', function() {
        var config = { 
            apiVersion: '2017-10-25',
            accessKeyId : 'AKIAJVCSasasdKEY3SAMPLE',
            secretAccessKey : 'yWKUsVwtaXnssdGBeEVGPSAMPLE9hZuz9SAMPLE',
            region : 'us-east-1'
        }

        var costsApi = ace(config);
        costsApi.getLastMonthCosts(null, function(error, data){
            expect(error).not.null;
        });
    });

});


