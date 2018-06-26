const printer = require('../src/OFXPrinter.js'); 
const expectedBankStatement = require('./fixtures/bankStatement.js'); 

test('prints a bank statement', () => {
  const date = new Date(2018, 1, 16);
  const accountId = 'fe3fd17e-42e6-4336-83ca-33373747a191';
  const balanceAmount = 1.59;
  var charges = [
    {
      amount: 3.59,
      date: (new Date(2018, 1, 1)),
      displayDate: '20180201000000[-2:GMT]',
      memo: 'Dolly Citrus',
      type: 'DEBIT',
      id: '7cce25b5-e6df-4d4a-a506-71d53a30b601'
    },
    {
      amount: 2.0,
      date: (new Date(2018, 1, 15)),
      displayDate: '20180215000000[-2:GMT]',
      memo: 'Payment',
      type: 'CREDIT',
      id: '44fb1d5e-b2d8-4e23-98cb-17e5f5aab28f'
    }
  ];

  expect(printer.print(charges, date, accountId, balanceAmount))
    .toBe(expectedBankStatement);
});
