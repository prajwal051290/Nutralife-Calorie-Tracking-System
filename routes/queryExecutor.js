
var mysql = require('mysql');

// Below function creates a DB connection of mySQL

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'Mysql1990',
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