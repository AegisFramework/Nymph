import Collection from "./Collection"
import DB from "./DB"

interface json {
	[key: string] : any;
}

export default class Query {

	private object: Promise<any>;
	private query: string;
	private bindings: any[];
	private results: Collection;

	constructor (query: string = "", bindings: any[] = [], results: any[] = []) {
		this.query = query;
		this.bindings = bindings;
		this.results = new Collection (results);
	}

	public queryObject () {
		return this.object;
	}

	public queryResults () {
		return this.results;
	}

	private append (command: string, data: string | number | any[] = [], bind: boolean = true, ticks: boolean = true) {
		this.query += command + " ";

		if (bind === true) {
			 if (typeof data === "object") {
				if (Object.keys (data).length > 0) {
					for (let d of data) {
						this.query += "?, ";
						this.bindings.push (d);
					}
				}
			} else if (typeof data === "string" || !isNaN(data)) {
				this.query += "?";
				this.bindings.push (data);
			}
		} else {
			if (typeof data === "object") {
			   if (Object.keys (data).length > 0) {
				   for (let d of data) {
					   if (ticks) {
						   this.query += "`" + d + "`, ";
					   } else {
						   this.query += d + ", ";
					   }
				   }
			   }
		   } else if (typeof data === "string" || !isNaN(data)) {
			   if (ticks) {
				   this.query += "`" + data + "`";
			   } else {
				   this.query += `${data}`;
			   }
		   }
		}

		this.query = this.query.replace(/,(\s+)?$/, '') + " ";
		return this;
	}

	public insert () {
		return this.append ("INSERT");
	}

	public into (table: string) {
		return this.append ("INTO", table, false);
	}

	public values (values: json) {
		this.append ("(", Object.keys (values), false);
		this.append (") VALUES");
		this.append ("(", Object.keys (values).map(key => values[key]));
		return this.append (")");
	}

	public update (table: string) {
		return this.append ("UPDATE", table, false);
	}

	public set (values: json) {
		this.append ("SET");
		for(let key in values) {
			this.query += "`" + key + "`=?, ";
			this.bindings.push (values[key]);
		}
		this.query = this.query.replace(/,(\s+)?$/, '') + " ";
		return this;
	}

	public delete () {
		return this.append ("DELETE");
	}

	public not () {
		return this.append ("NOT");
	}

	public between (firstData: string | number, secondData: string | number) {
		this.append ("BETWEEN", firstData);
		this.and ();
		return this.append ("", secondData, true, false);
	}

	public show () {
		return this.query;
	}

	public select (data: string | string[]) {
		return this.append ("SELECT", data, false);
	}

	public as (data: string) {
		return this.append ("AS", data, false);
	}

	public from (data: string | string[]) {
		return this.append ("FROM", data, false);
	}

	public where (data: string | string[]) {
		return this.append ("WHERE", data, false);
	}

	public bind (data: string | string[] | number) {
		this.append ("", data);
	}

	public and (data: string | string[] | null = null) {
		if (data !== null) {
			return this.append ("AND", data, false);
		} else {
			return this.append ("AND");
		}
	}

	public or (data: string | string[]) {
		return this.append ("OR", data, false);
	}

	public like (data: string | string[]) {
		return this.append ("LIKE", "'data'", false, false);
	}

	public equals (data: string | string[] | number) {
		return this.append ("=", data);
	}

	public notEquals (data: string | string[] | number) {
		return this.append ("<>", data);
	}

	public lessThan (data: string | string[] | number) {
		return this.append ("<", data);
	}

	public moreThan (data: string | string[] | number) {
		return this.append (">", data);
	}

	public lessOrEqualThan (data: string | string[] | number | null = null) {
		if (data !== null) {
			return this.append ("<=", data);
		} else {
			return this.append ("<=");
		}
	}

	public moreOrEqualThan (data: string | string[] | number | null = null) {
		if (data !== null) {
			return this.append (">=", data);
		} else {
			return this.append (">=");
		}
	}

	public limit (data: string | string[] | number) {
		return this.append ("LIMIT", data);
	}

	public date (data: string | string[] | number) {
		this.append ("DATE(", data, false);
		return this.append (")");
	}

	public now () {
		return this.append ("NOW()");
	}

	public commit (): Promise<Collection> {
		let sth = DB.query (this.query, this.bindings);
		this.object = sth;
		return sth.then ((results: any) => {
			this.results = new Collection (results);
			return results;
		});
	}

	public toString () {
		return this.query.trim () + ";";
	}

}