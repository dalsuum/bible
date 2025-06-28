import * as base from "./base.js";

const env = base.env;
const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

/**
 * Testing
 * @example
 * node run cite test bname
 * @param {any} req
 */
export default async function doDefault(req) {
  // return formating(req);

  const task = req.params.name;

  switch (task) {
    case "bname":
      return getBibleBookName(req);
    default:
    case "tmp":
      return getTmp(req);
  }
}
/**
 * @param {any} req
 */
async function getTmp(req) {
  return '???';
}

/**
 * @param {any} req
 */
async function getBibleBookName(req) {
  const res = [];

  const refList = ["tedim1932", "niv2011", "1"];

  for (let index = 0; index < refList.length; index++) {
    const id = refList[index];
    const rf = await env.loadBible(id);

    for (const [bId, val] of Object.entries(rf.bible.book)) {
      const name = val.info.name;

      let idx = res.findIndex((e) => e.id === bId);

      if (idx >= 0) {
        if (res[idx].w.length) {
          // if w not is empty, check duplicate
          if (!res[idx].w.includes(name)) {
            res[idx].w.push(name);
          }
        } else {
          // if w is empty, just add
          res[idx].w.push(name);
        }
        // console.log("found", idx, name);
      } else {
        // console.log("test", idx, bId, name);
        res.push({ id: bId, ord: name, w: [], q: "" });
      }

      // console.log("res", bId);
      // console.log('ref',id,name);
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(" ", id);
  }

  const fmt = ["-- Bible Book name"];

  for (let index = 0; index < res.length; index++) {
    const element = res[index];
    // esv

    let tpl = "* = (t:book) (w:!)"
      .replace("*", element.ord)
      .replace("!", element.w.join("/"));
    fmt.push(tpl);
  }

  console.log(fmt.join("\n"));
  // return res;
}

/**
 * Tmp
 * @param {*} req
 * @returns
 */
export async function formating(req) {
  // const res = 'piansak=(t:v) (w:produce/generate) ?? (s:piangsak)';
  // // const res = 'nai=(t:part) particle prefixed to form verb (e:guah zusak ~ lo)';
  // // const res = 'zasagih=(t:number) (w:seven hundred) (e:ni ~/ kum ~) (o:asdf:efe)';
  // // const res = 'mah=(t:ppm) postpositional marker to indicate <selective> case (as in, tua mahmah)';
  const text =
    "mah= postpositional marker to indicate <selective> case (as in, tua ~~)";
  // return res;

  //   return Object.entries({a:1, b:2, asf:true}).reduce((str, [p, val]) => {
  //     return `${str}${p}::${val}\n`;
  // }, '');

  // const text =
  //   "piansak = (t:tmp) this is <descriptions>, (plural form of   <description>) containing etc (f: ) (1:query).(w:word) (w:keyword)(e:example <JS>) (o:abc:asdf/ more) (a:kbe  /fe) (o:xyz/abc)";

  const row = base.citeFlatObject(text);

  if (row) {
    let str = base.citeFlatString(row);

    console.log("?", str);
  }

  return "??";
}
