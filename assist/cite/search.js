import * as base from "./base.js";

const env = base.env;
const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

/**
 * @example
 * node run cite search
 * node run cite search test
 * node run cite search --q Zeboi
 * node run cite search --q Zeboi
 * node run cite search --q Topa kiangah
 * node run cite search --q kiangah
 * node run cite search --q kipiansakna
 * node run cite search --q abraham
 * node run cite search --q Thazawngte
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export default async function doDefault(req) {
  const identify = req.params.name;

  switch (identify) {
    case "test":
      return doTest(req);
    default:
      return doSearch(req);
  }
}

/**
 * @param {any} req -
 */
async function doTest(req) {
  // citeSearchRef
  console.log(config.citeSearchSrc.split(' '));
  return "Test?";
}

/**
 * @example
 * node run cite search --q kipiansakna
 * src: tedim1932, 3561
 *
 * @param {any} req - ???
 */
async function doSearch(req) {
  // const identify = req.params.name;
  const keyword = req.query.q;
  // NIV, KJV, BBE
  // const srcList = ["tedim1932", "3561"];
  const srcList = config.citeSearchSrc.split(' ');
  // judson1835, mcl2005, 1391, jwmynwt
  // const refList = ["niv2011", "1", "bbe1949", "judson1835"];
  const refList = config.citeSearchRef.split(' ');

  if (!keyword) {
    return "Keyword not provided";
  }
  const arg = await env.getLookupParameter();
  // let re0 = await env.getBibleByKeyword(identify, keyword, arg);
  // if (Object.keys(re0).length === 0) {
  //   return "* not found in ?".replace("*", keyword).replace("?", identify);
  // }

  let re0 = {};
  let identify = "";

  for (let index = 0; index < srcList.length; index++) {
    identify = srcList[index];

    re0 = await env.getBibleByKeyword(identify, keyword, arg);
    if (Object.keys(re0).length === 0) {
      const msg = "* not found in ?"
        .replace("*", keyword)
        .replace("?", identify);
      console.log(" ", msg);
    } else {
      break;
    }
  }

  if (Object.keys(re0).length === 0) {
    return;
  }

  const refs = await writeResult(identify, re0, keyword);

  if (refs.length === 0) {
    return "Oops 345 error";
  }

  for (let index = 0; index < refList.length; index++) {
    const id = refList[index];
    const rf = await env.getBibleByReference(id, refs);

    await writeResult(id, rf, keyword, identify);
  }
}

/**
 * Write result to text file
 *
 * @param {string} identify
 * @param {base.env.TypeOfBibleBook | null} result
 * @param {string} keyword
 * @param {string} root
 * @returns {Promise<base.env.TypeOfReference[]>}
 */
async function writeResult(identify, result, keyword, root = "") {
  const ids = await env.loadBible(identify);
  const info = ids.info;

  // let file = "./tmp/ctd-result-?.txt".replace("?", root ? identify : "src");
  const _resfile = "./tmp/"+config.citeSearchRes.replace(/^\//, '');
  const file = _resfile.replace("?", root ? identify : "src");
  let txt = `# ${info.name} (${info.shortname}) ${info.year} (${identify})\n`;

  if (root) {
    txt += `# ${root} -> [${keyword}]`;
  } else {
    txt += `# [${keyword}]`;
  }

  /**
   * @type {base.env.TypeOfReference[]}
   */
  const refs = [];

  for (const bookId in result) {
    txt += "\n\ni. b".replace("i", bookId).replace("b", result[bookId].info.name);
    for (const chapterId in result[bookId].chapter) {
      let vs = result[bookId].chapter[chapterId].verse;
      for (const verseId in vs) {
        refs.push({ book: bookId, chapter: chapterId, verse: verseId });
        txt += "\n  c:v ".replace("c", chapterId).replace("v", verseId);
        txt += vs[verseId].text;
      }
    }
  }

  await base.write(file, txt);
  if (root) {
    console.log(" ", file, "-> ref:", info.shortname);
  } else {
    console.log(" ", file, "-> src:", info.shortname);
  }
  return refs;
}
