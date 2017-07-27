angular.module('mainController', ['authServices'])

    .controller('mainCtrl', ['$scope', '$location','$timeout','$rootScope','$window', 'Auth', function($scope, $location,$timeout,$rootScope,$window, Auth) {

        $scope.loginData = {
            username: "",
            password: ""
        };

        $scope.isLoggedIn = Auth.isLoggedIn();
        $scope.isLoaded = false;
        $scope.currentUser = '';
        $scope.app = this;

        $rootScope.$on('$routeChangeStart', function(){
                $scope.updateCurrentUser();
            $scope.isLoaded = true;
        });

        $scope.updateCurrentUser = function() {
            if(Auth.isLoggedIn()) {
                console.log("checking user loggedin?");
                Auth.getUser().then(function(data) {
                    $scope.currentUser = data;
                    console.log(data);
                });
            } else {
                $scope.currentUser = '';
            }
            if($location.hash() == "_=_") $location.hash(null);
        };

        $scope.twitterLogin = function() {
            var host = $window.location.host;
            var protocol = $window.location.protocol;
            $window.location = protocol + "//" + host + '/auth/twitter'
        };

        $scope.logout = function() {
            Auth.logout();
            $location.path('/logout');
            $scope.updateCurrentUser();
            $timeout(function() {
                $location.path('/');
            }, 200);
        }

    }]);