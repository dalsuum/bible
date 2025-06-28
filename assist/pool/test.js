// import { seek } from "lethil";
import * as base from "./base.js";
// import * as root from "./wbc.root.js";

// const env = root.base.env;
// const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

/**
 * @example
 * node run pool test
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export async function doDefault(req) {
  let arrs = [
    [1, 2, 3, 4, 5],
    [2, 4, 5, 6, 7],
    [10, 11, 12, 13, 14],
    [2, 3, 6, 7, 8, 9],
  ];

  let ref = [2, 3, 4, 5, 6];

  let matchCounts = base.getMatches(arrs, ref);

  console.log(matchCounts); // Output: [4, 4, 0, 3]
}