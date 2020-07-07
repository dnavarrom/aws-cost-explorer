/**
 * @file Library Details
 * @author Diego Navarro M.
 * @see <a href="https://github.com/dnavarrom/aws-cost-explorer">AWS Cost Explorer Library</a>
 */

/**
 * @module CostExplorer
 */

var method = CostExplorer.prototype;

//init
var _ = require("underscore");
var moment = require("moment");
var AWS = require('aws-sdk');
var awsCostExplorer;
var hasConfigError = false;

/**
 * Initialization Method
 * @param {Object} config
 */
function CostExplorer(config) {
    validateAwsObjectConfig(config, function (error, data) {
        if (error) {
            console.log(error);
            hasConfigError = true;
        } else {
            awsCostExplorer = new AWS.CostExplorer(config);
            hasConfigError = false;
        }
    });
};


/**
 * @func getCostForADay
 * @desc Get cost for a specific day
 * @param {Date} date of the costs
 * @param {Object} opts Option object
 * @param {string} [opts.metrics = BlendedCosts] Metric Alternatives "BlendedCost | UnblendedCost"
 * @param {string} [opts.granularity = MONTHLY] Alternatives "MONTHLY | DAILY | HOURLY"
 * @param {string} [opts.groupBy = null] used to group by tags example : opts.groupBy = [ { 'Type' : 'TAG', 'Key' : 'MyTagName'}]
 * @param {callback} Callback function
 */
method.getCostForADay = function (date, opts, callback) {

    if (hasConfigError) {
        console.log("ERROR : Invalid configuration loaded");
        return callback("ERROR : Invalid configuration loaded", null);
    }

    var StartDate = moment(date).format('YYYY-MM-DD');
    var EndDate = moment(date).add(1, 'd').format('YYYY-MM-DD');
    var metrics = opts && opts.metrics ? opts.metrics : "BlendedCost";
    var granularity = opts && opts.granularity ? opts.granularity : "DAILY";
    var groupBy = opts && opts.groupBy ? opts.groupBy : null;

    var costParams = {
        TimePeriod: {
            End: EndDate,
            /* required */
            Start: StartDate /* required */
        },
        Granularity: granularity,
        Metrics: [metrics],
        GroupBy: groupBy
    }

    awsCostExplorer.getCostAndUsage(costParams, function (err, data) {

        if (err) {
            console.log(err, err.stack); // an error occurred
            return callback(err, null);
        } else {
            return callback(null, getAggregatedCosts(data, metrics));
        }
    });
}

/**
 * @func getTodayCosts
 * @desc Get TodayCosts
 * @param {Object} opts Option object
 * @param {string} [opts.metrics = BlendedCosts] Metric Alternatives "BlendedCost | UnblendedCost"
 * @param {string} [opts.granularity = MONTHLY] Alternatives "MONTHLY | DAILY | HOURLY"
 * @param {string} [opts.groupBy = null] used to group by tags example : opts.groupBy = [ { 'Type' : 'TAG', 'Key' : 'MyTagName'}]
 * @param {callback} Callback function
 */
method.getTodayCosts = function (opts, callback) {
    return method.getCostForADay(new Date(), opts, callback);
}

/**
 * @func getMonthToDateCosts
 * @desc Get Month To Date Costs
 * @param {Object} opts Option object
 * @param {string} [opts.metrics = BlendedCosts] Metric Alternatives "BlendedCost | UnblendedCost"
 * @param {string} [opts.granularity = MONTHLY] Alternatives "MONTHLY | DAILY | HOURLY"
 * @param {string} [opts.groupBy = null] used to group by tags example : opts.groupBy = [ { 'Type' : 'TAG', 'Key' : 'MyTagName'}]
 * @param {callback} Callback function
 */
method.getMonthToDateCosts = function (opts, callback) {

    if (hasConfigError) {
        console.log("ERROR : Invalid configuration loaded");
        return callback("ERROR : Invalid configuration loaded", null);
    }

    var date = new Date();

    var StartDate = moment().startOf('month').format('YYYY-MM-DD');
    var EndDate = moment(date).add(1, 'd').format('YYYY-MM-DD');
    var metrics = opts && opts.metrics ? opts.metrics : "BlendedCost";
    var granularity = opts && opts.granularity ? opts.granularity : "MONTHLY";
    var groupBy = opts && opts.groupBy ? opts.groupBy : null;

    var costParams = {
        TimePeriod: {
            End: EndDate,
            /* required */
            Start: StartDate /* required */
        },
        Granularity: granularity,
        Metrics: [metrics],
        GroupBy: groupBy
    }

    awsCostExplorer.getCostAndUsage(costParams, function (err, data) {

        if (err) {
            console.log(err, err.stack); // an error occurred
            return callback(err, null);
        } else {
            return callback(null, getAggregatedCosts(data, metrics));
        }
    });

}

/**
 * @func getLastMonthCosts
 * @desc Get Last Month Costs
 * @param {Object} opts Option object
 * @param {string} [opts.metrics = BlendedCosts] Metric Alternatives "BlendedCost | UnblendedCost"
 * @param {string} [opts.granularity = MONTHLY] Alternatives "MONTHLY | DAILY | HOURLY"
 * @param {string} [opts.groupBy = null] used to group by tags example : opts.groupBy = [ { 'Type' : 'TAG', 'Key' : 'MyTagName'}]
 * @param {callback} Callback function
 */
