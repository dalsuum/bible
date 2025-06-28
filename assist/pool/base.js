import { seek } from "lethil";

import { env } from "../anchor/index.js";
export { env } from "../anchor/index.js";

/**
 * @typedef {Array<Array<number>>} PoolData
 *
 * @typedef {Object} PoolMakeup - used in info.language and lang file
 * @property {number} val -
 * @property {number} seq -
 *
 * @typedef {Object} TypeOfPool - used in info.language and lang file
 * @property {Object} rule -
 * @property {number} rule.core -
 * @property {number} rule.total -
 * @property {PoolData} data - result
 * @property {PoolData} post - prediction
 */

export const poolFile = "/tmp/pools/?.tsv";
export const pools = {
  /**
   * Ej, Vk
   */
  id: null,
  file: "",
  idx: 0,
  /**
   * indices filter:
   * @type {number[]}
   */
  result: [],
  /**
   * @type {TypeOfPool}
   */
  Ej: {
    rule: {
      core: 5,
      total: 7,
    },
    post: [],
    data: [],
  },
  /**
   * @type {TypeOfPool}
   */
  Vk: {
    rule: {
      core: 6,
      total: 7,
    },
    post: [],
    data: [],
  },

  // establish: {
  //   above: [],
  //   below: [],
  // },
  establish: {
    above: {
      reward:[],
      post:[]
    },
    below: {
      reward:[],
      post:[]
    },
  },
};

/**
 *
 * @param {string} id - Ej, Vk
 * @param {*} separator
 * @returns {Promise<TypeOfPool>}
 */
export async function poolAsset(separator = /\r?\n/) {
  let id = pools.id;
  // if (pools.hasOwnProperty(id)) {
  //   return pools[id];
  // }
  if (pools[id].data.length > 0) {
    return pools[id];
  }

  // var file = poolFile.replace('?','Ej');
  const file = poolFile.replace("?", id);
  pools.file = file;

  pools[id].data = await seek.read(file).then((e) =>
    e
      .toString()
      .split(separator)
      .map((r) => {
        return r.split("\t").map((w) => (w.includes(".") ? w : Number(w)));
      })
  );
  return pools[id];
}

/**
 * Read JSON file
 */
export const readJSON = seek.readJSON;
/**
 * Write JSON file
 */
export const writeJSON = seek.writeJSON;

/**
 * @param {number} val
 * @returns
 */
export function addPads(val, start = true) {
  if (start) {
    return val.toString().padStart(2, " ");
  }
  return val.toString().padEnd(2, " ");
}

/**
 * Finds the row indices where a value exists at a given column index.
 * @example
 * const data = [[1, 2, 3], [4, 5, 6], [7, 2, 9]];
 * const colIndex = 1; // Column index (user input)
 * const value = 2; // Value to search
 * const result = indicesFind(data, colIndex, value);
 * console.log(result); // [[0, 1], [2, 1]]
 *
 * @param {PoolData} data - The 2D array to search.
 * @param {number} colIndex - The column index to check.
 * @param {any} value - The value to find.
 * @returns {Array<[number, number]>} - Array of tuples [rowIndex, colIndex] where matches are found.
 */
function indicesFind(data, colIndex, value) {
  // return data.map(r=> r.filter(n=> n[1] == 1));
  // const indices = data.map((row, i) => row[0] === 18 ? i : -1).filter(i => i !== -1);
  const result = [];

  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    if (data[rowIndex][colIndex] === value) {
      result.push([rowIndex, colIndex]); // Store both row index and column index
    }
  }

  return result;
}

/**
 *
 * @param {PoolData} data
 * @param {number} v
 * @param {number} i
 * @param {boolean} isUp
 * @returns {PoolMakeup[]}
 */
