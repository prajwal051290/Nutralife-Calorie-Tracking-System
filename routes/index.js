
/*
 * GET home page.
 */

var queryExec = require("./queryExecutor");
var ejs = require("ejs");

//This API renders INDEX page

function index (req, res) {
	
	console.log("Inside server's INDEX API");
	res.render("index");
}

//This API renders LOGIN page

function login(req, res){

	console.log("Inside server's LOGIN API");
	
	if (req.session.emailid){
		
		res.render("bodyprofile");
		
	}else{
		
		res.render("login");
		
	}
	
}


//This API renders SIGNUP page

function signup(req, res){
	
	console.log("Inside server's SIGNUP API");
	
	if (req.session.emailid){
		
		res.render("bodyprofile");
		
	}else{
		
		res.render("signup");
		
	}
	
}

//This API renders HOME page

function home(req, res){

	console.log("Inside server's HOME API");
	
	if (req.session.emailid){
		
		res.render("home");
		
	}else{
		
		res.render("index");
		
	}
	
	
}


//This API renders FOODLOG page

function foodlog(req, res){

	console.log("Inside server's FOODLOG API");
	
	if (req.session.emailid){
		
		res.render("foodlog");
		
	}else{
		
		res.render("index");
		
	}
	
}

//This API renders BODYPROFILE page

function bodyprofile(req, res){

	console.log("Inside server's BODYPROFILE API");
	
	if (req.session.emailid){
		
		res.render("bodyprofile");
		
	}else{
		
		res.render("index");
		
	}
	
}



//This API renders REPORTS page

function graph(req, res){

	console.log("Inside server's GRAPH API");
	
	if (req.session.emailid){
		
		res.render("graph");
		
	}else{
		
		res.render("index");
		
	}
	
}


// This API renders INDEX page on LOGOUT

function logout(req, res){

	console.log("Inside server's LOGOUT API");
	req.session.destroy();
	res.render('index');
}


// This function creates new account in NUTRALIFE.

function newAccount(req, res){
	
	var signUpInfo, queryString, newAccountInfo;
	
	console.log("Inside Server's newAccount function...");
	
	newAccountInfo = req.body;
	
	//Check if the Email ID user is giving while creating an account already exists. If yes then, don't allow to create an account.
	
	queryString = "SELECT emailid FROM users WHERE emailid = '" + newAccountInfo.emailid + "'";  
	console.log("Account already exists Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				
				if(results.length > 0){
					console.log("Email ID already exists");
					res.end();
				}
				
				else{
					console.log("Creating account...");
					
					queryString = "INSERT INTO users (`emailid`, `first_name`, `last_name`, `password`) VALUES ('" + newAccountInfo.emailid + 
								  "', '" + newAccountInfo.first_name + "', '" + newAccountInfo.last_name + "', '" + newAccountInfo.password + "')";
					
					console.log("Sign Up Query is: "+ queryString);
					
					queryExec.fetchData(function(err,results){
						if(err){
							throw err;
						}
						else 
						{
								req.session.emailid = newAccountInfo.emailId;
								console.log("Successful Sign UP");
								res.end();
								
						}	
					},queryString);

				}
			
			}	
		},queryString);
	
		
}


//This function signs user in NUTRALIFE.

function signIn(req, res){
	
	var loginInfo, queryString, signInInfo;
	
	console.log("Inside Server's signIn function...");
	
	signInInfo = req.body;
	
	//Check if the Email ID and Password exists in the system.
	
	queryString = "SELECT emailid FROM users WHERE emailid = '" + signInInfo.emailid + "' AND password = '" + signInInfo.password + "'";  
	console.log("Login Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				
				if(results.length > 0){
					req.session.emailid = signInInfo.emailid;
					console.log("Allow Login");
					res.end();
				}
				
				else{
					console.log("Invalid Login...");
				}
			
			}	
		},queryString);
	
		
}


// This function calculates user's current pattern of calorie consumption and ideal calories user should be consuming daily.

/*

 This API should be smart enough to handle below cases:
 
 1. Target Weight > Current Weight 
 2. Target Weight < Current Weight
 3. Target Weight = Current Weight (Already reached Goal)
 
 */

