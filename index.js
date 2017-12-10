process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

var awsCostExp = require("./lib/CostExplorer.js");
var configuration = require('config');


module.exports = function (config) {

    if (!config) {

        console.log("AWS Cost Explorer Init.. using configuration file from ./config folder")

        if (!configuration.has('AWS')) {
            console.log("Config Key AWS not found!!");
        }

        if (!configuration.has('AWS.CostExplorer')) {
            console.log("Config Key AWS not found!!");
        }

        if (configuration.has('AWS.CostExplorer')) {
            config = configuration.get("AWS.CostExplorer");
        }

    }
    else {
        console.log("AWS Cost Explorer Init.. using constructor configuration object")
    }


    var ace = new awsCostExp(config);
    return ace;

}
