import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import * as api from './api'

const app = new Koa()
const PORT = process.env.PORT || 1337
const router = new Router()

router
  .use(bodyParser())
  .get('/welcome/page1', (ctx, next) => {
    ctx.body = 'welcome koba1'
  })

  .get('/welcome/page2', (ctx, next) => {
      ctx.body = 'welcome koba2'
    })

  // Price DB

  .get('/pricing-models', api.getAllPricingModels)
  .post('/pricing-models', api.createPricingModel)

  .get('/pricing-models/:pmId', api.getPricingModel)
  .put('/pricing-models/:pmId', api.putPricingModel)

  .get('/pricing-models/:pmId/prices', api.getPricingModelPricings)
  .post('/pricing-models/:pmId/prices', api.createPricingModelPricings)

  .delete('/pricing-models/:pmId/prices/:priceId', api.deletePricingModelPricing)

  // Machine DB

  .get('/machines/:machineId/prices', api.getMachineModelPricings)
  .put('/machines/:machineId/prices/:pmId', api.putMachineModelPricingModel)

  .delete('/machines/:machineId/prices/:priceId', api.deleteMachineModelPricing)


  module.exports = app
  .use(router.routes())
  .listen(PORT, () =>
    console.log(`Server listening on port ${PORT}`)
  )
