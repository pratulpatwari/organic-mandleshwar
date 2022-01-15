const express = require('express');
const app = express();
require('dotenv/config');
const path = require('path');
const auth = require('./private/auth.js');
const PORT = process.env.PORT || 8000;
const jwt = require('jsonwebtoken')
const axios = require('axios');

const config = require('./private/config');

/* set the secret configurations*/
app.set('Secret', config.secret);

// static content
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));

const protectedRoutes = express.Router();
app.use(['/api','/farmer'], protectedRoutes);

protectedRoutes.use((req,res,next) => {
    const token = req.headers['Authorization'];
    if (token) {
        jwt.verify(token, app.get('Secret', (err,decode) => {
            if(err) {
                return res.json({message: 'invalid token'});
            } else {
                req.decode = decode;
            }
        }));
        next();
    } else {
        res.send({
            message: 'No token provided'
        });
    }
});

// import routes. All the Rest API end points are configured in this file
const organicRoutes = require('./routes/organic');
app.use('/api/organic', organicRoutes);

const customerRoutes = require('./routes/customer');
app.use('/api/customer', customerRoutes);

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
    const authenticate = auth.isAuthenticated(req.body.email, req.body.psw, app);
    if (authenticate.status) {
        console.log('Authentication is successful. Token: ', authenticate.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authenticate.token}`
        return axios.get("/farmer");
    } else {
        console.error('Authentication was not successful: ', authenticate.message);
        res.status(401).send('Invalid Email or Password !');
    }

});

// port name to which express will listen
app.listen(PORT, function () {
    console.log('Application running at: ', PORT);
});


