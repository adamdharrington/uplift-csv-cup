/**
 * Created by Adam on 03/03/2016.
 */

var _ = require('lodash');
var csv = require('csv-parser');
var fs = require('fs');
var store = require('./output-manager');
var format = require('./format-line').doFormatEN;
var gateways   = require('./gateway-interfaces');

function init (inputType, outputType, dir, file, callback){
  "use strict";
  var startTime = new Date();
  var source, directory, destination, inputFile;
  //var inputType = "Stripe", outputType = "Engaging Networks";
  directory = dir  || '/';
  inputFile = file || './sampledata/stripe.csv';
  if (gateways.hasOwnProperty(inputType)) {
    source = new gateways[inputType]();
  }
  else {
    source = new gateways.Stripe();
  }
  // TODO: destination could be something other than Engaging Networks
  // destination = outputType || 'EngagingNetworks';
  destination = 'Engaging Networks' || outputType;

  fs.createReadStream(inputFile)
    .pipe(csv({
      raw: false,                    // do not decode to utf-8 strings
      separator: source.separator,   // specify optional cell separator
      trim: true,                    // avoid whitespace after delimiter
      quote: '"',                    // specify optional quote character
      escape: '"',                   // specify optional escape character (defaults to quote value)
      newline: '\n'                  // specify a newline character
    }))
    .on('data', function (data) {
      // pass data in a sanitised & expected format to out line writer
      store.storeLine(format(source, data), directory, inputType);
    })
    .on('end', function () {

      store.writeSummary(source, directory);

      // GetOutputs ends all the writable streams then executes a callback
      if (callback) {
        store.getOutputs(callback);
      }
      else {
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
      }
      store = "";
      this.end();
    });
}

module.exports = init;
