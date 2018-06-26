const crawler = require('./src/crawler');
const chargeFactory = require('./src/chargeFactory');
const OFXPrinter = require('./src/OFXPrinter');
const fs = require('fs');
const aguid = require('aguid');

(async () => {
  const username = '';
  const data = await crawler.crawl(username, '');
  const charges = chargeFactory.buildCharges(data);
  const bankStatement = OFXPrinter
    .print(charges, new Date(), aguid(username), 0.0);
  
  fs.writeFileSync('./bank-statement.ofx', bankStatement);
})();
