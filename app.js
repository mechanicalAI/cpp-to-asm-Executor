// Generated by CoffeeScript 1.10.0
(function() {
  var app, cluster, express, http, i, j, middle, numCPUs, path, ref, routes, session, sessionStore;

  cluster = require('cluster');

  numCPUs = require('os').cpus().length;

  if (cluster.isMaster) {
    for (i = j = 1, ref = numCPUs; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      cluster.fork();
    }
  } else {
    express = require('express');
    routes = require('./routes');
    http = require('http');
    path = require('path');
    middle = {};
    middle.bodyParser = require("body-parser");
    middle.cookieParser = require("cookie-parser");
    middle.favicon = require("serve-favicon");
    middle.session = require("express-session");
    middle.methodOverride = require("method-override");
    app = express();
    sessionStore = new middle.session.MemoryStore();
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(middle.favicon(path.join(__dirname, "public/favicon.ico")));
    app.use(middle.bodyParser());
    app.use(middle.methodOverride());
    app.use(middle.cookieParser("Secret"));
    session = middle.session({
      store: sessionStore,
      genid: function() {
        return require("crypto").randomBytes(16).toString('hex');
      },
      secret: "Jay Chou",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 600000
      }
    });
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express["static"](path.join(__dirname, 'public')));
    app.use(function(a, b, next) {
      return next();
    });
    app.post('/launch', session, routes.launchpost);
    app.post('/request', session, routes.reqpost);
    app.use(routes.error404);
    http.createServer(app).listen(app.get('port'), function() {
      var process;
      console.log("Express server listening on port " + app.get('port'));
      return process = {};
    });
  }

}).call(this);