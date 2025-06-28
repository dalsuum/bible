import { seek } from "lethil";
import * as base from "./base.js";
// import * as root from "./wbc.root.js";

// const env = root.base.env;
// const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

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
 * @property {PoolData} data - asdf
 */

const poolFile = "/tmp/pools/?.tsv";
const pools = {
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
    data: [],
  },

  establish: {
    above: [],
    below: [],
  },
};

/**
 *
 * @param {string} id - Ej, Vk
 * @param {*} separator
 * @returns {Promise<TypeOfPool>}
 */
async function poolAsset(separator = /\r?\n/) {
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
 * @example
 * node run task pools Ej --idx=1
 * node run task pools Ej --idx=all
 * node run task pools Vk --idx=1
 * node run task pools Vk --idx=all
 * node run task pools test
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export async function doDefault(req) {
  switch (req.params.name) {
    case "Ej":
      return doEj(req);
    case "Vk":
      return doVk(req);
    default:
      return doTest(req);
  }
}

/**
 * Testing
 * node run task pools test
 *
 * @param {*} req
 */
async function doTest(req) {
  // let arrs = [8, 3, 23, 11, 17, 19, 33];
  // let combinations = getCombinationsSingle(arrs, 5);

  let srcOne = [6, 6];
  let srcTwo = [4, 4];
  let srcThree = [20, 18];
  let srcFour = [24, 41];
  let srcFive = [50, 49];

  let arrs = [srcOne, srcTwo, srcThree, srcFour, srcFive];

  // let combinations = getCombinations(arrs);

  // console.log(combinations.length);
  // // await base.writeJSON("/tmp/pools/tmp-combinations.json", combinations, 2);

  // let csv = combinations.map((e) => e.map((v) => addPads(v)).join(" "));
  // await seek.write("/tmp/pools/tmp-combinations.csv", csv.join("\n"));

  for (let index = 0; index < arrs.length; index++) {
    const row = arrs[index];
    // let res = a1.filter((e) => !a2.includes(e))
    // let res = arrs.map(e=>e.filter(i=>row.includes(i)));
    // let res = arrs.map((e, i)=>{
    //   // console.log('index', i);
    //   // return e.filter(v=>row.includes(v));
    //   return i != index && e.filter(v=>row.includes(v)).length;
    //   // return i == index ;
    // });
    let res = arrs.map((e, i)=>{
      // console.log('index', i);
      // return e.filter(v=>row.includes(v));
      return i != index && e.filter(v=>row.includes(v)).length;
      // return i == index ;
    });

    // let res = arrs.filter((e, i)=>{
    //   // console.log('index', i);
    //   // return e.filter(v=>row.includes(v));
    //   // return e.filter(v=>!row.includes(v)).length > 0;
    //   return !row.includes(e);
    //   // return i == index ;
    // });


    console.log(res);


  }
  console.log(arrs)
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

async function doEj(req) {
  pools.id = "Ej";
  if (req.query.idx) {
    if (req.query.idx == "all") {
      return await indicesPickAll();
    }
    pools.idx = req.query.idx;
  }

  await indicesPickIndividual(pools.idx);
}

async function doVk(req) {
  pools.id = "Vk";
  // return "Vk";
  if (req.query.idx) {
    if (req.query.idx == "all") {
      return await indicesPickAll();
    }
    pools.idx = req.query.idx;
  }

  await indicesPickIndividual(pools.idx);
}

/**
 *
 * @param {number} idx - index number to begin with
 * @param {boolean} wirteFile
 */
async function indicesPickIndividual(idx, wirteFile = true) {
  const res = await indicesPick(idx, true);
  pools.result.push("");
  await indicesPick(idx, false);

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
    const tals = res.map((e) => e.map((i) => i.val));
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
  }
}

/**
 * Working ???
 */
async function indicesPickAll() {
  const asset = await poolAsset();
  const data = asset.data;

  for (let index = 0; index < data.length; index++) {
    // const element = data[index];

    // await indicesPick(index, true);
    // pools.result.push("");
    // await indicesPick(index, false);
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
 *
 * @param {number} idx - index where to start
 * @param {boolean} isUp
 * @returns {Promise<PoolMakeup[][]>}
 */
async function indicesPick(idx, isUp = true) {
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
  const reward = [];

  pools.result.push(`# Idx:${pools.idx} indices filter: (up-${isUp}) ${dated}`);
  if (idx > 0) {
    const idr = data[idx - 1];
    if (idr) {
      // reward = idr;
      // const ids = idr.map((v) => (v < 10 ? " " : "") + v);
      // const ids = idr.map((v) => addPads(v));
      const ids = idr.map((v) => {
        reward.push(v);
        return addPads(v);
      });
      pools.result.push("# reward " + ids.join(" "));
    }
  }
  // predicate
  const establish = [];

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

    if (reward) {
      const tallet = reward[index];
      const talletIdx = row.findIndex((e) => e.val == tallet);
      establish.push(talletIdx);
    }

    let num = addPads(raw[index]);

    pools.result.push(num + ": " + indices.join(" "));
  }

  if (isUp) {
    pools.establish.above.push(establish);
  } else {
    pools.establish.below.push(establish);
  }

  pools.result.push("# establish reward index " + establish.join(" "));

  // await seek.write(poolFile.replace('?','tmp'),pools.result.join('\n'));

  return res;
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
  const total = data.length;

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

  vals.sort((a, b) => b.seq - a.seq);

  return vals;
}

// indexUpIndices indexDownIndices
// indicesUpIndex indicesDownIndex indicesSearch indicesFind

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
 * @param {number} val
 * @returns
 */
function addPads(val, start = true) {
  if (start) {
    return val.toString().padStart(2, " ");
  }
  return val.toString().padEnd(2, " ");
}
