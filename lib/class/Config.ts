import FileSystem from './FileSystem'

export default class Config {

	public static get(property: String): String  {
		if (FileSystem.exists(__dirname + "/../../.conf")) {
			let content = FileSystem.read(__dirname + "/../../.conf");
			let matches = content.match (new RegExp(`${property}\\s=\\s.*`, "g"));
			if (matches !== null) {
				let expression = matches[0].split (" = ");
				return expression[1];
			} else {
				return "";
			}
		} else {
			return "";
		}
	}
}