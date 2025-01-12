import * as base from "./base.js";

const env = base.env;
const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

/**
 * Testing
 * @example
 * node run cite test
 * @param {any} req
 */
export default async function doDefault(req) {
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
