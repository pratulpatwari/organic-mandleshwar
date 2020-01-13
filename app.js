const express = require('express');
const app = express();
require('dotenv/config');
const path = require('path');

var db = require('./private/DB.js');
const PORT = process.env.PORT || 8000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// static content
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));

// import routes. All the Rest API end points are configured in this file
const organicRoutes = require('./routes/organic');
app.use('/organic', organicRoutes);

const customerRoutes = require('./routes/customer');
app.use('/customer', customerRoutes);

// Login page url
app.get('/', (req, res) => {
    // res.send({message: 'This is the home page url. Please call specific urls to get the data'});
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
});

// Landing Home page for farmers
app.get('/farmer', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/home.html'));
});

// login request to validate the credentials
app.post('/login', (req, res) => {
    if(db.isAuthenticated(req.body.email,req.body.psw)){
        res.redirect('/farmer');
    } else {
        res.status(200).send('Invalid Email or Password !');
    }
    
});

// port name to which express will listen
app.listen(PORT, function () {
    console.log('Application running at: ', PORT);
});


