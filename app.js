
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
 // , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  //Importing the 'client-sessions' module
  , session = require('client-sessions');

var app = express();

//configure the sessions with our application
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,  }));


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/********* GET REQUESTS *************/

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/signup', routes.signup);

app.get('/home', routes.home);
app.get('/foodlog', routes.foodlog);

app.get('/logout', routes.logout);

app.get('/userProfile', routes.userProfile);
app.get('/bodyprofile', routes.bodyprofile);

app.get('/getGoalCalories', routes.getGoalCalories);
app.get('/getTodayCalories', routes.getTodayCalories);

app.get('/getBodyProfile', routes.getBodyProfile);

app.get('/graph', routes.graph);

app.get('/email', routes.email);

/********* REPORT APIs *************/

app.get('/getDailyConsumedCalories', routes.getDailyConsumedCalories);
app.get('/getDailyBurnedCalories', routes.getDailyBurnedCalories);

app.get('/getFoodLog', routes.getFoodLog);
app.get('/getExerciseLog', routes.getExerciseLog);


/********* POST REQUESTS *************/

app.post('/newaccount', routes.newAccount);
app.post('/signin', routes.signIn);

app.post('/getFoodDetails', routes.getFoodDetails);
app.post('/getExerciseDetails', routes.getExerciseDetails);

app.post('/addToCatalog', routes.addToCatalog);
app.post('/addToExerciseCatalog', routes.addToExerciseCatalog);

app.post('/createBodyProfile', routes.createBodyProfile);


app.post('/sendEmail', routes.sendEmail);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Nutralife server listening on port " + app.get('port'));
});
