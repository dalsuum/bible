import * as base from "./base.js";

const env = base.env;
// const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

/**
 * late 10:40
 * pian 1:20
 * @example
 * node run bible search tedim1932
 * node run bible search tedim1932 --q Topa kiangah
 * node run bible search niv2011 --q abraham
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export default async function doDefault(req) {
  const identify = req.params.name;
  const keyword = req.query.q;
  const arg = await env.getLookupParameter();
  const res = await env.getBibleByKeyword(identify, keyword, arg);
  let resultFile = "./tmp/result-search.json";
  await base.writeJSON(resultFile, res, 2);
  return "search: " + identify + ", result: " + resultFile;
}
