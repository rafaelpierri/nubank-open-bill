const handlebars = require('handlebars');
const fs = require('fs');

Date.prototype.toOFXDate = function(){
  return this.getFullYear() +
    ("0" + (this.getMonth() + 1)).slice(-2) +
    ("0" + this.getDate()).slice(-2) +
    ("0" + this.getHours()).slice(-2) +
    ("0" + this.getMinutes()).slice(-2) +
    ("0" + this.getSeconds()).slice(-2) +
    "[" + this.getTimezoneOffset() / 60 * - 1 + ":GMT]";
}

function minimum(element, index, array){
  return array
    .map((arrayItem) => arrayItem >= element)
    .reduce((accumulator, value) => accumulator && value, true);
}

function maximum(element, index, array){
  return array
    .map((arrayItem) => arrayItem <= element)
    .reduce((accumulator, value) => accumulator && value, true);
}

module.exports.print = function(charges, dateTaken, accountId, balanceAmount) {

  const template = fs.readFileSync('src/templates/bank-statement.hbs', 'utf8');
  const bankStatementTemplate = handlebars.compile(template);

  var bankStatement = {};
  bankStatement.dateTaken = dateTaken;
  bankStatement.accountId = accountId;
  bankStatement.transactions = charges;
  lowestDate = charges.map((charge) => charge.date).find(minimum);
  bankStatement.startDate = lowestDate.toOFXDate();
  highestDate = charges.map((charge) => charge.date).find(maximum);
  bankStatement.endDate = highestDate.toOFXDate();
  bankStatement.balance = {};
  bankStatement.balance.amount = balanceAmount; 
  bankStatement.balance.dateAsOf = dateTaken.toOFXDate();

  return bankStatementTemplate(bankStatement);
}
