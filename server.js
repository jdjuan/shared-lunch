// server.js
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var auth = require('./auth');
var middleware = require('./middleware');
var admin = require("firebase-admin");

// Configuramos Express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('port', 3000);
// Configuramos Firebase
const serviceAccount = require("./resources/testeo-319f48560d0d.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://testeo-ee0f2.firebaseio.com"
});
//configuramos el mailer 
var nodemailer = require('nodemailer');
// Vamos crear e-mails
var conta = nodemailer.createTransport({
    service: 'gmail',
    port: '465',
    secure: true,
    auth: {
        user: 'sharedlunchv3@gmail.com',
        pass: 'harlen123'
    }
});
// Iniciamos las rutas de nuestro servidor/API
var router = express.Router();

router.post('/validtoken', function (req, res) {
    console.log(req);
    admin.auth().verifyIdToken(req.body.uid)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;
            res.json({ message: uid });
            // ...
        }).catch(function (error) {
            res.json({ message: 'upsii' });
        });

});
// Rutas de autenticación y login
router.post('/auth/sendemail', auth.sendemail);
// Ruta solo accesible si estás autenticado
router.get('/private', middleware.ensureAuthenticated, function (req, res) {
    res.json({ message: 'Hi my bro ' });
});


// Ruta solo accesible si estás autenticado
router.post('/private', middleware.ensureAuthenticated, function (req, res) {
    res.json({ message: 'your email was send! ' });
    conta.sendMail({
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

// Iniciamos el servidor y la base de datos


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(app.get('port'));
console.log('Magic happens on port ' + app.get('port'));
