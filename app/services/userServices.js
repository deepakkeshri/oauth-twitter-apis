var User    = require('../models/user');
var filter = {
    'email' : 1,
    'username' : 1,
    'active': 1,
    'password' : 1
};

var TokenServices = require('./tokenService');

function UserServices() {

    //this.authServices = new AuthServices();
    this.tokenServices = new TokenServices();
}

UserServices.prototype.getUserDataFromRequest = function(restcontext) {
    var user = new User();
    user.email = restcontext.req.body.email || '';
    user.username = restcontext.req.body.username || '';
    user.password = restcontext.req.body.password || '';
    return user;
};

UserServices.prototype.createUser = function(restContext, callback) {
    var user = this.getUserDataFromRequest(restContext);
    var errors = [];
    if(this.userValidator.validateNewUserData(user, errors)) {

        var email = user.email;
        var username = user.username;

        this.getUser({email: email}, function(user) {
            if(user){
                errors.push("Email already used");
            }
        });

        this.getUser({username: username}, function(user) {
            if(user){
                errors.push("Username already used");
            }
        });

        user.tempToken = this.tokenServices.getNewToken(user, restContext);
        this.saveUser(user, function (data) {
            callback(data);
        });
    }
};

UserServices.prototype.saveUser = function(user, callback) {
    user.save(function(err){
        if(err) {
            console.log('Error creating user '+ err);
            throw err;
        }
        return callback(user);
    });
};


UserServices.prototype.getUser = function(query, callback) {
    User.findOne(query).select(filter).exec(function(err, user) {
        if(err) {
            console.log('Error feching user from database ' + err);
            throw err;
        }
        return callback(user);
    });
};

UserServices.prototype.getUserFromContext = function(restContext) {
    var response = {};
    if(restContext.currentUser) {
        response.success = true;
        response.data = restContext.currentUser;
        response.token = restContext.getTokenFromRequest();
    } else {
        response.success = false;
        response.errorMessage = 'No token provided.'
    }
    restContext.sendResponse(response);
};



module.exports = UserServices;