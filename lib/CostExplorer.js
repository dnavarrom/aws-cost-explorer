var method = CostExplorer.prototype;

//init
var _ = require("underscore");
var moment = require("moment");
var AWS = require('aws-sdk');
var awsCostExplorer;
var hasConfigError = false;

//constructor
function CostExplorer(config) {
    validateAwsObjectConfig(config, function(error, data) {
        if (error) {
            console.log(error);
            hasConfigError = true;
        }
        else
        {
            awsCostExplorer= new AWS.CostExplorer(config);
            hasConfigError = false;
        }
    });
};



/**
 * Get Today Costs
 * @param {opts} object Optional { granularity : "MONTHLY" | "DAILY", metrics : "BlendedCost" | "UnblendedCost" }
 * @param {callback} Callback function
 */
method.getTodayCosts = function(opts, callback) {

    if (hasConfigError) {
        console.log("ERROR : Invalid configuration loaded");
        return callback("ERROR : Invalid configuration loaded", null);
    }

    var date = new Date();
    var StartDate = moment(date).format('YYYY-MM-DD');
    var EndDate = moment(date).add(1,'d').format('YYYY-MM-DD');
    var metrics = opts && opts.metrics ? opts.metrics : "BlendedCost";
    var granularity = opts && opts.granularity ? opts.granularity : "DAILY";
    
    var costParams =  {
        TimePeriod: {
            End: EndDate, /* required */
            Start: StartDate /* required */
        },
        Granularity: granularity,
        Metrics: [metrics]
      }
      
    awsCostExplorer.getCostAndUsage(costParams, function(err, data) {
    
        if (err) { 
            console.log(err, err.stack); // an error occurred
            return callback(err, null);
        }
        else {
            return callback(null, getAggregatedCosts(data,metrics)); 
        }
    });
}

/**
 * Get Month To Date Costs
 * @param {opts} object Optional { granularity : "MONTHLY" | "DAILY", metrics : "BlendedCost" | "UnblendedCost" }
 * @param {callback} Callback function
 */
method.getMonthToDateCosts = function(opts, callback) {

    if (hasConfigError) {
        console.log("ERROR : Invalid configuration loaded");
        return callback("ERROR : Invalid configuration loaded", null);
    }

    var date = new Date();

    var StartDate = moment().startOf('month').format('YYYY-MM-DD');
    var EndDate = moment(date).add(1,'d').format('YYYY-MM-DD');
    var metrics = opts && opts.metrics ? opts.metrics : "BlendedCost";
    var granularity = opts && opts.granularity ? opts.granularity : "MONTHLY";

    var costParams =  {
        TimePeriod: {
            End: EndDate, /* required */
            Start: StartDate /* required */
        },
        Granularity: granularity,
        Metrics: [metrics]
      }

    awsCostExplorer.getCostAndUsage(costParams, function(err, data) {
    
        if (err) { 
            console.log(err, err.stack); // an error occurred
            return callback(err, null);
        }
        else {
            return callback(null, getAggregatedCosts(data,metrics));  
        }
    });

}

/**
 * Get Last Month Costs
 * @param {opts} object Optional { granularity : "MONTHLY" | "DAILY", metrics : "BlendedCost" | "UnblendedCost" }
 * @param {callback} Callback function
 */
method.getLastMonthCosts = function(opts, callback) {

    if (hasConfigError) {
        console.log("ERROR : Invalid configuration loaded");
        return callback("ERROR : Invalid configuration loaded", null);
    }

    var date = new Date();

    var EndDate = moment(date).subtract(1,'months').endOf('month').format('YYYY-MM-DD');
    var StartDate = moment(date).subtract(1,'months').startOf('month').format('YYYY-MM-DD');
    var metrics = opts && opts.metrics ? opts.metrics : "BlendedCost";
    var granularity = opts && opts.granularity ? opts.granularity : "MONTHLY";

    var costParams =  {
        TimePeriod: {
            End: EndDate, /* required */
            Start: StartDate /* required */
        },
        Granularity: granularity,
        Metrics: [metrics]
      }

    awsCostExplorer.getCostAndUsage(costParams, function(err, data) {
    
        if (err) { 
            console.log(err, err.stack); // an error occurred
            return callback(err, null);
        }
        else {
            return callback(null, getAggregatedCosts(data,metrics)); 
        }
    });


}

/**
 * Get Year To Date  Costs
 * @param {opts} object Optional { granularity : "MONTHLY" | "DAILY", metrics : "BlendedCost" | "UnblendedCost" }
 * @param {callback} Callback function
 */
method.getYearToDateCosts = function(opts, callback) {
    
        if (hasConfigError) {
            console.log("ERROR : Invalid configuration loaded");
            return callback("ERROR : Invalid configuration loaded", null);
        }
    
        console.log(opts);
        var date = new Date();
    
        var EndDate = moment(date).endOf('month').format('YYYY-MM-DD');
        var StartDate = moment(date).startOf('year').startOf('month').format('YYYY-MM-DD');
        var metrics = opts && opts.metrics ? opts.metrics : "BlendedCost";
        var granularity = opts && opts.granularity ? opts.granularity : "MONTHLY";
    
        var costParams =  {
            TimePeriod: {
                End: EndDate, /* required */
                Start: StartDate /* required */
            },
            Granularity: granularity,
            Metrics: [metrics]
          }
    
        awsCostExplorer.getCostAndUsage(costParams, function(err, data) {
        
            if (err) { 
                console.log(err, err.stack); // an error occurred
                return callback(err, null);
            }
            else {    
                return callback(null, getAggregatedCosts(data, metrics)); 
            }
        });
    
    
    }


//private

function getAggregatedCosts(data, metrics) {
    var sum = 0;
    var unit = 'USD';

    Object.keys(data.ResultsByTime).forEach(function(key) {
        if (metrics == "BlendedCost") 
            sum = sum + parseInt(data.ResultsByTime[key].Total.BlendedCost.Amount);
        else 
            sum = sum + parseInt(data.ResultsByTime[key].Total.UnblendedCost.Amount);

        unit = data.ResultsByTime[key].Total.BlendedCost.Unit;
      });
    
    data.Total = {
        "Amount" : sum,
        "Unit" : unit
    };

    return data;

}


function validateAwsObjectConfig(object, callback) {

    if (!_.has(object, "apiVersion")) {
        return callback("AWS Config Object Validation error, need apiVersion key", false);
    }

    if (!_.has(object, "accessKeyId")) {
        return callback("AWS Config Object Validation error, need accessKeyId key", false);
    }
    
    if (!_.has(object, "secretAccessKey")) {
        return callback("AWS Config Object Validation error, need secretAccessKey key", false);
    }
    
    if (!_.has(object, "region")) {
        return callback("AWS Config Object Validation error, need region key", false);
    }
    
    return callback(null, true);
    
}

module.exports = CostExplorer;