// Load the bcrypt module
var bcrypt = require('bcrypt');
// Generate a salt
var salt = bcrypt.genSaltSync(10);
// Hash the password with the salt
var hash = bcrypt.hashSync("my password", salt);

// Finally just store the hash in your DB
// .. code to store in Redis/Mongo/Mysql/Sqlite/Postgres/etc.



export default class Password {

	public static rounds: number = 10;

	public static hash (password: string) {
		let salt = bcrypt.genSaltSync(Password.rounds);
		return bcrypt.hashSync(password, salt)
	}

}