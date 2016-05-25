var mysql = require('mysql'); // activate the node module
var creds = require('./credentials.js'); // get passwords, etc.
// console.log(creds);

module.exports = {
	/* call makepool() and store in a variable */
	makepool: function () {
		return mysql.createPool({
		  host  : creds.sql.host,
		  user  : creds.sql.user,
		  password: creds.sql.password,
		  database: creds.sql.database
		});
	} 
}