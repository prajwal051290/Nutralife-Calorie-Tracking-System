//This API renders LOGIN page

var queryExec = require("./queryExecutor");

function bodyprof(req, res){

	console.log("Inside server's BODYPROF API");
	
	res.render("bodyprofile1");
	
	
}


function food(req, res){

	console.log("Inside server's FOOD API");
	
	res.render("foodlog1");
	
	
}


function repo(req, res){

	console.log("Inside server's REPO API");
	
	res.render("graph1");
	
	
}



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
	
	currentCalorie = currentCalorie * 1000;
	
	/*****************************************************************************************/
	
	// THIRD - Calculate calories user needs to burn or gain daily
	
	var differenceWeight, burnCalorieTotal, burnCalorieDaily, goalCalorieDaily;
	var  consumeCalorieTotal, consumeCalorieDaily;
	
	if (goalWeight < weight)  // Meaning user wants to loose weight
	{
		differenceWeight = weight - goalWeight;
		burnCalorieTotal = differenceWeight * 7700;
		burnCalorieDaily = burnCalorieTotal / goalDays;
		goalCalorieDaily = currentCalorie - burnCalorieDaily;
	}
	
	if (goalWeight > weight)  // Meaning user wants to gain weight
	{
		differenceWeight = goalWeight - weight;
		consumeCalorieTotal = differenceWeight * 7700;
		consumeCalorieDaily = consumeCalorieTotal / goalDays;
		goalCalorieDaily = currentCalorie + consumeCalorieDaily;
	}
	
	goalCalorieDaily = goalCalorieDaily / 1000;
	currentCalorie = currentCalorie / 1000;
	
	/*****************************************************************************************/
	
	// FOURTH - Calculate user's BMI
	
	var height_m, BMI;
	
	height_m = height/100;
	height_m = height_m * height_m;
	BMI = weight/height_m;
	
	calculatedProfile.bmr = BMR;
	calculatedProfile.bmi = BMI;
	calculatedProfile.currentCalorie = currentCalorie;
	calculatedProfile.goalCalorieDaily = goalCalorieDaily;
	
	return calculatedProfile;
	
}


function createBodyProfile1(req, res){

	console.log("Inside server's CREATEBODYPROFILE1 API");
	
	var bodyProfile = {}, calculatedProfile = {};; 
	
	bodyProfile = req.body;
	
	// Server Side Validations
	
	if (bodyProfile.weight === undefined){
		
		res.end("weight");
		
	}else if (bodyProfile.height === undefined){
		
		res.end("height");
		
	}else if (bodyProfile.gender === undefined){
		
		res.end("gender");
		
	}else if (bodyProfile.age === undefined){
		
		res.end("age");
		
	}else if (bodyProfile.activity === undefined){
		
		res.end("activity");
		
	}else if (bodyProfile.goalWeight === undefined){
		
		res.end("goalWeight");
		
	}else if (bodyProfile.goalDays === undefined){
		
		res.end("goalDays");
		
	}else if (bodyProfile.weight === bodyProfile.goalWeight){
		
		res.end("same");
		
	}else{
	
		calculatedProfile = calculateCalorieProfile(parseFloat(bodyProfile.weight), parseFloat(bodyProfile.height), parseInt(bodyProfile.age), bodyProfile.gender, bodyProfile.activity, bodyProfile.goalWeight, bodyProfile.goalDays);
		res.end(JSON.stringify(calculatedProfile));
	}

}




// Graph APIs:


function getUserTypes (req, res){

	var queryString;
	var response;
	var graphJson, graphData = [];
	var color = "#0D52D1";
	
	console.log("Inside Server's getUserTypes function...");

	queryString = "select count(*) as lose from user_body_profile where current_weight > goal_weight";
	console.log("getUserTypes SELECT Query1 is: "+ queryString);
		
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Users who want lose weight fetched successfully");
			
			graphJson = {"Weight Type": "Want To Lose Weight", "Count": results[0].lose.toString()};
			graphData.push(graphJson);
			
			queryString = "select count(*) as gain from user_body_profile where current_weight < goal_weight";
			console.log("getUserTypes SELECT Query2 is: "+ queryString);
			
			queryExec.fetchData(function(err,results){
				
				if(err){
					throw err;
				}
				else 
				{
					graphJson = {"Weight Type": "Want To Gain Weight", "Count": results[0].gain.toString()};
					graphData.push(graphJson);
			
					response = {status:200, results: graphData};
					res.end(JSON.stringify(response));
				}	
		
			},queryString);

		}

	},queryString);
	
}





function getUserGoal (req, res){

	var queryString;
	var response;
	var graphJson, graphData = [];
	var color = "#0D52D1";
	
	console.log("Inside Server's getUserTypes function...");

	queryString = "select count(*) as meet from user_body_profile where meet_goal = 'Y'";
	console.log("getUserTypes SELECT Query1 is: "+ queryString);
		
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{				
			console.log("Users who want lose weight fetched successfully");
			
			graphJson = {"Goal": "Reaching Calorie Consumption Goal", "Count": results[0].meet.toString()};
			graphData.push(graphJson);
			
			queryString = "select count(*) as down from user_body_profile where meet_goal = 'D'";
			console.log("getUserTypes SELECT Query2 is: "+ queryString);
			
			queryExec.fetchData(function(err,results){
				
				if(err){
					throw err;
				}
				else 
				{
					graphJson = {"Goal": "Short of Calorie Consumption Goal", "Count": results[0].down.toString()};
					graphData.push(graphJson);
					
					
					queryString = "select count(*) as up from user_body_profile where meet_goal = 'U'";
					console.log("getUserTypes SELECT Query3 is: "+ queryString);
					
					queryExec.fetchData(function(err,results){
						
						if(err){
							throw err;
						}
						else 
						{
							graphJson = {"Goal": "Exceeding Calorie Consumption Goal", "Count": results[0].up.toString()};
							graphData.push(graphJson);
								
							response = {status:200, results: graphData};
							res.end(JSON.stringify(response));
							
						}
						
					},queryString);
						
				}	
		
			},queryString);

		}

	},queryString);
	
}

exports.bodyprof=bodyprof;
exports.food=food;
exports.repo=repo;
exports.createBodyProfile1=createBodyProfile1;
exports.getUserTypes=getUserTypes;
exports.getUserGoal=getUserGoal;