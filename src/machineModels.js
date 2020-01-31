import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

const db = new JsonDB(new Config("machines", true, false, '/'));

function checkValidate(machineId) {
    try {
        db.getData(`/${machineId}`);
        return true;
    } catch(error) {
        return false;
    }
}

function findMachineModel(machineId, pmId) {
    return db.getData(`/${machineId}`, pmId);
}

function setMachineModelPriceModel(machineId, pmId) {
    return db.push(`/${machineId}/pricing_id`, pmId);
}

module.exports = {
    checkValidate,
    findMachineModel,
    setMachineModelPriceModel
};