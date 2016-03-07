/**
 * Created by Adam on 03/03/2016.
 */
var csvWriter = require('csv-write-stream');

var fs = require('fs');
var _ = require('lodash');
var path = require('path');

var outputs = {};
var fileList = [];
var accounts;


/*  ------------------ Input and store ---------------- */
function storeLine(data, directory, gateway) {
  "use strict";
  if (data.hasOwnProperty('dataType')) {
    if (outputs.hasOwnProperty(data.dataType) && data.content.donationAmount > 0) {
      outputs[data.dataType].value  += parseInt(data.content.donationAmount,10);
      outputs[data.dataType].length += parseInt(1, 10);
      outputs[data.dataType].file.write(data.content);

      accountingWriter(data.raw, directory, gateway);
    } else if(data.content.donationAmount <= 0) {
      accountingWriter(data.raw, directory, gateway);
      return null;
    } else {
      createOutput(data.dataType,directory, data, gateway);
    }
  }
  return null;
}
function createOutput(name,directory, data, gateway){
  "use strict";
  // Should be a stream not an array
  var writer = csvWriter(),
    filePath = path.join(directory, name+'.csv');
  writer.pipe(fs.createWriteStream(filePath));
  fileList.push(filePath);
  outputs[name] = {
    name : name,
    file : writer,
    location: filePath,
    length: 0,
    value: 0
  };
  storeLine(data, directory, gateway);
}

/*  ------------------ Output from store ---------------- */
function getOutputs(done) {
  "use strict";
  if (Object.keys(outputs).length === 0) {
    return "No data";
  }
  _.forEach(outputs, function(out) {
    out.file.end();
    out.file = "";
  });
  // TODO: Make callback run last somehow
  done(fileList);
}
/*  ------------------ Accounting Raw File ---------------- */
function accountingWriter(data, dir, gateway) {
  "use strict";
  if (!accounts){
    accounts = csvWriter();
    var filePath = path.join(dir, '00-'+gateway+'-accounts-raw.csv')
    accounts.pipe(fs.createWriteStream(filePath));
    accountingWriter(data, dir, gateway);
  }
  else{
    accounts.write(data);
  }
}
function accountingEnd(){
  accounts.end();
}
/*  ------------------ Output Summary File ---------------- */
function writeSummary(source, directory) {
  "use strict";

  var writer = csvWriter(),
    filePath = path.join(directory, '00-'+source.name+'-summary.csv'),
    totalVal = 0, totalCount = 0;
  writer.pipe(fs.createWriteStream(filePath));
  _.forEach(outputs, function(out) {
    totalCount += parseInt(out.length,10);
    totalVal += parseInt(out.value,10);
    writer.write({
      "Source": source.name,
      "Name"  : out.name,
      "Transaction Count" : out.length,
      "Transactions Value": out.value,
      "Average Value"     : (out.value / out.length || 0).toFixed(2)
    });
  });
  writer.write({
    "Source": source.name,
    "Name"  : "Total",
    "Transaction Count" : totalCount,
    "Transactions Value": totalVal,
    "Average Value"     : (totalVal / totalCount || 0).toFixed(2)
  });
  writer.end();
}

module.exports = {
  storeLine : storeLine,
  getOutputs: getOutputs,
  writeSummary: writeSummary,
  writeAccounts: accountingEnd
};
