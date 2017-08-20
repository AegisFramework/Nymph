const mysql = require('mysql');

export default class DB {

	private static charset: string;
	private static database: string;
	private static host: string;
	private static pass: string;
	private static user: string;
	public static last: number;
	public static connection: any;

	public static connect (user: string, pass: string, database: string, host: string = "localhost", charset: string = "utf8") {
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

	public static getName (): string {
		return this.database;
	}

	public static prepare (query: string, array: any) {
		return 	mysql.format(query, array);
	}

	public static query (query: string, array: any = []) {
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