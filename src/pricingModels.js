import uuidv4 from 'uuid/v4'

import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

const db = new JsonDB(new Config("prices", true, false, '/'));

function checkValidate (pmId) {
    try{
        db.getData(`/${pmId}`);
        return true;
    } catch(error) {
        return false;
    }
}

function checkvalidatePriceId (pmId, priceId) {
    let pricings = db.getData(`/${pmId}/pricing`);

    for(let i = 0, l = pricings.length; i < l; i ++) {
        if (pricings[i].price == priceId) {
            return true;
        }
    }
    return false;
}

function findAllPricingModels() {
    return db.getData('/');
}

function createNewPricingModel(body) {
    const pricing_id = uuidv4();
    
    db.push(`/${pricing_id}`, {
        id: pricing_id, 
        name: body.name, 
        pricing: body.pricing
    })

    return pricing_id;
}

function findPricingModel(pmId) {
    return db.getData(`/${pmId}`);
}

function setPricingModel(pmId, body) {
    return db.push(`/${pmId}`, body);
}

function removePricingModelPring(arr, priceId) {
    let newArr = [];

    for (let i = 0, l = arr.length; i < l; i++) {
        if (arr[i].price != priceId) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

module.exports = {
    checkvalidatePriceId,
    checkValidate,
    findAllPricingModels,
    createNewPricingModel,
    findPricingModel,
    setPricingModel,
    removePricingModelPring
}