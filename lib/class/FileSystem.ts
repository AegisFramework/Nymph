/**
 * ==============================
 * File System
 * ==============================
 */

const fs = require('fs');
const path = require('path');

export default class FileSystem {

	public static findFile (directory: string, file: string): string | null {
		var files = fs.readdirSync (directory);

		for (let i of files) {
			var filename = path.join(directory, i);
			var stat = fs.lstatSync (filename);
			if (stat.isDirectory ()) {
				this.findFile (filename, file);
			} else if (filename.indexOf (file) >= 0) {
				return filename;
			};
		}
		return null;
	}

	private static listDir (path: string) {

	}

	public static read (file: string): string {
		return fs.readFileSync (file, 'utf8');
	}

	public static exists (file: string): boolean {
		return fs.existsSync (file);
	}
}