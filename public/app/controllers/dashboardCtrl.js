/**
 * Created by deepkuku on 22/07/17.
 */

angular.module('dashboardController', ['ngMaterial', 'dashboardService', 'tweetServices'])

    .config(function($mdIconProvider) {
        $mdIconProvider
            .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24)
            .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
            .defaultIconSet('img/icons/sets/core-icons.svg', 24);
    })

    .controller('dashboardCtrl', ['$scope', '$window', 'dashboardFactory', 'TweetFactory', function($scope, $window, DashboardFactory, TweetFactory) {

        $scope.app = this;

        $scope.gap = 5;

        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 5;
        $scope.pagedItems = [];
        $scope.currentPage = 0;

        $scope.items = [];

        $scope.currentTweet = null;
        $scope.newTweet = null;

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

        $scope.getTweets = function() {
            DashboardFactory.getTweets().then(function(data) {
                console.log(data.data);
                $scope.items = data.data;
            });
        };

        $scope.getTweets();

        $scope.showTweet = function(data) {
            var host = $window.location.host;
            var protocol = $window.location.protocol;
            TweetFactory.showTweet(data).then(function(data) {
                if(data && data.data) {
                    $scope.currentTweet = data.data;
                } else {
                    $scope.currentTweet = null;
                }
            });
        };

        $scope.makeFavorite = function(data) {
            TweetFactory.makeFavorite(data).then(function(res) {
                if(res && res.data) {
                    $scope.currentTweet = res.data;
                } else {
                    $scope.currentTweet = null;
                }
            });
        };

        $scope.postTweet = function() {
            TweetFactory.postTweet($scope.newTweet).then(function(res) {
                if(res && res.data) {
                    $scope.currentTweet = res.data;
                } else {
                    $scope.currentTweet = null;
                }
            });
        }

    }]);

