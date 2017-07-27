var TokenServices = require('../services/tokenService');
var tokenServices = new TokenServices();

function RestContext() {
    this.req = null;
    this.res = null;
    this.next = null;
    this.currentUser = null;
    this.token = null;
}

RestContext.prototype.setContext = function(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.currentUser = "";
    this.token = null;
};

RestContext.prototype.setUser = function(self, callback) {

};

RestContext.prototype.sendResponse = function(response) {
    console.log("--------------------------------------------Sending Response------------------------------");
    this.res.json(response);
};

RestContext.prototype.getValueFromRequestBody = function(property) {
    var data = this.req.body;
    return data[property];
};

RestContext.prototype.getTokenFromRequest = function() {
    var req = this.req;
    return req.params.token || req.body.token || req.headers['x-access-token'];
};


RestContext.prototype.getValueFromRequestParams = function(property) {
    var data = this.req.params;
    return data[property];
};

module.exports = RestContext;