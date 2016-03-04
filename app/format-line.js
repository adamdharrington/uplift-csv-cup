/**
 * Created by Adam on 03/03/2016.
 * - Responsible for formatting a transaction for a particular output
 * - Apply date conversions
 * - Identify transaction type
 * - dump superfluous data
 * - Use dataType to identify transaction type
 * - Use content for formatted output
 */
var dateFormat = require('dateformat');


function formatEN (source, transaction){
  "use strict";
  // TODO: Store line in correct format
  var output = {
    transactionDate  : dateFormat(source.getDate(transaction), 'isoDate'),
    donationAmount   : source.getAmount(transaction),
    currency         : source.getCurrency(transaction),
    email            : source.getEmail(transaction),
    paymentType      : source.getPaymentType(transaction)
  };
  return output;
}

function doFormat (inputType, transaction){
  "use strict";
  var output = {};
  if (!inputType) throw new Error('No valid input type specified', "Err: 001");
  output.dataType = inputType.getType(transaction);
  output.content  = formatEN(inputType, transaction);
  return output;
}

module.exports = {
  doFormatEN : doFormat
};