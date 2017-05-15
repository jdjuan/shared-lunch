var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  service: 'SendGrid',
  auth: {
    api_user: 'harlengiraldoortega',
    api_key: 'Harlen123'
  }
}

var client = nodemailer.createTransport(sgTransport(options));

var email = {
  from: 'awesome@bar.com',
  to: 'harlengiraldo@gmail.com',
  subject: 'Hello',
  text: 'Hello world',
  html: '<b>Hello world</b>'
};

client.sendMail(email, function(err, info){
    if (err ){
      console.log(err);
    }
    else {
      console.log('Message sent: ' + info.message);
    }
});