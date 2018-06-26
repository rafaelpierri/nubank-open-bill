const aguid = require('aguid');

var exports = module.exports;

Date.prototype.toOFXDate = function(){
  return this.getFullYear() +
    ("0" + (this.getMonth() + 1)).slice(-2) +
    ("0" + this.getDate()).slice(-2) +
    ("0" + this.getHours()).slice(-2) +
    ("0" + this.getMinutes()).slice(-2) +
    ("0" + this.getSeconds()).slice(-2) +
    "[" + this.getTimezoneOffset() / 60 * - 1 + ":GMT]";
}

function parseAmount(value) {
  return parseFloat(value.replace(/\./g, '').replace(/,/g, '.'));
}

function parseMonth(month) {
  switch (month) {
    case "JAN":
      return 0;
    case "FEV":
      return 1;
    case "MAR":
      return 2;
    case "ABR":
      return 3;
    case "MAI":
      return 4;
    case "JUN":
      return 5;
    case "JUL":
      return 6;
    case "AGO":
      return 7;
    case "SET":
      return 8;
    case "OUT":
      return 9;
    case "NOV":
      return 10;
    case "DEZ":
      return 11;
    default:
      return -1;
  }
}

function parseDate(value) {
  var values = value.replace(/\r?\n|\r/g, '').split(/\s+/);
  var day = values[0];
  var month = parseMonth(values[1]);
  var year = (new Date()).getFullYear();
  return new Date(year, month, day);
}

function parseType(amount) {
  return amount < 0.0 ? 'CREDIT' : 'DEBIT';
}

exports.buildCharge = function(element) {
  var amount = parseAmount(element.amount);
  var date = parseDate(element.time);
  return {
    amount: amount,
    date: date,
    displayDate: date.toOFXDate(),
    memo: element.description,
    type: parseType(amount),
    id: aguid(amount + date + element.description)
  };
}

exports.buildCharges = function(elements) {
  return elements.map(exports.buildCharge);
}
