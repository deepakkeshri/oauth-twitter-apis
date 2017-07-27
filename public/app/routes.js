var app = angular.module('appRoutes', ['ngRoute'])

    .config(function($routeProvider, $locationProvider) {

        $routeProvider.when('/', {
            templateUrl: 'app/views/pages/home.html'
        });

        $routeProvider.when('/dashboard', {
            templateUrl: 'app/views/pages/dashboard.html',
            controller: 'dashboardCtrl',
            controllerAs: 'dasboard',
            authenticated: true
        });

        $routeProvider.when('/tweet', {
            templateUrl: 'app/views/pages/tweet.html',
            controller: 'tweetCtrl',
            controllerAs: 'tweet',
            authenticated: true
        });

        $routeProvider.when('/login', {
            templateUrl: 'app/views/users/login.html',
            controller: 'mainCtrl',
            controllerAs: 'login',
            authenticated: false
        });

        $routeProvider.when('/logout', {
            templateUrl: 'app/views/users/logout.html',
            authenticated: true
        });

        $routeProvider.when('/profile', {
            templateUrl: 'app/views/users/profile.html',
            authenticated: true
        });

        $routeProvider.when('/inactive/error', {
            templateUrl: 'app/views/users/login.html'
        });

        $routeProvider.when('/twitter/:token', {
            templateUrl: 'app/views/users/social/social.html',
            controller: 'twitterCtrl',
            controllerAs: 'twitter',
            authenticated: false
        });

        $routeProvider.when('/twittererror', {
            templateUrl: 'app/views/users/login.html',
            controller: 'twitterCtrl',
            controllerAs: 'twitter',
            authenticated: false
        });

        $routeProvider.otherwise({redirectTo: '/'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase : false
        })

    });

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){

    $rootScope.$on('$routeChangeStart', function(event, next, current){

        if(next.$$route && next.$$route.authenticated == true) {
            //console.log("need to be authenticated");
            if(!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
        } else if(next.$$route && next.$$route.authenticated == false) {
            //console.log("need not to be authenticated");
            if(Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/profile');
            }
        } else {
            console.log("authenticated does not matter");
        }
    });

}]);