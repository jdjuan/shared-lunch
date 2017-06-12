// auth.js

var service = require('./service');

exports.sendemail = function (req, res) {
    return res
        .status(200)
        .send({ token: service.createToken(user) });
};

