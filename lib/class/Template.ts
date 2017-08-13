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
		//this.includeTemplates ();
		//this.includeRepeats ();
	}

	protected setProperties () {
			let matches = this.content.match(/\{\{((\w*|\d))\}\}/g);
			if (matches !== null) {
				for (let match of matches){
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

	public toString(): string {
		this.compile ();
    	return this.content;
	}
}