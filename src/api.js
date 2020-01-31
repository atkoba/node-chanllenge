const pricingModels = require('./pricingModels')

const errorReturn = 'Not Found';

function getAllPricingModels (ctx, next) {
    ctx.body = pricingModels.findAllPricingModels();
}

function createPricingModel (ctx, next) {
    const { body } = ctx.request;

    ctx.body = pricingModels.createNewPricingModel(body);
}

function getPricingModel(ctx, next) {
    const { pmId } = ctx.params;

    if (!pricingModels.checkValidate(pmId)) {
        ctx.body = errorReturn;
        return;
    }

    ctx.body = pricingModels.findPricingModel(pmId);
}

function putPricingModel(ctx, next) {
    const { pmId } = ctx.params;
    const { body } = ctx.request;

    if (!pricingModels.checkValidate(pmId)) {
        ctx.body = errorReturn;
        return;
    }
    const pricingModel = pricingModels.findPricingModel(pmId);

    pricingModel.name = body.name;
    ctx.body = pricingModels.setPricingModel(pmId, pricingModel);
}

function getPricingModelPricings(ctx, next) {
    const { pmId } = ctx.params;

    if (!pricingModels.checkValidate(pmId)) {
        ctx.body = errorReturn;
        return;
    }
    const pricingModel = pricingModels.findPricingModel(pmId);

    ctx.body = pricingModel.pricing;
}

function createPricingModelPricings(ctx, next) {
    const { pmId } = ctx.params;
    const { body } = ctx.request;

    if (!pricingModels.checkValidate(pmId)) {
        ctx.body = errorReturn;
        return;
    }
    const pricingModel = pricingModels.findPricingModel(pmId);

    pricingModel.pricing = body.pricing;
    ctx.body = pricingModels.setPricingModel(pmId, pricingModel);
}

function deletePricingModelPricing(ctx, next) {
    const { pmId, priceId } = ctx.params;

    if (!pricingModels.checkValidate(pmId)) {
        ctx.body = errorReturn;
        return;
    }
    const pricingModel = pricingModels.findPricingModel(pmId);

    if (!pricingModels.checkvalidatePriceId(pmId, priceId)) {
        console.log("errors", priceId);
        ctx.body = errorReturn;
        return;
    }

    pricingModel.pricing = pricingModels.removePricingModelPring(pricingModel.pricing, priceId);
    ctx.body = pricingModels.setPricingModel(pmId, pricingModel);
}

module.exports = {
    getAllPricingModels,
    createPricingModel,
    getPricingModel,
    putPricingModel,
    getPricingModelPricings,
    createPricingModelPricings,
    deletePricingModelPricing
};