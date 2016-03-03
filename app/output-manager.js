/**
 * Created by Adam on 03/03/2016.
 */
var csvWriter = require('csv-write-stream');

var fs = require('fs');
var _ = require('lodash');

var outputs = {};


/*  ------------------ Input and store ---------------- */
function storeLine(data) {
  "use strict";
  if (data.hasOwnProperty('dataType')) {
    if (outputs.hasOwnProperty(data.dataType)) {
      // should write to stream not push to array
      outputs[data.dataType].write(data.content);
    } else {
      createOutput(data.dataType, data);
    }
  }
  return null;
}
function createOutput(name, data){
  "use strict";
  // Should be a stream not an array
  var writer = csvWriter();
  writer.pipe(fs.createWriteStream('./sampledata/'+name+'-out.csv'));
  outputs[name] = writer;
  storeLine(data);
}

/*  ------------------ Output from store ---------------- */
function getOutputs(done) {
  "use strict";
  if (Object.keys(outputs).length === 0) {
    return "No data";
  }
  _.forEach(outputs, function(out) {
    // TODO: Process "out" and invoke file writer
    out.end();
  });
  // TODO: Make callback run last somehow
  done();
}


module.exports = {
  storeLine : storeLine,
  getOutputs: getOutputs
};