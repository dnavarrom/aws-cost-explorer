# aws-cost-explorer


Simple AWS Cost Explorer API Implementation

## Installation

`npm install aws-cost-explorer`


## AWS Account Configuration

This module requires an AWS Key Pair and access to AWS Cost Explorer API (ce). Example policy to attach:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ce:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

source : [Billing And Cost Management](http://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/billing-permissions-ref.html) Example 12

## Usage

```
var CostExplorer = require('aws-cost-explorer');
var ce = CostExplorer();

ce.getMonthToDateCosts(null, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.dir(data, { depth: null });
    }
});
```

### Passing AWS Configuration Options

```
var config = { 
    apiVersion: '2017-10-25',
    accessKeyId : 'AKIAJVCSKEY3SAMPLE',
    secretAccessKey : 'yWKUsVwtaXnssdGBeEVGPSAMPLE9hZuz9SAMPLE',
    region : 'us-east-1'
}

var CostExplorer = require('aws-cost-explorer');
var ce = CostExplorer(config);

ce.getMonthToDateCosts(null, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.dir(data, { depth: null });
    }
});
```


### Automatic Configuration from /config/default.json file

aws-cost-explorer uses [config](https://www.npmjs.com/package/config) module to automatically load aws config keys an values from [_dirname](https://nodejs.org/docs/latest/api/modules.html#modules_dirname)/config folder

```
var CostExplorer = require('aws-cost-explorer');
var ce = CostExplorer();

ce.getMonthToDateCosts(null, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.dir(data, { depth: null });
    }
});
```

Sample default.json file located in _dirname/config folder

```
{
    "AWS": {
        "CostExplorer" : {
            "apiVersion" : "2017-10-25",
            "accessKeyId" : "AKIAJV1111SSDDDY73NTTEBVXQ",
            "secretAccessKey" : "yWKUsVwtaXnASDqwe1232312L9DI9hZuz9Gp6cEXB",
            "region" : "us-east-1"
        }

    }
}

```


### Available Methods

#### getMonthToDateCosts(opts, callback) 

#### getTodayCosts(opts, callback)      

#### getLastMonthCosts(opts, callback)  

#### getYearToDateCosts(opts, callback) 

#### getTags(opts, callback) 

#### getCostForADay(date, opts, callback)

### Parameters

#### opts (optional)


```
opts = {
    granularity : "MONTHLY" | "DAILY" | "HOURLY",
    metrics : "BlendedCost" | "UnblendedCost",
    groupBy : [
      {
        'Type': 'TAG',
        'Key': 'MyTagName' 
      }
    ]
}
```
### Response Data

```
{
	ResultsByTime: [{
		TimePeriod: {
			Start: '2017-11-01',
			End: '2017-11-30'
		},
		Total: {
			BlendedCost: {
				Amount: '4066.1336704447',
				Unit: 'USD'
			}
		},
		Groups: [],
		Estimated: false
	}],
    Total: {
        Amount: 4066, 
        Unit: 'USD'
    }
}
```

## Tests

`npm tests`

## Samples


* Sample [Rest API](https://github.com/dnavarrom/aws-cost-explorer-api) using Express

* Sample [Grafana Backend](https://github.com/dnavarrom/grafana-aws-cost-explorer-backend) using [Simple Json Datasource Plugin](https://grafana.com/plugins/grafana-simple-json-datasource/installation)

## Changelog

1.1.2 
* Add GetTags method support
* Update reference to Grafana Backend Demo
1.1.1 First Release

