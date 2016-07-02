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
var _ = require('lodash');


function formatEN (source, transaction){
  "use strict";
  var output = {
    transactionDate  : dateFormat(source.getDate(transaction), 'isoDate'),
    donationAmount   : source.getAmount(transaction),
    currency         : source.getCurrency(transaction),
    email            : source.getEmail(transaction),
    paymentType      : source.getPaymentType(transaction)
  };
  return output;
}
function formatRaw (source, transaction, formatted){
  "use strict";
  return _.extend(
    {
      "date": formatted.transactionDate
    },
    source.getRaw(transaction, formatted)
  )
}

function doFormat (source, transaction){
  "use strict";
  var output = {};
  if (!source) throw new Error('No valid input type specified', "Err: 001");
  transaction = _.merge({}, transaction, source.cleanData(transaction));
  output.dataType = source.getType(transaction);
  output.content  = formatEN(source, transaction);
  output.raw  = formatRaw(source, transaction, output.content);
  return output;
}

module.exports = {
  doFormatEN : doFormat
};
