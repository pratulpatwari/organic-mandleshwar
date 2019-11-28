const express = require('express');
const app = express();
require('dotenv/config');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}))


// import routes
const postRoutes = require('./routes/organic');

app.use('/organic', postRoutes);


// create route
app.get('/', (req, res) => {
    res.send('This is the home url call. Please call specific urls to get the data');
});

// port name to which express will listen
app.listen(3000, function() {
    console.log('Application running at: ', 3000);
    
});


