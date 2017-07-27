var userEndpoints = require('../endpoints/userEndpoints');

var RestContext = require('../RestUtils/restContext');

var restContext = new RestContext();

var TokenServices = require('../services/tokenService');
var tokenServices = new TokenServices();

module.exports = function(router) {

    router.use(function(req, res, next) {
        console.log("--------------------------------------------New Request start--------------------------------------------");
        console.log(req.url);
        console.log(req.body);
        restContext.setContext(req, res, next);
        var token = req.headers['x-access-token'];
        if(token) {
            tokenServices.validateTokenExpiry(token, restContext, function(user) {
                restContext.currentUser = user;
                restContext.next();
            })
        } else {
            restContext.next();
        }
    });

    userEndpoints(router, restContext);

    return router;
};