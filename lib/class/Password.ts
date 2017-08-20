// Load the bcrypt module
var bcrypt = require('bcrypt');

export default class Password {

	public static rounds: number = 10;

	public static hash (password: string): string {
		let salt = bcrypt.genSaltSync(Password.rounds);
		return bcrypt.hashSync(password, salt)
	}

	public static compare (password: string, hash: string): boolean {
		return bcrypt.compareSync(password, hash);
	}

}