// BMI Calculation is remaining...
//Take care of parseInt and parseFloat

function calculateCalorieProfile(weight, height, age, gender, exerciseType, goalWeight, goalDays){
	
	var BMR, currentCalorie, targetCalorie;
	var calculatedProfile = {};
	
	/*****************************************************************************************/
	
	// FIRST - Calculate BMR
	
	if (gender === "M")
	{
		BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
		
	}
	
	if (gender === "F")
	{
		BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
	}
	
	/*****************************************************************************************/
	
	// SECOND - Calculate Current Calorie Consumption 
	console.log("hi..." + exerciseType);
	if (exerciseType === "A") // Little to no exercise
	{
		console.log("Hello.....");
		currentCalorie = BMR * 1.2;
	}
	
	if (exerciseType === "B") // Light exercise (1–3 days per week)
	{
		currentCalorie = BMR * 1.375;
	}
	
	if (exerciseType === "C") // Moderate exercise (3–5 days per week)
	{
		currentCalorie = BMR * 1.55;
	}
	
	if (exerciseType === "D") // Heavy exercise (6–7 days per week)
	{
		currentCalorie = BMR * 1.725;
	}
	
	if (exerciseType === "E") // Very heavy exercise (twice per day, extra heavy workouts)
	{
		currentCalorie = BMR * 1.9;
	}
	
	/*****************************************************************************************/
	
	// THIRD - Calculate calories user needs to burn or gain daily
	
	var differenceWeight, burnCalorieTotal, burnCalorieDaily, goalCalorieDaily;
	var  consumeCalorieTotal, consumeCalorieDaily;
	
	if (goalWeight < weight)  // Meaning user wants to loose weight
	{
		differenceWeight = weight - goalWeight;
		burnCalorieTotal = differenceWeight * 3500;
		burnCalorieDaily = burnCalorieTotal / goalDays;
		goalCalorieDaily = currentCalorie - burnCalorieDaily;
	}
	
	if (goalWeight > weight)  // Meaning user wants to gain weight
	{
		differenceWeight = goalWeight - weight;
		consumeCalorieTotal = differenceWeight * 3500;
		consumeCalorieDaily = consumeCalorieTotal / goalDays;
		goalCalorieDaily = currentCalorie + consumeCalorieDaily;
	}
	
	/*****************************************************************************************/
	
	// FOURTH - Calculate user's BMI
	
	calculatedProfile.bmr = BMR;
	calculatedProfile.currentCalorie = currentCalorie;
	calculatedProfile.goalCalorieDaily = goalCalorieDaily;
	
	return calculatedProfile;
	
}


//This function creates user's Body Profile.
// Take care of parseInt and parseFloat
/*
function createBodyProfile(req, res){
	
	var bodyProfileInfo, queryString;
	var calculatedProfile = {};
	
	console.log("Inside Server's createBodyProfile function...");
	
	bodyProfileInfo = req.body;
	
	calculatedProfile = calculateCalorieProfile(parseInt(bodyProfileInfo.current_weight), + 
						parseInt(bodyProfileInfo.current_height), parseInt(bodyProfileInfo.age), bodyProfileInfo.gender, + 
						bodyProfileInfo.exercis_type, bodyProfileInfo.goal_weight, bodyProfileInfo.goal_days);
	
	queryString = "INSERT INTO user_body_profile (`emailid`, `gender`, 'age', `current_weight`, `current_height`, 'exercise_type', " +
				  "'goal_weight', 'goal_days', 'bmr', 'current_calorie', 'target_calorie') VALUES ('" + req.session.emailid + "', '" + bodyProfileInfo.gender + "', '" + 
				  parseInt(bodyProfileInfo.age) + "', '" + parseInt(bodyProfileInfo.current_weight) + "', '" +
				  parseInt(bodyProfileInfo.current_height) + "', '" + bodyProfileInfo.exercis_type + "', '" + 
				  parseInt(bodyProfileInfo.goal_weight) + "', '" +  parseInt(bodyProfileInfo.goal_days) + "', '" +
				  calculatedProfile.bmr + "', '" + calculatedProfile.currentCalorie + "', '" + calculatedProfile.goalCalorieDaily + "')";
	
	
	console.log("bodyProfileInfo INSERT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Body profile for " + bodyProfileInfo.emailid + " created successfully!!!");
		}	
		
	},queryString);
	
		
}
*/

