var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
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
    console.log(req.body.userLeft, req.body.userRight);
    admin.auth().verifyIdToken(req.body.uid)
        .then(function (decodedToken) {
            emailConf.sendMail({
                from: 'SharedLunch <sharedlunchv3@gmail.com>',
                to: req.body.userLeft + '<' + req.body.userLeft + '>,' + req.body.userRight + ' <' + req.body.userRight + '>',
                subject: req.body.subject,
                html: '<div>👻' + req.body.text + '</div>',
            }, function (err) {
                if (err) {
                    throw err;
                }
                console.log('E-mail enviado!');
            });

        }).catch(function (error) {
            res.json({ error: error });
        });

});

app.use('/api', router);
app.listen(app.get('port'));
console.log('Listening on port ' + app.get('port'));
