var jwt     = require('jsonwebtoken');
var secret  = "123456789";

function TokenService() {

}

TokenService.prototype.getNewToken = function(user) {
    return jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn : '24h'});
};

TokenService.prototype.validateTokenExpiry = function(token, restContext, callback) {
    jwt.verify(token, secret, function(err, decoded) {
        if(err) {
            //console.log("************************************* from validateTokenExpiry" + err);
            restContext.sendResponse({success: false, message: 'Token Expired.'});
        }  else {
            restContext.currentUser = decoded;
            //console.log('validateTokenExpiry ' + decoded.email);
            return callback(decoded);
        }
    });
};

module.exports = TokenService;