//This function updates user's Body Profile.
// Do not allow user to change the gender
// Discuss if this api is to be implemented or not

function updateBodyProfile(req, res){
	
	
}

// This API searches a particular food entered by the user and displays it's detailed nutrition composition

function searchFoodDB (req, res){

	var searchFood, queryString;
		
	console.log("Inside Server's searchFoodDB function...");
	
	searchFood = req.body;
	
	queryString = "SELECT * FROM food_db WHERE food_name = '" + searchFood.food_name + "'";
	
	
	console.log("searchFoodDB SEARCH Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Food Nutritional values fetched from FOOD_DB successfully!!!");
			res.end(JSON.stringify(results));
		}	
		
	},queryString);

}


//This API logs user's daily food consumption
// Need to check, how to insert date in mySQL.. USER_FOOD_LOG table

function userFoodLog (req, res){

	var foodLog, queryString;
		
	console.log("Inside Server's userFoodLog function...");
	
	foodLog = req.body;
	
	queryString = "INSERT INTO user_food_log (`emailid`, `food_name`, `food_type`, `log_day`, 'food_calories') VALUES ('" + 
				  req.session.emailid + "', '" + foodLog.food_name + "', '" + foodLog.food_type + "', '" + foodLog.log_day + "', '" +
				  foodLog.food_calories + "')";
	
	
	console.log("userFoodLog INSERT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("user's food logged in USER_FOOD_LOG table successfully!!!");
			res.end();
		}	
		
	},queryString);

}

//This API pulls user's profile - To show at the top of the page

function userProfile (req, res){

	var foodLog, queryString;
		
	console.log("Inside Server's USERPROFILE function...");
	
	queryString = "SELECT first_name, last_name FROM users WHERE emailid = '" + req.session.emailid + "'";
	
	
	console.log("userProfile SELECT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("user's profile fetched successfully!!!");
			res.end(JSON.stringify(results));
		}	
		
	},queryString);

}



//This API pulls user's today's goal for calories

function getGoalCalories (req, res){

	var foodLog, queryString;
		
	console.log("Inside Server's GETGOALCALORIES function...");
	
	queryString = "SELECT target_calorie FROM user_body_profile WHERE emailid = '" + req.session.emailid + "'";
	
	console.log("getGoalCalories SELECT Query is: "+ queryString);
		
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("user's Goal Calorie fetched successfully!!!");
			res.end(JSON.stringify(results));
		}	
		
	},queryString);

}



//This API pulls user's today's calorie information to display his updated dashboard

function getTodayCalories (req, res){

	var queryString;
	var finalResult = {};
	
	console.log("Inside Server's GETTODAYCALORIES function...");
	
	// First find out calories consumed in a day
	
	queryString = "SELECT SUM(log_calories) as consume_calories FROM user_food_exercise_log WHERE log_type <> 'E' " +
				  "and log_day = CURDATE() and emailid = '" + req.session.emailid + "'";
	
	
	console.log("Consume Calories SELECT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("user's consume calories fetched successfully!!!");
			console.log("Total Consumption of calories today: " + results[0].consume_calories);
			
			// Second find out calories burned in a day
			
			queryString = "SELECT SUM(log_calories) as burn_calories FROM user_food_exercise_log WHERE log_type = 'E' " +
						  "and log_day = CURDATE() and emailid = '" + req.session.emailid + "'";
			
			
			console.log("Burned Calories SELECT Query is: "+ queryString);
			
			
			queryExec.fetchData(function(err,results1){
				
				if(err){
					throw err;
				}
				else 
				{				
					console.log("user's burn calories fetched successfully!!!");
					console.log("Total burned of calories today: " + results1[0].burn_calories);
					finalResult.consumed = results[0].consume_calories;
					finalResult.burned = results1[0].burn_calories;
					finalResult.net = results[0].consume_calories - results1[0].burn_calories;
					res.end(JSON.stringify(finalResult));
					
				}	
				
			},queryString);

			
		}	
		
	},queryString);

}


