// import { JSDOM } from "jsdom";
// import * as csv from "csv";
import { seek, fire } from "lethil";

import { env } from "../anchor/index.js";
export { env } from "../anchor/index.js";

/**
 * check file
 */
export const exists = seek.exists;
/**
 * Read file
 */
export const read = seek.read;
/**
 * Wirte file
 */
export const write = seek.write;
/**
 * Read JSON file
 */
export const readJSON = seek.readJSON;
/**
 * Write JSON file
 */
export const writeJSON = seek.writeJSON;

/**
 * Read flat file in break into lines as array
 * @param {string?} file - default is [env.citeFileName]
 * @param {RegExp} separator - default value is linebreak /\n\r/ /[^\r\n]+/g
 * @returns {Promise<string[]>}
 */
export async function flatfile(file, separator = /\r?\n/) {
  if (!file) {
    file = env.citeFileName;
  }
  return read(file).then((e) => e.toString().split(separator));
}

/**
 * Read flat file to List of object
 * @param {string?} file - default is {@link env.citeFileName}
 * @param {RegExp} separator
 * @returns {Promise<env.TypeOfCite[]>}
 */
export async function cite(file) {
  if (!file) {
    file = env.citeFileName;
  }

  const res = [];
  // if (!exists(file)) {
  //   console.log("No such -*- file found".replace("*", file));
  //   return res;
  // }

  const raws = await flatfile(file);

  for (let index = 0; index < raws.length; index++) {
    let ob = raws[index];
    if (ob) {
      let row = citeFlatObject(ob);
      if (row) {
        res.push(row);
      }
    }
  }

  return res;
}

/**
 * `String` to {@link env.TypeOfCite}
 * @example
 * sawmguk = (t:number) (w:sixty) (e:ni ~/kum ~)
 * ord: word
 * des: description
 * t: type
 * w: term
 * e: example
 * s: synonym
 * a: antonym
 * d: definition
 * o: origin
 * @returns {env.TypeOfCite | undefined}
 */
export function citeFlatObject(str) {
  if (str) {
    // var res = str.replace(/[\n\r\t]/gm, "").split(/\|(.*)/g);
    var tst = str.replace(/[\n\r]/gm, "").split(/=(.*)/g);

    let ord = tst[0].replace(/\#.*/g, "$'").trim();
    if (ord == "") {
      return undefined;
    }
    let text = (tst[1] || "").replace(/\[\d+\]/g, "").trim();
    // .replace(/~/gm, ord);

    // Regular expressions
    // const paramRegex = /\((\w):([^()]+)\)/g; // Matches key-value pairs (e.g., (t:n))
    const paramRegex = /\(([a-zA-Z]+):([^()]+)\)/g; // Matches key-value pairs (e.g., (t:n))

    // Extract the main description by removing all key-value pairs
    const cleanedText = text.replace(paramRegex, "").trim();
    const des = cleanedText
      .replace(/^\s*\(([^)]+)\)/, "")
      .replace(/ +/g, " ")
      .trim(); // Remove any leading parentheses-based tags

    // Extract the key-value pairs
    const obj = {t:[]};
    text.replace(paramRegex, (_, key, value) => {
      let val = value.replace(/ +/g, " ").trim(); // double spaces to single / trim
      if (val) {
        if (!obj[key]) {
          obj[key] = [];
        }
        // Push the value into the array
        obj[key].push(...val.split("/").map(e=>e.trim()));
      }

      return "";
    });

    if (obj.t == ''){
      obj.t = ['?'];
    }

    if (ord) {
      const res = { ord };

      Object.keys(obj).forEach(function (key, index) {
        if (key == "t") {
          res[key] = obj[key].join("/");
        } else {
          res[key] = [...new Set(obj[key])];
        }
      });
      if (des) {
        res["des"] = des;
      }
      // return { ord, pos, trm, des, egs, syn, ant, def, org };
      return res;
    }
  }
  return undefined;
}
/**
 * {@link env.TypeOfCite} to `String`
 * @param {env.TypeOfCite} oj
 * @returns {string}
 */
export function citeFlatString(oj){
  let str = [];
  for (const [k, val] of Object.entries(oj)) {
    if (k == 'ord'){
      str.push(val+' =');
    } else if (k == 'des'){
      str.push(val);
    } else {
      let v = val;
      if (Array.isArray(val)){
        v =  val.join('/');
      }
      str.push(`(${k}:${v})`);
    }
  }
  return str.join(' ');
}

/**
 * Group array of strings by first letter
 * @param {string[]} array
 * @returns {{}} -  {a: [ "ab" ], b: [ "ba" ]}
 */
export function groupByFirstletter(array) {
  let resultObj = {};

  for (let i = 0; i < array.length; i++) {
    let currentWord = array[i];
    let firstChar = currentWord[0].toLowerCase();
    let innerArr = [];
    if (resultObj[firstChar] === undefined) {
      innerArr.push(currentWord);
      resultObj[firstChar] = innerArr;
    } else {
      resultObj[firstChar].push(currentWord);
    }
  }
  return resultObj;
}

/**
 * Check whether the first character of a string is uppercase or not
 * @param {string} str
 * @returns {boolean} -
 */
export function checkFirstletterIsUppercase(str) {
  return /^[A-Z]/.test(str);
}

/**
 * @description
 * https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param {any[]} list An array of type V.
 * @param {any} keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 *
 * @example
 * const list = [{pos:"a", name:"Spot"}, {pos:"b", name:"Tiger"},{pos:"c", name:"Rover"}];
 * const grouped = groupBy(list, e => e.pos);
 */
//export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
//    const map = new Map<K, Array<V>>();
export function groupBy(list, keyGetter) {
  const map = new Map();
  // list.forEach((item) => {
  //      const key = keyGetter(item);
  //      const collection = map.get(key);
  //      if (!collection) {
  //          map.set(key, [item]);
  //      } else {
  //          collection.push(item);
  //      }
  // });
  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  }

  return map;
}
