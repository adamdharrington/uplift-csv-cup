/**
 * Created by Adam on 04/03/2016.
 * - A set of classes to allow dumb processes convert from unknown source input
 * - static methods convert into a standard known output
 * - methods expected are:
 *   * name
 *   * separator
 *   * getType
 *   * getCurrency
 *   * getAmount
 *   * getDate
 *   * getEmail
 *   * getPaymentType
 */


var validator = require('validator');

var Stripe = function(){
  "use strict";

  var $_this = this;
  $_this.name = "Stripe";

  function calculateAmount (transaction) {
    var _amount = 0;

    if (transaction.hasOwnProperty('Converted Amount Refunded')) {
      _amount = transaction['Amount'] - transaction['Converted Amount Refunded'];
    }
    return _amount ? _amount : 0;
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
    var type = $_this.name.toLowerCase() +'-',
      des1 = transaction['Description'] || null,
      des2 = transaction['Customer Description'] || null,
      rec  = transaction['Invoice ID'] || null,
      cust  = transaction['Customer ID'] || null;
    if (des1) {
      type += 'single-'+simplifyDescription(des1);
    }
    else if (rec && des2){
      type += 'recurring-'+simplifyDescription(des2);
    }
    else if (rec && cust) {
      type += 'recurring-unknown';
    }
    else {
      type += 'unknown';
    }
    return type;
  }
  function getCurrency(transaction) {
    return transaction['Currency'].toUpperCase();
  }

  return {
    name   : $_this.name,
    separator : ",",
    getType: getTransactionType,
    getCurrency: getCurrency,
    getAmount : calculateAmount,
    getDate: makeDate,
    getEmail : getEmail,
    getPaymentType : getPaymentType
  };
};

var PayPal = function(){
  "use strict";

  var $_this = this;
  $_this.name = "PayPal";

  function calculateAmount (transaction) {
    var _amount = 0;

    if (transaction.hasOwnProperty(' Gross')) {
      _amount = transaction[' Gross'];
    }
    return _amount ? _amount : 0;
  }

  function getCurrency(transaction) {
    return transaction[' Currency'].toUpperCase();
  }
  function makeDate (transaction) {
    var dd = transaction['Date'].substr(0,2),
      mm = transaction['Date'].substr(3,2),
      yyyy = transaction['Date'].substr(6,4);
    return new Date(yyyy+"-"+mm+"-"+dd+" 20:08");
  }

  function getEmail (transaction) {
    var email = 'tech+unknownemail@uplift.ie', _email;
    if (transaction.hasOwnProperty(' From Email Address')) {
      _email = transaction[' From Email Address'] || "";
      if (validator.isEmail(_email)) {
        // nice sanitiser
        email = validator.normalizeEmail(_email);
      }
    }
    return email;
  }

  function getPaymentType (transaction) {
    return 'paypal';
  }
  function simplifyDescription(str) {
    var _str = validator.trim(validator.escape(str)).toLowerCase();
    return _str.replace(/[\s(<>{}\\\/)]+|&.*;/g, "-");
  }

  function getTransactionType(transaction){
    var type = $_this.name.toLowerCase() +'-',
      des1 = transaction[' Type'] || null;
    if (des1 === "Donation Received") {
      type += 'single-'+simplifyDescription(des1);
    }
    else {
      type += 'unknown';
    }
    return type;
  }

  return {
    name : $_this.name,
    separator : ",",
    getType: getTransactionType,
    getCurrency : getCurrency,
    getAmount : calculateAmount,
    getDate: makeDate,
    getEmail : getEmail,
    getPaymentType : getPaymentType
  };
};

module.exports = {
  Stripe : Stripe,
  PayPal : PayPal
};