function indicesMakeup(data, v, i, isUp = true) {
  // const total = data.length;

  let res = indicesFind(data, i, v);

  /**
   * @type {PoolMakeup[]}
   */
  let vals = [];

  for (let index = 0; index < res.length; index++) {
    // const e = res[index];
    let [rowIndex, colIndex] = res[index];

    if (isUp) {
      // good Up
      const rowUp = rowIndex - 1;
      // && rowIndex < total
      if (data[rowUp]) {
        let val = data[rowUp][colIndex];

        let inx = vals.findIndex((e) => e.val == val);

        if (inx == -1) {
          vals.push({ val: val, seq: 1 });
        } else {
          vals[inx].seq++;
        }
      }
    } else {
      // good Up
      const rowDown = rowIndex + 1;
      if (data[rowDown]) {
        let val = data[rowDown][colIndex];

        let inx = vals.findIndex((e) => e.val == val);

        if (inx == -1) {
          vals.push({ val: val, seq: 1 });
        } else {
          vals[inx].seq++;
        }
      }
    }
  }

  // vals.sort((a, b) => b.seq - a.seq);

  return vals;
}

/**
 *
 * @param {number} idx - index where to start
 * @param {boolean} isUp
 * @returns {Promise<PoolMakeup[][]>}
 */
async function indicesPicker(idx, isUp = true) {
  const asset = await poolAsset();
  const data = asset.data;
  /**
   * @type {PoolMakeup[]}
   */
  let raw = JSON.parse(JSON.stringify(data[idx]));
  let dated = raw.pop();
  const res = raw.map((v, i) => indicesMakeup(data, v, i, isUp));

  /**
   * @type {number[]}
   */
  const rewardDigit = [];

  pools.result.push(`# Idx:${pools.idx} indices filter: (up-${isUp}) ${dated}`);
  if (idx > 0) {
    const idr = data[idx - 1];
    if (idr) {
      // rewardDigit = idr;
      // const ids = idr.map((v) => (v < 10 ? " " : "") + v);
      // const ids = idr.map((v) => addPads(v));
      const ids = idr.map((v) => {
        rewardDigit.push(v);
        return addPads(v);
      });
      pools.result.push("# reward digit " + ids.join(" "));
    }
  }
  /**
   * @type {number[]}
   */
  let postDigit = [];

  if (asset.post.length){

    // let abc = asset.post[-1];
    postDigit = asset.post.concat().pop();
    // console.log('last ',abc);
    // console.log('last all ',asset.post);


    // pools.result.push("# establish post index ???");
    pools.result.push("# post " + postDigit.join(" "));
  }

  // predicate
  const rewardIndex = [];
  const postIndex = [];

  for (let index = 0; index < res.length; index++) {
    const row = res[index];

    // addPads(e.val);
    // addPads(e.seq, false);

    let indices = row.map((e) => addPads(e.val) + "." + addPads(e.seq, false));
    // let indices = row.map(
    //   (e) =>
    //     (e.val < 10 ? " " : "") + e.val + "." + e.seq + (e.seq < 10 ? " " : "")
    // );
    // let num = (raw[index] < 10 ? " " : "") + raw[index];

    if (rewardDigit) {
      const tallet = rewardDigit[index];
      const talletIdx = row.findIndex((e) => e.val == tallet);
      rewardIndex.push(talletIdx);
    }
    if (postDigit) {
      const tallet = postDigit[index];
      const talletIdx = row.findIndex((e) => e.val == tallet);
      postIndex.push(talletIdx);
    }

    let num = addPads(raw[index]);

    pools.result.push(num + ": " + indices.join(" "));
  }

  if (isUp) {
    pools.establish.above.reward.push(rewardIndex);
    pools.establish.above.post.push(postIndex);
  } else {
    pools.establish.below.reward.push(rewardIndex);
    pools.establish.below.post.push(postIndex);
  }


  pools.result.push("# establish reward index " + rewardIndex.join(" "));
  pools.result.push("# establish post index " + postIndex.join(" "));


  // await seek.write(poolFile.replace('?','tmp'),pools.result.join('\n'));

  return res;
}

