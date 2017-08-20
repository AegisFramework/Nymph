const crypto = require('crypto');

export default class Crypt {

	private static cipher: any;
	private static decipher: any;

	public static key (key: string) {
		this.cipher = crypto.createCipher('aes256', key);
		this.decipher = crypto.createDecipher('aes256', key);
	}

	public static encrypt (data: string): string {
		let encrypted = this.cipher.update(data, 'utf8', 'hex');
		encrypted += this.cipher.final('hex');
		return encrypted;
	}

	public static decrypt (data: string): string {
		let decrypted = this.decipher.update(data, 'hex', 'utf8');
		decrypted += this.decipher.final('utf8');
		return decrypted;
	}


}