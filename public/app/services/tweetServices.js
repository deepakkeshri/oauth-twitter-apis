/**
 * Created by deepkuku on 22/07/17.
 */
angular.module("tweetServices",[])

    .factory('TweetFactory', function($http) {
        var tweetFactory = {};

        tweetFactory.showTweet = function(data) {
            var url = "/api/twitter/tweet/";
            return $http.get(url + data.id_str);
        };

        //upvote favourites
        tweetFactory.makeFavorite = function(data) {
            var url = "/api/twitter/makeFavorite/";
            return $http.post(url + data.id_str);
        };

        tweetFactory.postTweet = function(data) {
            var url = "api/twitter/tweet/";
            return $http.post(url, data);
        };

        return tweetFactory;
    });