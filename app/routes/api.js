var RestContext = require('../RestUtils/restContext');
var context;

module.exports = function(router) {

    router.use(function(req, res, next) {
        log("=====================Request==========================================");
        context = new RestContext(req, res, next);
        context.next();
    });

    //check for token in each request
    router.use(function() {
        log("====================================== down ================================================");
        var token = getTokenFromRequest();
        validateNotNullToken(token);
        context.req.decoded = validateTokenExpiry(token);
        context.next();
    });

    return router;
};