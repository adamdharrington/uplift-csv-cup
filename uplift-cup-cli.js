#!/usr/bin/env node
/**
 * Created by Adam on 04/03/2016.
 */


var source, outputDir, outputType, inputFile;
// Get Args
source = process.argv[2] ? process.argv[2] : "Stripe";
outputType = process.argv[3] ? process.argv[3] : "Engaging Networks";
inputFile = process.argv[4] ? process.argv[4] : null;
outputDir = process.argv[5] ? process.argv[5] : './sampledata';

require('./app/csv-reader')(source, outputType, outputDir, inputFile, function onComplete(array){
  "use strict";
  process.stdout.write("Operation Complete");
});