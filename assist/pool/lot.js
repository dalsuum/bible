// import { seek } from "lethil";
import * as base from "./base.js";

// const env = base.env;
// const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;
const pools = base.pools;

/**
 * @example
 * node run pool lot
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export async function doDefault(req) {
  return "default";
}

/**
 * @example
 * node run pool Ej --idx=1
 * node run pool Ej --idx=0 predicate=0
 * node run pool Ej --idx=all
 *
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export async function doEj(req) {
  pools.id = "Ej";
  if (req.query.idx) {
    if (req.query.idx == "all") {
      return await base.indicesPickAll();
    }
    pools.idx = Number(req.query.idx);
  }

  let predicate = pools.idx;
  if (req.query.predicate && req.query.predicate > 0) {
    predicate += Number(req.query.predicate);
  }

  console.log("predicate", predicate);

  if (predicate > 0) {
    const id = pools.id;
    const asset = await base.poolAsset();
    console.log("total", asset.data.length);
    for (let index = 0; index < predicate; index++) {
      // console.log(index, 'asset:',asset.data.length);
      let item = asset.data.shift();
      pools[id].post.push(item);
    }
  }

  await base.indicesPickIndividual(pools.idx);
}

/**
 * @example
 * node run pool Vk --idx=1
 * node run pool Vk --idx=all
 *
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export async function doVk(req) {
  pools.id = "Vk";
  if (req.query.idx) {
    if (req.query.idx == "all") {
      return await base.indicesPickAll();
    }
    pools.idx = Number(req.query.idx);
  }

  let predicate = pools.idx;
  if (req.query.predicate && req.query.predicate > 0) {
    predicate += Number(req.query.predicate);
  }

  console.log("predicate", predicate);

  if (predicate > 0) {
    const id = pools.id;
    const asset = await base.poolAsset();
    console.log("total", asset.data.length);
    for (let index = 0; index < predicate; index++) {
      // console.log(index, 'asset:',asset.data.length);
      let item = asset.data.shift();
      pools[id].post.push(item);
    }
  }

  await base.indicesPickIndividual(pools.idx);
}