/**
 *
 * @param {number} idx - index number to begin with
 * @param {boolean} wirteFile
 */
export async function indicesPickIndividual(idx, wirteFile = true) {
  const resAbove = await indicesPicker(idx, true);
  pools.result.push("");
  await indicesPicker(idx, false);

  if (wirteFile) {
    const asset = await poolAsset();
    const rule = asset.rule;

    // const file = pools.file.replace(".tsv", "-indicesPick.tsv");
    const file = pools.file.replace(".tsv", `-tmp-indicesPick-${idx}.tsv`);
    const fileCurrent = pools.file.replace(
      ".tsv",
      `-tmp-indicesPick-current.tsv`
    );

    await seek.write(file, pools.result.join("\n"));
    await seek.write(fileCurrent, pools.result.join("\n"));

    console.log("working");

    // TODO: Start pasting here ???
    const tals = resAbove.map((e) => e.map((i) => i.val));
    // let arrs = tals.slice(0, 5);
    const talsCore = tals.slice(0, rule.core);

    const combinationCore = getCombinations(talsCore);

    console.log("combinations core", combinationCore.length);
    // // await base.writeJSON("/tmp/pools/tmp-combinations.json", combinations, 2);

    const combinationCoreCSV = combinationCore.map((e) =>
      e.map((v) => addPads(v)).join(" ")
    );

    const combinationCoreFile = pools.file.replace(
      ".tsv",
      "-tmp-combinations-core.csv"
    );
    await seek.write(combinationCoreFile, combinationCoreCSV.join("\n"));

    const talsExtra = tals.slice(rule.core, rule.total);

    const combinationExtra = getCombinations(talsExtra);

    console.log("combinations extra", combinationExtra.length);
    // // await base.writeJSON("/tmp/pools/tmp-combinations.json", combinations, 2);

    const combinationExtraCSV = combinationExtra.map((e) =>
      e.map((v) => addPads(v)).join(" ")
    );

    const combinationExtraFile = pools.file.replace(
      ".tsv",
      "-tmp-combinations-extra.csv"
    );
    await seek.write(combinationExtraFile, combinationExtraCSV.join("\n"));



    // console.log(talsCore);
    const abc =[];
    for (let index = 0; index < talsCore.length; index++) {
      const element = talsCore[index];
      for (let index = 0; index < element.length; index++) {
        const val = element[index];
        // PoolMakeup
        const indexs = abc.findIndex (e=> e.val == val);

        if (indexs > -1){
          abc[index].seq++;
        } else {
          abc.push({val:val, seq:1});
        }
      }

    }
    abc.sort((a,b)=> a.val - b.val);
    // abc.sort((a,b)=> b.seq - a.seq);

    console.log('?0',abc);
  }
}

/**
 * Working ???
 */
export async function indicesPickAll() {
  const asset = await poolAsset();
  const data = asset.data;

  for (let index = 0; index < data.length; index++) {
    // const element = data[index];

    // await indicesPicker(index, true);
    // pools.result.push("");
    // await indicesPicker(index, false);
    await indicesPickIndividual(index, false);
  }

  // const res = pools.establish.map(e=> addPads(e)).join("\n");
  const establishAboveRes = pools.establish.above
    .map((e) => e.map((v) => addPads(v)).join(" "))
    .join("\n");
  const establishAboveFile = pools.file.replace(
    ".tsv",
    `-tmp-establish-above.tsv`
  );
  await seek.write(establishAboveFile, establishAboveRes);

  const establishBelowRes = pools.establish.below
    .map((e) => e.map((v) => addPads(v)).join(" "))
    .join("\n");
  const establishBelowFile = pools.file.replace(
    ".tsv",
    `-tmp-establish-below.tsv`
  );
  await seek.write(establishBelowFile, establishBelowRes);
}

