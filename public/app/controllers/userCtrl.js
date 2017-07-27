angular.module('userControllers', ['userServices', 'authServices'])

    .controller('twitterCtrl', ['$scope', '$routeParams','$location', '$window', 'AuthTokenFactory', function($scope, $routeParams, $location, $window, AuthTokenFactory) {

        $scope.app = this;


        $scope.app.emailValidMessage = "";
        $scope.app.usernameValidMessage = "";

        $scope.app = this;
        if($window.location.pathname == '/twittererror'){
            $scope.app.errorMessage = 'Twitter email not found in database.'
        } else if($window.location.pathname == '/inactive/error'){
            $scope.app.errorMessage = 'Account is not yet activated. Please check your email for activation link.'
        }  else {
            var token = $routeParams.token;
            AuthTokenFactory.setToken(token);
            $location.path('/');
        }
    }]);