/**
 * Created by Adam on 03/03/2016.
 */

var _ = require('lodash');
var csv = require('csv-parser');
var fs = require('fs');
var store = require('./output-manager');
var format = require('./format-line').doFormatEN;
var gateways   = require('./gateway-interfaces');

var startTime = new Date();
var source, directory, destination;

function init (inputType, outputType, dir){
  "use strict";

  directory = dir || '.';
  if (gateways.hasOwnProperty(inputType)) {
    source = new gateways[inputType]();
  }
  else {
    source = new gateways.Stripe();
  }
  // TODO: destination could be something other than Engaging Networks
  // destination = outputType || 'EngagingNetworks';
  destination = 'EngagingNetworks' || outputType;

  fs.createReadStream('./sampledata/paypal.csv')
    .pipe(csv({
      raw: false,                    // do not decode to utf-8 strings
      separator: source.separator,   // specify optional cell separator
      trim: true,                   // avoid whitespace after delimiter
      quote: '"',                    // specify optional quote character
      escape: '"',                   // specify optional escape character (defaults to quote value)
      newline: '\n'                  // specify a newline character
    }))
    .on('data', function (data) {
      // pass data in a sanitised & expected format to out line writer
      console.log(data);
      store.storeLine(format(source, data));
    })
    .on('end', function () {
      // GetOutputs ends all the writable streams then executes a callback
      store.getOutputs(function (array) {
        // Callback issues feedback to STDOUT
        console.log('\nCup is Complete!\n- took ' +
          (new Date() - startTime) / 1000 +
          ' second(s)\n- ' + array.length + ' files created:');

        // Callback called with array of file paths, print all to STDOUT
        _.each(array, function (x) {
          console.log(x);
        });
      });
    });
}
module.exports = {
  init : init
};