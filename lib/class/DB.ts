const mysql = require('mysql');

export default class DB {

	private static charset: String;
	private static database: String;
	private static host: String;
	private static pass: String;
	private static user: String;
	public static last: number;
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

	public static name () {
		return this.database;
	}

	public static prepare (query: String, array: any) {
		return 	mysql.format(query, array);
	}

	public static query (query: String, array: any) {
		return new Promise(function (resolve: any, reject: any) {
			let preparedQuery = DB.prepare (query, array);
			DB.connection.query(preparedQuery, function (error: any, results: any, fields: any) {
				if (error) {
					reject (error);
				} else {
					if (typeof results.insertedId !== "undefined") {
						DB.last = results.insertedId;
					}
					resolve (results);
				}
			});
		});
	}

}