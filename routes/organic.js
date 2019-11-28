'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');

const file = '/Users/pratulpatwari/Desktop/available.json';

router.get('/', (req, res) => {
    res.send('We can send the json data from this request to mobile');
});

const unitConverter = (order, vegetable) => {
    if (order.unit != vegetable.item.unit) {
        if (order.unit === 'kg') {
            order.quantity = order.quantity * 1000;
            order.unit = 'gm';
        }
        if (vegetable.item.unit === 'kg') {
            vegetable.item.quantity = vegetable.item.quantity * 1000;
            vegetable.item.unit = 'gm';
        }
    }
    return (order, vegetable);
}

const readAvailableVegetables = (fileLocation) => {
    return fs.readFileSync(fileLocation, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        } else {
            let vegetable = JSON.parse(data);
            return vegetable;
        }
    })
};

const displayOrder = (order, vegetable) => {
    console.log('Order Quantity: ', order.quantity);
    console.log('Order Quantity Unit: ', order.unit);
    console.log('Available Quantity: ', vegetable.item.quantity);
    console.log('Available Quantity Unit: ', vegetable.item.unit);
}

const updateAvailability = (order, vegetable) => {
    vegetable.item.quantity -= order.quantity;
    if (vegetable.item.unit === 'gm' && vegetable.item.quantity >= 1000) {
        vegetable.item.quantity /= 1000;
        vegetable.item.unit = 'kg';
    }
    return (order, vegetable);
}

const placeOrder = async (orders) => {
    const stock = readAvailableVegetables(file);
    var available = JSON.parse(stock);
    var outOfStock = [];
    for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < available.length; j++) {
            if (orders[i].id === available[j].item.id) {
                orders[i], available[j] = unitConverter(orders[i], available[j]);
                if (orders[i].quantity <= available[j].item.quantity) {
                    orders[i], available[j] = updateAvailability(orders[i], available[j]);
                } else if (orders[i].quantity > available[j].item.quantity) {
                    outOfStock.push(orders[i]);
                }
            }
        }
    }
    return [outOfStock, available];
}

// call by consumers to place the order for the day.
router.post('/order/:consumerId', async (req, res) => {
    try {
        var updatedValues = await placeOrder(req.body);
        const available = JSON.stringify(updatedValues[1]);
        const savedStatus = await saveAvailableVegetables(available);
        if (savedStatus) {
            if(updatedValues[0] != null || updatedValues[0] != undefined){
                res.json({ message: 'Order successfully placed !. You will soon receive your vegetables !. However, there are some vegetables in order are not available. Vegetables out of stock are: ' + JSON.stringify(updatedValues[0]) }); 
            } else {
                res.json({ message: 'Order successfully placed !. You will soon receive your vegetables !' });
            }
        }
    } catch (error) {
        res.sendStatus(500).send({ message: err.message });
    }
});


/************************ FARMER SPECIFIC API CALLS *********************/

// Step: 1 - List all possible vegetables.
router.get('/all/:farmerId', async (req, res) => {
    try {
        fs.readFile('../data/vegetables.json', (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log('Request to pull all vegetables by farmer: ' + `${req.params.farmerId}`);
                let vegetable = JSON.parse(data);
                res.status(200).send(vegetable);
            }
        });
    } catch (error) {
        console.log('There was an error in serving request for farmer: ', `${req.params.farmerId}`);
        console.error(error);
        res.status(500).send({ message: err.message });
    }
});

// Step: 2 - Set available vegetables for tomorrow.
router.post('/available/:farmerId', async (req, res) => {
    var total = [];
    try {
        total = JSON.stringify(req.body);
        const savedStatus = await saveAvailableVegetables(total);
        if (savedStatus) {
            res.json({ message: 'Available vegetables have been successfully saved !' });
        }
    } catch (error) {
        res.send({ message: 'There was some error while completing this request: ' + error.message })
    }
});

async function saveAvailableVegetables(data) {
    try {
        fs.writeFile(file, data, function (err) {
            if (err) throw err;
        });
    } catch (error) {
        console.error({ message: error.message });
        return false;
    }
    return true;
}
module.exports = router;