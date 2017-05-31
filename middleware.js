var jwt = require('jwt-simple');  
var moment = require('moment');  
var config = require('./config');

exports.ensureAuthenticated = function(req, res, next) {  

    var payload = {
    sub: "user_xx",
    iat: moment().unix(),
    exp: moment().add(3, "days").unix(),
  };
  console.log(jwt.encode(payload, config.TOKEN_SECRET));
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: "Tu peticion no tiene cabecera de autorizacion"});
  }
  console.log("YO ENTREEEE ||||||||||||||||||");

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);

  if(payload.exp <= moment().unix()) {
     return res
         .status(401)
        .send({message: "El token ha expirado"});
  }

  req.user = payload.sub;
  next();
}