//This API pulls food details from FOOD_DB

function getFoodDetails (req, res){

	var queryString;
	var foodName = {}; 
	
	console.log("Inside Server's GETFOODDETAILS function...");
		
	foodName = req.body;
	
	queryString = "SELECT * FROM food_db WHERE food_name = '" + foodName.food_name + "'";
	
	console.log("FOOD_DB SELECT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Food Details fetched successfully!!!");
			res.end(JSON.stringify(results));
					
		}	
		
	},queryString);

}


//This API pulls food details from FOOD_DB

function getExerciseDetails (req, res){

	var queryString;
	var exerciseName = {}; 
	
	console.log("Inside Server's GETEXERCISEDETAILS function...");
		
	exerciseName = req.body;
	
	queryString = "SELECT * FROM exercise_db WHERE exercise_name = '" + exerciseName.exercise_name + "'";
	
	console.log("EXERCISE_DB SELECT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Exercise Details fetched successfully!!!");
			res.end(JSON.stringify(results));
					
		}	
		
	},queryString);

}



//This API updates user's catalog with food

function addToCatalog (req, res){

	var queryString;
	var catalog = {}; 
	
	console.log("Inside Server's ADDTOCATALOG function...");
		
	catalog = req.body;
	
	queryString = "INSERT INTO user_food_exercise_log (emailid, log_name, log_type, log_day, log_calories) VALUES " +
				  "('" + req.session.emailid + "', '" + catalog.log_name + "', '" + catalog.log_type + "', CURDATE(), '" + catalog.log_calories + "')";  
	
	console.log("Add To Catalog INSERT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Row inserted to user's catalog successfully!!!");
			res.end();
					
		}	
		
	},queryString);

}



//This API updates user's catalog with Exercise

function addToExerciseCatalog (req, res){

	var queryString;
	var catalog = {}; 
	
	console.log("Inside Server's ADDTOEXERCISECATALOG function...");
		
	catalog = req.body;
	
	catalog.log_calories = catalog.log_calories * catalog.exercise_time;
	
	queryString = "INSERT INTO user_food_exercise_log (emailid, log_name, log_type, log_day, log_calories) VALUES " +
				  "('" + req.session.emailid + "', '" + catalog.log_name + "', '" + catalog.log_type + "', CURDATE(), '" + catalog.log_calories + "')";  
	
	console.log("Add To Exercise Catalog INSERT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Row inserted to user's catalog successfully!!!");
			res.end();
					
		}	
		
	},queryString);

}


//This API creates user's body profile

function createBodyProfile (req, res){

	var queryString;
	var bodyProfile = {}, calculatedProfile = {};; 
	
	console.log("Inside Server's CREATEBODYPROFILE function...");
		
	bodyProfile = req.body;
	
	calculatedProfile = calculateCalorieProfile(parseFloat(bodyProfile.weight), parseFloat(bodyProfile.height), parseInt(bodyProfile.age), bodyProfile.gender, bodyProfile.activity, bodyProfile.goalWeight, bodyProfile.goalDays);
	
	queryString = "INSERT INTO user_body_profile (emailid, gender, current_weight, current_height, goal_weight, goal_days, exercise_type, age, " +
				  "bmr, current_calorie, target_calorie) VALUES " +
				  "('" + req.session.emailid + "', '" + bodyProfile.gender + "', '" + bodyProfile.weight + "', '" + bodyProfile.height + "', '" +
				  bodyProfile.goalWeight + "', '"  + bodyProfile.goalDays + "', '" + bodyProfile.activity + "', '" + bodyProfile.age + "', '" + 
				  calculatedProfile.bmr + "', '" + calculatedProfile.currentCalorie + "', '" + calculatedProfile.goalCalorieDaily + "')";
		
	console.log("BodyProfile INSERT Query is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Row inserted to user_body_profile successfully!!!");
			res.end();
					
		}	
		
	},queryString);

}



