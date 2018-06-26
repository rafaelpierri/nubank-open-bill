const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var triggerAngularChange = function(element) {
  var angularElement = angular.element(element);
  angularElement.triggerHandler('input');
}

async function setFormField(page, selector, value) {
  console.log('setting ' + selector);
  await page.evaluate((selector, value) => {
    var field = document.querySelector(selector);
    field.value = value;
    var angularElement = angular.element(field);
    angularElement.triggerHandler('input');
  }, selector, value);
}

async function clickOn(page, selector) {
  console.log('clicking on ' + selector);
  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, selector);
}

async function readData(page) {
  console.log('reading charges');
  var data = await page.evaluate(() => {
    var times = Array.from(document.querySelectorAll('div.time'));
    var charges = Array.from(document.querySelectorAll('.charge-data'));
    var data = times.map((time, index) => {
       return {
        time: time.innerText,
        description: charges[index].querySelector('.description').innerText,
        amount: charges[index].querySelector('.amount').innerText
      }
    });
    return data;
  });
  return data;
}

module.exports.crawl = (async (username, password) => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://app.nubank.com.br/#/login');
  await setFormField(page, '#username', username);
  await setFormField(page, 'input[type=password]', password);
  await clickOn(page, 'button');

  await page.screenshot({path: 'example1.png'});
  await sleep(5000);
  await clickOn(page, '.bills');

  //await sleep(1000);
  //await clickOn(page, '.summary.open .amount-due .amount');

  await sleep(5000);
  await clickOn(page, '.tab.open');

  await sleep(5000);

  const data = await readData(page);

  await page.screenshot({path: 'example.png'});
  await browser.close();
  return data;
});
