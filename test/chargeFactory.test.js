const chargeFactory = require('../src/chargeFactory.js');

const aguid = require('aguid');
const chargesFixture = require('./fixtures/charges');

const federalTaxCharge = chargesFixture[0];
const paymentCharge = chargesFixture[1];

test('maps a raw charge to a charge with correct amount format', () => {
  const charge = chargeFactory.buildCharge(federalTaxCharge);
  expect(charge.amount).toBe(3.65);
});

test('maps a raw charge to a charge with correct date format', () => {
  const charge = chargeFactory.buildCharge(federalTaxCharge);
  const expectedDate = new Date((new Date()).getFullYear(), 4, 16).valueOf();
  expect(charge.date.valueOf()).toBe(expectedDate);
});

test('maps a raw charge to a charge with a memo', () => {
  const charge = chargeFactory.buildCharge(federalTaxCharge);
  expect(charge.memo).toBe('IOF de "Audible"');
});

test('maps a raw charge to a charge with a DEBIT type', () => {
  const charge = chargeFactory.buildCharge(federalTaxCharge);
  expect(charge.type).toBe('DEBIT');
});

test('maps a raw charge to a charge with a CREDIT type', () => {
  const charge = chargeFactory.buildCharge(paymentCharge);
  expect(charge.amount).toBe(-22.17);
  expect(charge.type).toBe('CREDIT');
});

test('maps a raw charge to a charge with an id', () => {
  const charge = chargeFactory.buildCharge(paymentCharge);
  expect(charge.id).toBe(aguid(charge.amount + charge.date + charge.memo));
});

test('maps a list of raw charges to a list of parsed charges', () => {
  const charges = chargeFactory.buildCharges(chargesFixture);
  expect(charges).toHaveLength(2);
});
