var UserServices = require('../services/userServices');

module.exports = function(router, restContext) {

    var userServices = new UserServices();

    router.get('/user', function() {
        userServices.getUserFromContext(restContext);
    });
};
