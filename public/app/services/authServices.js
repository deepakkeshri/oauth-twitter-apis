angular.module('authServices', [])


    .factory('Auth', function($http, AuthTokenFactory) {

        var authFactory = {};

        authFactory.getUser = function(req, res) {
            if(authFactory.isLoggedIn()) {
                return $http.get('/api/user').then(function(data) {
                    data = data.data;
                    console.log("Got user"+ data);
                    var token = data.token;
                    AuthTokenFactory.setToken(token);
                    return data.data;
                });
            }   else {
                $q.reject({message: 'user has no token'});
            }
        };

        authFactory.isLoggedIn = function() {
            var token = AuthTokenFactory.getToken();
            //console.log("cheking is loggedin token " + token);
            return token;
        };

        authFactory.logout = function() {
            AuthTokenFactory.setToken(null);
        };

        return authFactory;

    })

    .factory('AuthTokenFactory', function($window) {
        var authTokenFactory = {};

        authTokenFactory.setToken = function(token) {
            if(token) {
                //console.log("token added to local storage " + token);
                $window.localStorage.setItem('token', token);
            }   else {
                $window.localStorage.removeItem('token');
                //console.log("token removed from local storage " + token);
            }

        };

        authTokenFactory.getToken = function() {
            var token = $window.localStorage.getItem('token');
            //console.log("token got from local storage " + token);
            return token;
        };

        return  authTokenFactory;

    })

    .factory('AuthInterceptors', function(AuthTokenFactory) {
        var authInterceptionFactory = {};

        authInterceptionFactory.request = function(req) {
            var token = AuthTokenFactory.getToken();
            console.log("AuthInterceptor " + token);
            if(token) {
                req.headers['x-access-token'] = token;
            }
            return req;
        };

        return authInterceptionFactory;
    });

