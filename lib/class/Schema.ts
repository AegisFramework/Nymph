import DB from "./DB"
import Collection from "./Collection"

interface json {
	[key: string] : any;
}

export default class Schema {
	// Schema Information
	public charset: string;
	public collation: string;
	public engine: string;
	private constrains: string[];
	private properties: json;
	private id: string | number;

	// Table Information
	public name: string;

	constructor (name: string, engine: string, charset: string, collation: string) {
		this.properties = [];
		this.constrains = [];
		this.name = name;
		this.charset = charset;
		this.collation = collation;
		this.engine = engine;
	}

	public getProperties () {
		return new Collection (this.properties);
	}

	public static create (name: string, engine = "InnoDB", charset = "utf8", collation = "utf8_bin") {
		return new Schema (name, engine, charset, collation);
	}

	public toString () {
		return "CREATE TABLE IF NOT EXISTS `" + DB.getName () + "`.`" + this.name + "` (" + this.buildProperties() + " " + this.buildConstrains() + `) ENGINE=${this.engine} CHARSET=${this.charset} COLLATE=${this.collation};`;
	}

	public fields () {
		return Object.keys (this.properties);
	}

	public hasField (field: string) {
		return this.properties.hasOwnProperty (field);
	}

	private buildProperties () {
		let query = "";
		for (let name in this.properties) {
			query += "`" + name + "` ";
			for (let rule of this.properties[name]) {
				query += `${rule} `;
			}
			query += ",";
		}
		return query.replace(/,(\s+)?$/, '');
	}

	private buildConstrains () {
		let query = "";
		if (this.constrains.length > 0) {
			query = ",";
			for (let value of this.constrains) {
				query += `${value},`;
			}

		}
		return query.replace(/,(\s+)?$/, '');
	}

	private addRule (name: string, rule: string) {
		if (!this.properties.hasOwnProperty (name)) {
			this.properties[name] = [];
		}

		if (!(this.properties[name].indexOf (rule) > -1)) {
			this.properties[name].push (rule);
		}
		return this;
	}

	public addConstrain (constrain: string) {
		if (!(this.constrains.indexOf (constrain) > -1)) {
			this.constrains.push (constrain);
		}
		return this;
	}

	public default (name: string, value: string | number) {
		return this.addRule (name, "DEFAULT value");
	}

	public string (name: string, size: number) {
		return this.addRule (name, "VARCHAR(size)");
	}

	public bigInt (name: string, size: number) {
		return this.addRule (name, "BIGINT(size)");
	}

	public text (name: string, size: number) {
		return this.addRule (name, "TEXT(size)");
	}

	public int (name: string, size: number) {
		return this.addRule (name, "INT(size)");
	}

	public decimal (name: string, size: number) {
		return this.addRule (name, "DECIMAL(size)");
	}

	public float (name: string, size: number) {
		return this.addRule (name, "FLOAT(size)");
	}

	public date (name: string) {
		return this.addRule (name, "DATE");
	}

	public dateTime (name: string) {
		return this.addRule (name, "DATETIME");
	}

	public time (name: string) {
		return this.addRule (name, "TIME");
	}

	public boolean (name: string) {
		return this.addRule (name, "BOOLEAN");
	}

	public null (name: string) {
		return this.addRule (name, "NULL");
	}

	public notNull (name: string) {
		return this.addRule (name, "NOT NULL");
	}

	public primary (name: string) {
		this.id = name;
		return this.addRule (name, "PRIMARY KEY");
	}

	public unique (name: string) {
		return this.addRule (name, "UNIQUE");
	}

	public increment (name: string) {
		return this.addRule (name, "AUTO_INCREMENT");
	}

	public index (name: string) {
		return this.addRule (name, "INDEX");
	}

	public foreign (name: string, table: string, property: string, onUpdate: string = "CASCADE", onDelete: string = "RESTRICT"): Schema {
		return this.addConstrain ("FOREIGN KEY (`" + name + "`) REFERENCES `" + DB.getName() + "`.`" + table + "`(`" +property + "`) ON UPDATE " + onUpdate + " ON DELETE " + onDelete);
	}

	public static drop (name: string) {
		DB.query ("DROP TABLE IF EXISTS `name`");
	}

	public static truncate (name: string) {
		DB.query("TRUNCATE TABLE `name`");
	}

	public static commit (schema: Schema) {
		DB.query (schema.toString ());
	}
}