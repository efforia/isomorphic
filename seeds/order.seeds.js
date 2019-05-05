const ReceivingMode = require('../routes/marketplace/orders/receiving-mode.model')

console.log(`☮ DB: Planting seeds for the ReceivingMode model...`.yellow)
ReceivingMode.remove({}, async () => {
  await ReceivingMode.create({ value: 'CHECKOUT' })
  await ReceivingMode.create({ value: 'DELIVERY' })
  console.log(`☮ DB: ReceivingMode seeds planted!`.green)
})
