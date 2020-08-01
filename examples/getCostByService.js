var config = { 
    apiVersion: '2017-10-25',
    accessKeyId : 'PUT_YOUR_KEY',
    secretAccessKey : 'PUT_YOUR_SECRET',
    region : 'us-east-1'
}

var CostExplorer = require('aws-cost-explorer');
var ce = CostExplorer(config);

//groupBy "Dimension" and "Service" instead default "Tag" grouping
var opts = {
    granularity : "MONTHLY",
    metrics : "BlendedCost" ,
    groupBy : [
        {
        "Type":"DIMENSION",
        "Key":"SERVICE"
        }
    ]
}

ce.getMonthToDateCosts(opts, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.dir(data, { depth: null });
    }
});