const jwt = require('jsonwebtoken');

const isAuthenticated = (username, password, app) => {
    if (username === 'pratul.patwari@gmail.com') {
        if (password === '123') {
            const payload = {
                check: true
            };

            var token = jwt.sign(payload, app.get('Secret'), {
                expiresIn: 1440 // expires in 24 hours
            });
            return {status: true, token: token};
        } else {
            return {status: false, message: 'incorrect password'};
        }
    }
    return {status: false, message: 'please check the user'};
};


module.exports = {
    isAuthenticated
}