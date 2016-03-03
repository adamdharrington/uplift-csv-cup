/**
 * Created by Adam on 03/03/2016.
 */

var csv = require('csv-parser');
var fs = require('fs');
var store = require('./output-manager');
var format = require('./format-line').doFormatEN;


fs.createReadStream('./sampledata/stripe2.csv')
  .pipe(csv({
    raw: false,       // do not decode to utf-8 strings
    separator: ',',   // specify optional cell separator
    quote: '"',       // specify optional quote character
    escape: '"',      // specify optional escape character (defaults to quote value)
    newline: '\n'     // specify a newline character
  }))
  .on('data', function(data){
    "use strict";
    // TODO: Handle individual lines
    store.storeLine(format(data));
  })
  .on('end', function(){
    "use strict";
    // TODO: Handle individual lines
    store.getOutputs(function(){
      console.log('Complete');
    });
  });