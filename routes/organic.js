'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
var db = require('../private/DB');

router.get('/', (req, res) => {
    res.send('We can send the json data from this request to mobile');
});

/*
    Unit converter: Always convert the vegetable quantity in GRAMS irrespective of quantity available or ordered.
*/
const unitConverter = (order, available) => {
    if (order.unit != available.item.unit) {
        if (order.unit === 'kg') {
            order.quantity = order.quantity * 1000;
            order.unit = 'gm';
        }
        if (available.item.unit === 'kg') {
            available.item.quantity = available.item.quantity * 1000;
            available.item.unit = 'gm';
        }
    } else {
        console.log('Quantity available and quantity ordered units are same.');
    }
    return (order, available);
}

/*
    Update the available vegetables for the request. Separate call will be made to save the availability in DB.
*/
const updateAvailability = (order, vegetable) => {
    vegetable.item.quantity -= order.quantity;
    if (vegetable.item.unit === 'gm' && vegetable.item.quantity >= 1000) {
        vegetable.item.quantity /= 1000;
        vegetable.item.unit = 'kg';
    }
    return (order, vegetable);
}

const placeOrder = async (orders) => {
    console.log('Entering placeOrder()');
    const stock = readAvailableVegetables();
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
    console.log('Leaving placeOrder(). # of vegetables Out of Stock: ', outOfStock.length, { '# of vegetables available: ': available.length });
    return [outOfStock, available];
}

// call by consumers to place the order for the day.
router.post('/order/:consumerId', async (req, res) => {
    console.log('New order received from: ', `${req.params.farmerId}`);
    try {
        var updatedValues = await placeOrder(req.body);
        const currentAvailability = JSON.stringify(updatedValues[1]);
        const savedStatus = await db.saveAvailableVegetables(currentAvailability);
        if (savedStatus) {
            if (updatedValues[0] != null && updatedValues[0] != undefined) {
                res.json({ message: 'Order successfully placed !. You will soon receive your vegetables !. However, some vegetables you ordered are not available. Vegetables out of stock are: ' + JSON.stringify(updatedValues[0]) });
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
    console.log('Step 1. List all the possible vegetables which are available in market. Request by farmerId: ', `${req.params.farmerId}`);
    try {
        const allVeggies = await db.readAllVegetables();
        res.status(200).send(allVeggies);
    } catch (error) {
        console.error('Error while fetching the list of all vegetables. FarmerID requested: ', `${req.params.farmerId}`, err.message);
        res.status(500).send({ message: err.message });
    }
});

// Step: 2 - Set available vegetables for tomorrow.
router.post('/available/:farmerId', async (req, res) => {
    console.log('Set vegetables available for tomorrow');
    var total = [];
    try {
        total = JSON.stringify(req.body);
        const savedStatus = await db.saveAvailableVegetables(total);
        if (savedStatus) {
            res.json({ message: 'Available vegetables have been successfully saved !' });
        }
    } catch (error) {
        console.error('Error while updating the available vegetables. Farmer requested: ', `${req.params.farmerId}`, { message: err.message });
        res.send({ message: 'There was some error while completing this request: ' + error.message })
    }
});


module.exports = router;