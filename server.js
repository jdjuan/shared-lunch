// server.js
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var auth = require('./auth');
var middleware = require('./middleware');
var admin = require("firebase-admin");


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('port', 3000);

const serviceAccount = require("./resources/testeo-319f48560d0d.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://testeo-ee0f2.firebaseio.com"
});

var nodemailer = require('nodemailer');

var emailConf = nodemailer.createTransport({
    service: 'gmail',
    port: '465',
    secure: true,
    auth: {
        user: 'sharedlunchv3@gmail.com',
        pass: 'harlen123'
    }
});

var router = express.Router();

router.post('/validtoken', function (req, res) {
    console.log(req.body);
    admin.auth().verifyIdToken(req.body.uid)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;
            res.json({ message: uid });
            emailConf.sendMail({
                from: 'SharedLunch <sharedlunchv3@gmail.com>',
                to: req.body.destemail1 + '<' + req.body.destemail1 + '>,' + req.body.destemail2 + ' <' + req.body.destemail2 + '>',
                subject: req.body.subject,
                html: '<div>👻' + req.body.bodymessage + '</div>',
            }, function (err) {
                if (err)
                    throw err;

                console.log('E-mail enviado!');
            });
            
        }).catch(function (error) {
            res.json({ message: 'upsii' });
        });

});


router.post('/private', middleware.ensureAuthenticated, function (req, res) {
    res.json({ message: 'your email was send! ' });
    emailConf.sendMail({
        from: 'SharedLunch <sharedlunchv3@gmail.com>',
        to: req.body.destemail1 + '<' + req.body.destemail1 + '>,' + req.body.destemail2 + ' <' + req.body.destemail2 + '>',
        subject: req.body.subject,
        html: '<div>👻' + req.body.bodymessage + '</div>',
    }, function (err) {
        if (err)
            throw err;

        console.log('E-mail enviado!');
    });


});

app.use('/api', router);

app.listen(app.get('port'));
console.log('Magic happens on port ' + app.get('port'));
