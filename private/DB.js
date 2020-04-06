const availableVegetables = '/Users/pratulpatwari/organic-veggies/data/available.json';
const allVegetables = '/Users/pratulpatwari/organic-veggies/data/vegetables.json';

/*
    DB call to save the available vegetables.
    1. Called when farmers update the vegetables available tomorrow.
    2. Called when consumers place an order.
*/
async function saveAvailableVegetables(data) {
    try {
        fs.writeFile(availableVegetables, data, function (err) {
            if (err) throw err;
        });
    } catch (error) {
        console.error('Error while updating the available vegetables: ', { message: error.message });
        return false;
    }
    return true;
}

/*
    DB call to fetch the list of available vegetables in stock.
*/
async function readAvailableVegetables() {
    console.log('Entering readAvailableVegetables()');
    return fs.readFileSync(availableVegetables, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        } else {
            let vegetable = JSON.parse(data);
            console.log('Leaving readAvailableVegetables()');
            return vegetable;
        }
    });
};

async function readAllVegetables() {
    console.log('Entering readAllVegetables()');
    return fs.readFileSync(allVegetables, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        } else {
            let vegetable = JSON.parse(data);
            console.log('Leaving readAllVegetables()');
            return vegetable;
        }
    });
};

module.exports = {
                    saveAvailableVegetables,
                    readAvailableVegetables,
                    readAllVegetables
                };