
var mysql = require('mysql');

// Below function creates a DB connection of mySQL

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'aae9afeyp7dhsy.cyo1wsuzp2qo.us-west-2.rds.amazonaws.com',
	    user     : 'nutralife1234',
	    password : 'nutralife1234',
	    database : 'nutralife',
	    port	 : 3306
	});
	return connection;
}


//Below function executes the supplied query

function fetchData(callback,sqlQuery){
	
	console.log("\nExecutor's Query::"+sqlQuery);
	
	var connection=getConnection();
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	

exports.fetchData=fetchData;