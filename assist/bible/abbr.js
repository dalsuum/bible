// import { fire } from "lethil";
import * as base from "./base.js";

const env = base.env;
const config = env.config;
const listOfBible = env.listOfBible;
const category = env.category;
// const structure = env.structure;
// const bibles = [];

/**
 * Abbreviation
 * @example
 * node run bible abbr tedim1932 --q="Gen.1.3;Gen.2.3"
 * node run bible abbr niv2011 --q="Gen.36:2,14,18,34:2; 2Sa.20:2"
 * node run bible abbr niv2011 --q="Gen.36:2,14,18,37:2; Gen.21:2"
 * node run bible abbr niv2011 --q="Gen.36.2,14,18,37.2; Gen.21:2"
 * @param {any} req -
 */
export default async function doDefault(req) {
  // /^(\d?[A-Za-z ]+)?\.?\s?(\d+)[.: ](\d+)$/

  // const ref = "1.1.3";

  // var re = /^(\d?[A-Za-z ]+)?\.?\s?(\d+)[.: ](\d+)$/.exec(ref);
  // console.log(re);
  return working(req);
}

async function working(req) {
  const identify = req.params.name;
  const selection = req.query.q;

  // const selection = "Gen 1:3, 2:7-9; Exo 2:4";
  // const selection = "Gen 1:3,2:7-9; Gen 2:2; Exo 2:4";
  // const selection = "Thu Hilhkikna 28:39, 28:59, 32:42";
  // const selection = "Gen.1:3, 2:3-5; Exo.2:4; Gamlak Vakna 2:9";
  // const selection = "Gamlak Vakna 2:19-25";
  // const selection = "Gen.1.3, 5-7; 1Sa.2.4; Gamlak Vakna 2:4";
  // const selection = "Gen.1:3,2:7-9,11;Exo.2:4";
  // const selection = "Est.4.6; Gen.1.3, 9, 11; Exo 2:4";
  // const selection = "Gen.1.3-4, 4; Gen.2.4";
  // const selection = "Gen.1.3-4, 4; Gen.1.4";
  // const selection = "Est.4:3,6; Gen.1.2-8; Exo 2:4";

  if (!selection) {
    return "no selection";
  }

  const reference = env.referenceQuery(selection);

  console.log(reference);

  if (!reference.length) {
    return "no reference";
  }

  const res = await env.getBibleByReference(identify, reference);

  let resultFile = "./tmp/result-abbr.json";
  await base.writeJSON(resultFile, res, 2);

  return "abbreviation: " + identify + ", result: " + resultFile;
}
