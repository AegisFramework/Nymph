const mysql = require('mysql');

export default class DB {

	private static charset: String;
	private static database: String;
	private static host: String;
	private static pass: String;
	private static user: String;
	public static connection: any;

	public static connect (user: String, pass: String, database: String, host: String = "localhost", charset: String = "utf8") {
		DB.host = host;
		DB.user = user;
		DB.pass = pass;
		DB.database = database;
		DB.charset = charset;
		DB.connection = mysql.createConnection({
			host: host,
			user: user,
			password: pass,
			database : database
		});

	}

	public static query (query: String) {
		return new Promise(function (resolve: any, reject: any) {
			DB.connection.query(query, function (error: any, results: any, fields: any) {
				if (error) {
					reject (error);
				} else {
					resolve (results);
				}
			});
		});
	}

}