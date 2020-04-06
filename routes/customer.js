const express = require('express');
const router = express.Router();
const fs = require('fs');

const customers = '/Users/pratulpatwari/organic-veggies/data/customer.json';

router.get('/accounts/:farmerId', (req, res) => {
    console.log('List all the customer accounts. Request by farmerId: ', `${req.params.farmerId}`);
    try {
        fs.readFile(customers, (err, data) => {
            if (err) {
                throw err;
            } else {
                let allCustomers = JSON.parse(data);
                res.status(200).send(allCustomers);
            }
        });
    } catch (error) {
        console.error('Error while fetching the list of all vegetables. FarmerID requested: ', `${req.params.farmerId}`, err.message);
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;