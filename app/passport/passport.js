var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = "123456789";
var OAuth = require('oauth').OAuth;

module.exports = function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());

    var consumerKey = 'xxxxxxxxx';
    var consumerSecret = "xxxxxxxx";
    var oa;
    var user = {id: 'abc'};
    var twitterAuthn;
    var twitterAuthz;

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));

    passport.serializeUser(function(user, done) {
        token = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn : '24h'});
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    function initTwitterOauth() {
        oa = new OAuth(
            "https://twitter.com/oauth/request-token" ,
            "https://twitter.com/oauth/access-token" ,
            consumerKey,
            consumerSecret,
            "1.0A",
            "http://localhost:3000/authn/twitter/callback",
            "HMAC-SHA1"
        );
    }

    function getTweet(id, cb) {

        var url = "https://api.twitter.com/1.1/statuses/show/" + id;
        console.log(url);

        oa.get(
            url,
            user.token  ,
            user.tokenSecret ,
            cb
        );
    }

    function getTweets(data, cb) {

        var url = "https://api.twitter.com/1.1/statuses/home_timeline.json?" +
            "screen_name=" + data.screen_name + "&" +
            "count=" + data.count;
        console.log(url);
        oa.get(
            url,
            user.token  ,
            user.tokenSecret ,
            cb
        );
    }

    function makeFavorite(id, cb) {
        var url = "https://api.twitter.com/1.1/favorites/create?id=" + id;
        console.log(url);
        oa.post(
            url,
            user.token1  ,
            user.tokenSecret1 ,
            {},
            cb
        );
    }

    function postTweet(text, cb) {
        oa.post(
            "https://api.twitter.com/1.1/statuses/update.json",
            user.token  ,
            user.tokenSecret ,
            {"status": text },
            cb
        );
    }

    app.post('/api/twitter/tweet', function(req, res) {

        postTweet(req.body.text, function(error, data) {
            if(error) {
                console.log(error);
                res.json(error);
            }
            else {
                res.end(data);
            }
        });
    });

    app.post('/api/twitter/makeFavorite/:id', function(req, res) {
        makeFavorite(req.params.id, function(error, data) {
            if(error) {
                console.log(error);
                res.json(error);
            }
            else {
                res.json(data);
            }
        });
    });

    app.get('/api/twitter/tweet/:id', function(req, res) {
        getTweet(req.params.id,  function(error, data) {
            if(error) {
                console.log(error);
                res.json(error);
            }
            else {
                res.end(data);
            }
        });
    });

    app.get('/api/twitter/tweets', function(req, res) {

        var screen_name = req.query.screen_name;
        var count = req.query.count;
        var params = {
            screen_name: screen_name ,
            count: count
        };
        getTweets(params, function(error, tweets, data) {
            if(error) {
                console.log(error);
                res.json(error);
            }
            else {
                console.log(tweets);
                res.end(tweets);
            }
        });
    });

    twitterAuthn = new TwitterStrategy({
            consumerKey: consumerKey  ,
            consumerSecret: consumerSecret,
            callbackURL: "http://localhost:3000/authn/twitter/callback"
        },
        function(token, tokenSecret, profile, done) {
            user.token1 = token;
            user.tokenSecret1 = tokenSecret;
            user.profile = profile;
            done(null, user);
        }
    );
    twitterAuthn.name = 'twitterAuthn';

    twitterAuthz = new TwitterStrategy({
            consumerKey: consumerKey ,
            consumerSecret: consumerSecret ,
            callbackURL: "http://localhost:3000/authz/twitter/callback",
            userAuthorizationURL: 'https://api.twitter.com/oauth/authorize'
        },
        function(token, tokenSecret, profile, done) {
            user.token = token;
            user.tokenSecret = tokenSecret;
            user.profile = profile;
            user.authorized = true;
            initTwitterOauth();
            done(null, user);
        }
    );
    twitterAuthz.name = 'twitterAuthz';

    passport.use(twitterAuthn);
    passport.use(twitterAuthz);

    app.get('/auth/twitter', passport.authenticate('twitterAuthn'));

    app.get('/authn/twitter/callback', passport.authenticate('twitterAuthn',
        { failureRedirect: '/twittererror' }),
        function(req, res) {
            if (!user.authorized) {
                res.redirect('/authz/twitter');
                return;
            }
            res.redirect('/twitter/' + token);
    });

    app.get('/authz/twitter', passport.authenticate('twitterAuthz'));

    app.get('/authz/twitter/callback', passport.authenticate('twitterAuthz',
        {failureRedirect: '/twittererror'}) ,
        function(req, res) {
            res.redirect('/twitter/' + token);
        }
    );

    initTwitterOauth();

    return passport;
};