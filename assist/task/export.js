// import { seek } from "lethil";
import * as root from "./wbc.root.js";

const env = root.base.env;
// const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

/**
 * Do export for production
 * @example
 * node run task export bible --id=3561
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export async function doExport(req) {
	return "export";
}
