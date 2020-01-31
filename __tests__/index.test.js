import request from 'supertest'
import app from '../src/index'
import isUUID from 'is-uuid'

describe('basic route tests', () => {
    test('hello world works', async() => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('hello world');
    })
})

describe('tests Get /pricing-models', () => {
    test('returns all of the pricing models available for the system', async() => {
        const response = await request(app).get('/pricing-models');
        expect(response.status).toBe(200);
    })
})

describe('tests POST /pricing-models', () => {
    test('creates a new pricing model in the system', async() => {
        const response = await request(app).post('/pricing-models');
        expect(response.status).toBe(200);
        expect(isUUID.v4(response.text)).toBe(true);
    })
})

describe('tests GET /pricing-models/:pm-id', () => {
    test('get an individual pricing model', async() => {
        const response = await request(app).get('/pricing-models/3ba92095-3203-4888-a464-3c7d5d9acd7e');
        expect(response.status).toBe(200);
        expect(isUUID.v4(response.text)).toMatchSnapshot();
    })

    test('if the pricing model isn\'t found by pm-id it responds with not found', async() => {
        const response = await request(app).get('/pricing-models/fjdsklajfdlksja');
        expect(response.status).toBe(200);
        expect(isUUID.v4(response.text)).toBe(false);
    })
})

describe('tests PUT /pricing-models/:pm-id', () => {
    test('updates an existing pricing model meta-data', async() => {
        const response = await request(app).put('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154').send({'name': 'test1'});
        expect(response.status).toBe(204);
        expect(isUUID.v4(response.text)).toMatchSnapshot();
    })

    test('after update get pricing model', async() => {
        const response = await request(app).get('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    })

    test('Not found', async() => {
        const response = await request(app).put('/pricing-models/fdsafdsafdsa5d9acd7e');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Not Found');
    })
})

describe('tests GET /pricing-models/:pm-id/prices', () => {
    test('returns the prices configured for a specific pricing model', async() => {
        const response = await request(app).get('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154').send({'name': 'test1'});
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    })

    test('get Not found', async() => {
        const response = await request(app).get('/pricing-models/fdsafdsafdsa5d9acd7e/prices');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Not Found');
    })
})

describe('tests POST /pricing-models/:pm-id/prices', () => {
    test('adds a new price configuration for a pricing model', async() => {
        const response = await request(app).post('/pricing-models/48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e/prices').send({
            "pricing": [{
                "price": 3,
                "name": "10 minutes",
                "value": 10
            }, {
                "price": 5,
                "name": "20 minutes",
                "value": 20
            }, {
                "price": 15,
                "name": "60 minutes",
                "value": 60
            }]
        });
        expect(response.status).toBe(204);
    })

    test('after update get pricing model', async() => {
        const response = await request(app).get('/pricing-models/48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    })

    test('get Not found', async() => {
        const response = await request(app).get('/pricing-models/fdsafdsafdsa5d9acd7e/prices');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Not Found');
    })
})

describe('tests Delete /pricing-models/:pm-id/prices/:price-id', () => {
    test('removes a price configuration', async() => {
        const response = await request(app).delete('/pricing-models/48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e/prices/3');
        expect(response.status).toBe(204);
    })

    test('after remove get pricing model', async() => {
        const response = await request(app).get('/pricing-models/48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    })

    test('get Not found', async() => {
        const response = await request(app).get('/pricing-models/fdsafdsafdsa5d9acd7e/prices/5');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    })
    
    test('removes a price configuration', async() => {
        const response = await request(app).delete('/pricing-models/48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e/prices/16');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Not Found');
    })

})

describe('tests GET /machines/:machine-id/prices', () => {
    test('return the pricing model and price configurations set for a given machine', async() => {
        const response = await request(app).get('/machines/99ade105-dee1-49eb-8ac4-e4d272f89fba/prices');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    })

    test('does not have a price model configured then the default model from prices.json is returned', async() => {
        const response = await request(app).get('/machines/4111947a-6c58-4977-90fa-2caaaef88648/prices');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    })

    test('does not found a machine-id then responds with not found', async() => {
        const response = await request(app).get('/machines/4111947a-6c58-4977-90fa-2caaaef88649/prices');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    })
})

describe('tests PUT /machines/:machine-id/prices/:pm-id', () => {
    test('set the pricing model for an individuaal machine to the one from pm-id', async() => {
        const response = await request(app).put('/machines/57342663-909c-4adf-9829-6dd1a3aa9143/prices/3ba92095-3203-4888-a464-3c7d5d9acd7e');
        expect(response.status).toBe(204);
    })

    test('return the pricing model and price configurations set for a given machine', async() => {
        const response = await request(app).get('/machines/57342663-909c-4adf-9829-6dd1a3aa9143/prices');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    })

    test('set the pricing model for an individuaal machine to the one from pm-id', async() => {
        const response = await request(app).put('/machines/57342663-909c-4adf-9829-6dd1a3aa9144/prices/3ba92095-3203-4888-a464-3c7d5d9acd7e');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Not Found');
    })

    test('set the pricing model for an individuaal machine to the one from pm-id', async() => {
        const response = await request(app).put('/machines/57342663-909c-4adf-9829-6dd1a3aa9143/prices/3ba92095-3203-4888-a464-3c7d5d9acd7f');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Not Found');
    })
})

describe('tests Delete /machines/:machine-id/prices/:pm-id', () => {
    test('removes the pricing model from the machine (unsets it)', async() => {
        const response = await request(app).delete('/machines/48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e/prices/15');
        expect(response.status).toBe(200);
    })
})
