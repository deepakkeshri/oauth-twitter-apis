angular.module('userApp', ['appRoutes','userControllers', 'dashboardController', 'userServices', 'ngAnimate', 'mainController', 'authServices'])

    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    });