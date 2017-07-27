/**
 * Created by deepkuku on 22/07/17.
 */
angular.module("dashboardService", ['authServices'])

    .factory('dashboardFactory', function($http, AuthTokenFactory) {
        var dashboardFactory = {};

        var next_max_id = '481646761451069440';

        var screen_name = 'salman',
            count = 50,
            max_id = next_max_id;

        var url = "/api/twitter/tweets?" + "screen_name=" + screen_name + "&"
                                        + "count=" + count + "&"
                                        + "max_id=" + next_max_id;

        dashboardFactory.getTweets = function(data) {
            return $http.get(url);
        };

        return dashboardFactory;
    });