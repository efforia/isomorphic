const PaymentMethod = require('../routes/payments/payment-method.model')

console.log(`☮ DB: Planting seeds for the PaymentMethod model...`.yellow)
PaymentMethod.remove({}, async () => {
  await PaymentMethod.create({ label: 'Master Card (Crédito)', value: 'MASTER_CARD_CREDIT' })
  await PaymentMethod.create({ label: 'Master Card (Débito)', value: 'MASTER_CARD_DEBIT' })
  await PaymentMethod.create({ label: 'Visa (Crédito)', value: 'VISA_CREDIT' })
  await PaymentMethod.create({ label: 'Visa (Débito)', value: 'VISA_DEBIT' })
  await PaymentMethod.create({ label: 'Elo (Crédito)', value: 'ELO_CREDIT' })
  await PaymentMethod.create({ label: 'Elo (Débito)', value: 'ELO_DEBIT' })
  await PaymentMethod.create({ label: 'Banricompras (Crédito)', value: 'BANRICOMPRAS_CREDIT' })
  await PaymentMethod.create({ label: 'Banricompras (Débito)', value: 'BANRICOMPRAS_DEBIT' })
  console.log(`☮ DB: PaymentMethod seeds planted!`.green)
})