method.getLastMonthCosts = function (opts, callback) {

    if (hasConfigError) {
        console.log("ERROR : Invalid configuration loaded");
        return callback("ERROR : Invalid configuration loaded", null);
    }

    var date = new Date();

    var EndDate = moment(date).subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    var StartDate = moment(date).subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
    var metrics = opts && opts.metrics ? opts.metrics : "BlendedCost";
    var granularity = opts && opts.granularity ? opts.granularity : "MONTHLY";
    var groupBy = opts && opts.groupBy ? opts.groupBy : null;

    var costParams = {
        TimePeriod: {
            End: EndDate,
            /* required */
            Start: StartDate /* required */
        },
        Granularity: granularity,
        Metrics: [metrics],
        GroupBy: groupBy
    }

    awsCostExplorer.getCostAndUsage(costParams, function (err, data) {

        if (err) {
            console.log(err, err.stack); // an error occurred
            return callback(err, null);
        } else {
            return callback(null, getAggregatedCosts(data, metrics));
        }
    });


}

/**
 * @func getYearToDateCosts
 * @desc Get Year To Date Costs
 * @param {Object} opts Option object
 * @param {string} [opts.metrics = BlendedCosts] Metric Alternatives "BlendedCost | UnblendedCost"
 * @param {string} [opts.granularity = MONTHLY] Alternatives "MONTHLY | DAILY | HOURLY"
 * @param {string} [opts.groupBy = null] used to group by tags example : opts.groupBy = [ { 'Type' : 'TAG', 'Key' : 'MyTagName'}]
 * @param {callback} Callback function
 */
method.getYearToDateCosts = function (opts, callback) {

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
    var groupBy = opts && opts.groupBy ? opts.groupBy : null;

    var costParams = {
        TimePeriod: {
            End: EndDate,
            /* required */
            Start: StartDate /* required */
        },
        Granularity: granularity,
        Metrics: [metrics],
        GroupBy: groupBy
    }

    awsCostExplorer.getCostAndUsage(costParams, function (err, data) {

        if (err) {
            console.log(err, err.stack); // an error occurred
            return callback(err, null);
        } else {
            return callback(null, getAggregatedCosts(data, metrics));
        }
    });


}



/**
 * @func getTags
 * @desc Get configured Tags for specific period
 * @param {Object} opts Option object
 * @param {string} [opts.startDate = date] Start date for search query, default first day of current year
 * @param {string} [opts.endDate = date]   End date for search query, default last day of current month
 * @param {string} [opts.tagKey = null]    Tags Values for specific tag, default=null returns only tag names not values
 * @param {string} [opts.searchString = null]    Search for specific string inside all tags, default=null will ignore this parameter
 * @param {string} [opts.nextPageToken = null]   used for pagination, send this when reach page limit
 * @param {callback} Callback function (err, data) see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#getTags-property
 *
 */
method.getTags = function (opts, callback) {

    if (hasConfigError) {
        console.log("ERROR : Invalid configuration loaded");
        return callback("ERROR : Invalid configuration loaded", null);
    }

    console.log(opts);
    var date = new Date();

    var EndDate = opts && opts.endDate ? opts.endDate : moment(date).endOf('month').format('YYYY-MM-DD');
    var StartDate = opts && opts.startDate ? opts.startDate : moment(date).startOf('year').startOf('month').format('YYYY-MM-DD');
    var tagKey = opts && opts.tagKey ? opts.tagKey : null;
    var searchString = opts && opts.searchString ? opts.searchString : null;
    var nextPageToken = opts && opts.nextPageToken ? opts.nextPageToken : null;

    var costParams = {
        TimePeriod: {
            End: EndDate,
            /* required */
            Start: StartDate /* required */
        },
        SearchString: searchString,
        TagKey: tagKey,
        NextPageToken: nextPageToken
    }

    awsCostExplorer.getTags(costParams, function (err, data) {

        if (err) {
            console.log(err, err.stack); // an error occurred
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });


}


//private

function getAggregatedCosts(data, metrics) {
    var sum = 0;
    var unit = 'USD';
    var group = false;

    if (data.GroupDefinitions) {
        group = true;
    }

    //console.dir(data, {depth:null});
    Object.keys(data.ResultsByTime).forEach(function (key) {

        if (group) {
            Object.keys(data.ResultsByTime[key].Groups).forEach(function (keygroup) {
                if (metrics == "BlendedCost") {
                    sum = sum + parseFloat(data.ResultsByTime[key].Groups[keygroup].Metrics.BlendedCost.Amount);
                } else {
                    sum = sum + parseFloat(data.ResultsByTime[key].Groups[keygroup].Metrics.UnblendedCost.Amount);
                }
            });
        } else {
            if (metrics == "BlendedCost")
                sum = sum + parseFloat(data.ResultsByTime[key].Total.BlendedCost.Amount);
            else
                sum = sum + parseFloat(data.ResultsByTime[key].Total.UnblendedCost.Amount);

            unit = data.ResultsByTime[key].Total.BlendedCost.Unit;
        }
    });

    data.Total = {
        "Amount": sum,
        "Unit": unit
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
