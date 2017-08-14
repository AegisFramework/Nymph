/**
 * ==============================
 * Template
 * ==============================
 */

import FileSystem from './FileSystem'

interface Properties {
	[index: string]: any
};

export default class Template {
	protected page: string | null;
	protected template: string | null;
	protected content: string;

	protected properties: Properties = {
		"_title": "",
		"_keywords": [],
		"_description": "",
		"_twitter": "",
		"_google": "",
		"_shareimage": "",
		"_author": "",
		"_domain": "",
		"_route": "",
		"_fullRoute": "",
		"data": []
	}

	public set (key: string, value: any) {
		this.properties [key] = value;
	}

	public get (key: string): any {
		return this.properties [key];
	}

	public setPage(page: string) {
		this.page = FileSystem.findFile (__dirname + "/../../pages", page);
		this.compileContent ();
	}

	public setTemplate (template: string) {
		this.template = FileSystem.findFile(__dirname + "/../../templates", template);
		this.compileContent ();
	}

	protected compileContent () {
		if (typeof this.page === "string") {
			this.content = FileSystem.read(this.page);
			if (typeof this.template === "string") {
				this.content = this.content.replace (/\{>\{content\}<\}/g, FileSystem.read(this.template));
			}
		} else {
			if (typeof this.template === "string") {
				this.content = FileSystem.read(this.template);
			}
		}
	}


	public setContent (content: string) {
		this.content = content;
	}

	public compile () {
		this.setProperties ();
		this.includeTemplates ();
		this.includeRepeats ();
	}

	protected setProperties () {
		let matches = this.content.match (/\{\{((\w*|\d))\}\}/g);
		if (matches !== null) {
			for (let match of matches) {
				let matchName = match.trim ().replace (/\}\}|\{\{/g, "");

				if (typeof (<any>this).properties[matchName] === "function") {
					this.content = this.content.replace (match, (<any>this).properties[matchName].apply (null, []));
				} else if (typeof (<any>this).properties[matchName] !== "undefined") {
						this.content = this.content.replace (match, (<any>this).properties[matchName]);
				} else if (typeof (<any>this).properties["data"] !== "undefined") {
					if (typeof (<any>this).properties["data"][matchName] !== "undefined") {
						this.content = this.content.replace (match, (<any>this).properties["data"][matchName]);
					}
				}

			}
		}
	}

	protected includeTemplates () {
		let matches = this.content.match (/\{\{>(\s?)(\w*|\d*)\}\}/g);
		if (matches !== null) {
			for (let match of matches) {
			 	let matchName = match.trim ().replace (/\{\{>\s|\}\}/g, "");
				let classFile = FileSystem.findFile(`${__dirname}/../templates`, `${matchName}.ts`);
			    if (classFile != null) {
					let template = require (`${__dirname}/../templates/${matchName}.ts`);
					template = new template.default ();
			    	this.content = this.content.replace (match, template.toString ());
			    } else {
					let found = FileSystem.findFile(`${__dirname}/../../templates`, `${matchName}.html`);

					if (found !== null) {
			    		this.content = this.content.replace (match, FileSystem.read (found));
					}
			    }
			}
		}
	}

	protected includeRepeats () {
		let matches = this.content.match (/\{\{repeat(\s)(\w*|\d*)(\s)(\w*|\d*)\}\}/g);

		if (matches !== null) {
			for (let match of matches) {

				let expression = match.replace (/\{\{repeat\s|\}\}/g, "").trim ().split (" ");

				let className = expression [0];
				let list = expression [1];
				let content = "";
				let objects;

				if (typeof this.properties[list] === "function") {
					objects = this.properties[list].apply (null, []);
				} else if (typeof this.properties[list] !== "undefined") {
					objects = this.properties[list];
				} else {
					return null;
				}

				let classFile = FileSystem.findFile(`${__dirname}/../templates`, `${className}.ts`);
			    if (classFile != null) {
					for (let i in objects) {
						let template = require (`${__dirname}/../templates/${className}.ts`);
						template = new template.default ();
						for (let key in objects[i]) {
							template.set (key, objects[i][key]);
						}
						content += template.toString ();
					}
				} else {
					let found = FileSystem.findFile(`${__dirname}/../../templates`, `${className}.html`);

					if (found !== null) {
						for (let i in objects) {
							let temp = FileSystem.read (found);
							let tempMatches = temp.match (/\{\{((\w*|\d))\}\}/g);

							if (tempMatches !== null) {
								for (let tm of tempMatches) {
									let matchName = tm.trim ().replace (/\}\}|\{\{/g, "");

									if (typeof objects[i][matchName] !== "undefined") {
										temp = temp.replace (tm, objects[i][matchName]);
									}
								}
							}
							content += temp;
						}
					}
				}

				this.content = this.content.replace (match, content);
			}
		}
	}

	public toString(): string {
		this.compile ();
    	return this.content;
	}
}