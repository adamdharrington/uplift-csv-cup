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
var validator = require('validator');

var Stripe = (function(){
  "use strict";
  // A set of static methods to process the known input from Stripe exports into a standard format

  function calculateAmount (transaction) {
    var _amount = 0;

    if (transaction.hasOwnProperty('Converted Amount Refunded')) {
      _amount = Math.floor(transaction['Amount'] - transaction['Converted Amount Refunded']);
    }
    return _amount;
  }

  function makeDate (transaction) {
    return new Date(transaction['Created (UTC)']);
  }

  function getEmail (transaction) {
    var email = 'tech+unknownemail@uplift.ie', _email;
    if (transaction.hasOwnProperty('Customer Email') || transaction.hasOwnProperty('Card Address Line1')) {
      _email = transaction['Customer Email'] || transaction['Card Address Line1'] || "";
      if (validator.isEmail(_email)) {
        // nice sanitiser
        email = validator.normalizeEmail(_email);
      }
    }
    return email;
  }

  function getPaymentType (transaction) {
    return (transaction['Card Brand'] || "visa").toLowerCase();
  }
  function simplifyDescription(str) {
    var _str = validator.trim(validator.escape(str)).toLowerCase();
    return _str.replace(/[\s(<>{}\\\/)]+|&.*;/g, "-");
  }

  function getTransactionType(transaction){
    var type = "unknown",
      des1 = transaction['Description'] || null,
      des2 = transaction['Customer Description'] || null,
      rec  = transaction['Invoice ID'] || null;
    if (des1) {
      type = 'single-'+simplifyDescription(des1);
    }
    else if (rec && des2){
      type = 'recurring-'+simplifyDescription(des2);
    }
    else {
      type = 'recurring-unknown';
    }
    return type;
  }

  return {
    getType: getTransactionType,
    amount : calculateAmount,
    date: makeDate,
    email : getEmail,
    paymentType : getPaymentType
  };
})();

function formatEN (transaction){
  "use strict";
  // TODO: Store line in correct format
  var output = {
    transactionDate  : dateFormat(Stripe.date(transaction), 'isoDate'),
    donationAmount   : Stripe.amount(transaction),
    currency         : transaction['Currency'].toUpperCase(),
    email            : Stripe.email(transaction),
    paymentType      : Stripe.paymentType(transaction)
  };
  return output;
}

function doFormat (transaction){
  "use strict";
  var output = {};
  output.dataType = Stripe.getType(transaction);
  output.content = formatEN(transaction);
  return output;
}

module.exports = {
  doFormatEN : doFormat
};