/**
 *  4 × 7 × 4 × 5 × 7 = 3920
 * @example
 * let srcOne = [4, 6, 7, 2];
 * let srcTwo = [8, 3, 23, 11, 17, 19, 33];
 * let srcThree = [20, 18, 30, 24];
 * let srcFour = [24, 41, 29, 31, 39];
 * let srcFive = [50, 49, 46, 47, 43, 45, 35];
 * let allArrays = [srcOne, srcTwo, srcThree, srcFour, srcFive];
 *
 * let res = getCombinations(allArrays);
 *
 * @param {number[]} arrays - []
 * @param {number} k - matches
 * @returns
 */
function getCombinations(arrays) {
  // let result = [];

  // function combine(currentCombo, depth) {
  //   if (depth === arrays.length) {
  //     result.push([...currentCombo]);
  //     return;
  //   }

  //   for (let i = 0; i < arrays[depth].length; i++) {
  //     currentCombo.push(arrays[depth][i]);
  //     combine(currentCombo, depth + 1);
  //     currentCombo.pop();
  //   }
  // }

  // combine([], 0);

  // function combine(currentCombo, depth, usedValues) {
  //   if (depth === arrays.length) {
  //     result.push([...currentCombo]);
  //     return;
  //   }

  //   for (let i = 0; i < arrays[depth].length; i++) {
  //     let value = arrays[depth][i];

  //     if (!usedValues.has(value)) {
  //       currentCombo.push(value);
  //       usedValues.add(value);
  //       combine(currentCombo, depth + 1, usedValues);
  //       currentCombo.pop();
  //       usedValues.delete(value);
  //     }
  //   }
  // }

  // combine([], 0, new Set());

  // return result;

  let result = new Set(); // Use a Set to store unique sorted combinations as strings

  function combine(currentCombo, depth, usedValues) {
    if (depth === arrays.length) {
      let sortedCombo = [...currentCombo].sort((a, b) => a - b); // Sort numbers in ascending order
      // result.add(sortedCombo.join(",")); // Store as a unique string in Set
      result.add(JSON.stringify(sortedCombo)); // Store as JSON string to ensure uniqueness
      return;
    }

    for (let i = 0; i < arrays[depth].length; i++) {
      let value = arrays[depth][i];

      if (!usedValues.has(value)) {
        currentCombo.push(value);
        usedValues.add(value);
        combine(currentCombo, depth + 1, usedValues);
        currentCombo.pop();
        usedValues.delete(value);
      }
    }
  }

  combine([], 0, new Set());

  // Convert Set back to array format
  // return Array.from(result).map((str) => str.split(",").map(Number));

  // Convert Set back to array format and sort everything in ascending order
  // return Array.from(result)
  //   .map((str) => str.split(",").map(Number))
  //   .sort((a, b) => a.join("").localeCompare(b.join(""))); // Sort numerically

  // Convert Set back to an array and ensure numerical sorting
  return Array.from(result)
    .map((str) => JSON.parse(str)) // Convert back to array
    .sort(
      (a, b) =>
        a[0] - b[0] || a[1] - b[1] || a[2] - b[2] || a[3] - b[3] || a[4] - b[4]
    ); // Sort correctly
}

/**
 * @example
 * let arrs = [
 *   [1, 2, 3, 4, 5],
 *   [2, 4, 5, 6, 7],
 *   [10, 11, 12, 13, 14],
 *   [2, 3, 6, 7, 8, 9],
 * ];
 *
 * let ref = [2, 3, 4, 5, 6];
 *
 * let matchCounts = getMatches(arrs, ref);
 * console.log(matchCounts); // Output: [4, 4, 0, 3]

 * @param {number[][]} arrs - Loops through each sub-array in `arrs`
 * @param {number[]} ref - Filters elements that exist in `ref`
 * @returns {number[]}
 */
export function getMatches(arrs, ref) {
  const refSet = new Set(ref); // Convert to Set for O(1) lookups

  return arrs.map((sub) =>
    sub.reduce((count, num) => count + refSet.has(num), 0)
  );
}