// This API checks if User's Body Profile was created. It is must to use the system's other features

function getBodyProfile (req, res){

	var queryString;
	var response;
	
	console.log("Inside Server's getBodyProfile function...");
		
	//bodyProfile = req.body;
	
	queryString = "SELECT * FROM user_body_profile WHERE emailid = '" + req.session.emailid + "'";	
	console.log("getBodyProfile SELECT Query is: "+ queryString);
		
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			if (results.length > 0){
				
				console.log("User' Body Profile is present in the system");
				response = {status:200, results: results};
				res.end(JSON.stringify(response));
				
			}else{
				
				console.log("User' Body Profile is not present in the system");
				response = {status:300};
				res.end(JSON.stringify(response));
				
			}
					
		}	
		
	},queryString);

}


/*
 * APIs for Self Analysis - Graphs
 */

// This APIs Daily Calories Consumption for Graph representation

function getDailyConsumedCalories (req, res){

	var queryString;
	var response;
	var graphJson, graphData = [];
	var tzoffset;
	var localISOTime;
	var color = "#0D52D1";
	
	console.log("Inside Server's getDailyConsumedCalories function...");

	queryString = "SELECT SUM(log_calories) as log_calories, log_day from user_food_exercise_log where log_type = 'F' group by (log_day)";
	console.log("getDailyConsumedCalories SELECT Query is: "+ queryString);
		
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("User's Daily Calorie Consumption fetched successfully");
			//console.log(results)
			for (var i = 0; i < results.length; i++){
				
				tzoffset = results[i].log_day.getTimezoneOffset() * 60000; //offset in milliseconds
				localISOTime = (new Date(results[i].log_day - tzoffset)).toISOString().substring(0, 10);
				
				// Alternate colors of bars in graph
				if (color === "#0D52D1"){
					
					color = "#FF0F00";
					
				}else{
					
					color = "#0D52D1";
					
				}
					
				
				graphJson = {"Day": localISOTime, "Calories": results[i].log_calories.toString(), "color": color};
				graphData.push(graphJson);
				//results[i].color = "#FF0F00";
				
			}
			
			response = {status:200, results: graphData};
			res.end(JSON.stringify(response));
		}	
		
	},queryString);

}


//This APIs Daily Calories Burned for Graph representation

function getDailyBurnedCalories (req, res){

	var queryString;
	var response;
	
	console.log("Inside Server's getDailyBurnedCalories function...");

	queryString = "SELECT SUM(log_calories), log_day from user_food_exercise_log where log_type = 'E' group by (log_day)";
	console.log("getDailyBurnedCalories SELECT Query is: "+ queryString);
		
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("User's Daily Calorie Burned fetched successfully");
			response = {status:200, results: results};
			res.end(JSON.stringify(response));
		}	
		
	},queryString);
	
}


// Rendering Pages APIs

exports.index=index;
exports.login=login;
exports.signup=signup;
exports.home=home;
exports.foodlog=foodlog;
exports.bodyprofile=bodyprofile;
exports.graph=graph;
exports.logout=logout;

// Business Logic APIs

exports.newAccount=newAccount;
exports.signIn=signIn;

exports.createBodyProfile=createBodyProfile;
exports.updateBodyProfile=updateBodyProfile;

exports.searchFoodDB=searchFoodDB;
exports.userFoodLog=userFoodLog;
exports.userProfile=userProfile;
exports.createBodyProfile=createBodyProfile;

exports.getGoalCalories=getGoalCalories;
exports.getTodayCalories=getTodayCalories;

exports.getFoodDetails=getFoodDetails;
exports.getExerciseDetails=getExerciseDetails;

exports.addToCatalog=addToCatalog;
exports.addToExerciseCatalog=addToExerciseCatalog;

exports.getBodyProfile=getBodyProfile;

// Reports APIs - Graphs for Analysis

exports.getDailyConsumedCalories=getDailyConsumedCalories;
exports.getDailyBurnedCalories=getDailyBurnedCalories;