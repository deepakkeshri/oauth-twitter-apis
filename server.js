var express                 = require('express');
var app                     = express();
var port                    = process.env.port || 3000;
var morgan                  = require('morgan');
var database                = require('./config/database')();
var bodyParser              = require('body-parser');
var router                  = express.Router();
var appRoutes               = require('./app/routes/route')(router);
var path                    = require('path');
var passport                = require('passport');


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended: true}));

var social                  = require('./app/passport/passport.js')(app, passport);

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//start database
database.connect();

app.listen(port,  function() {
    console.log("Server started on port " + port);
});