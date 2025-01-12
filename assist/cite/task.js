import * as base from "./base.js";

const env = base.env;
// const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

/**
 * @example
 * node run cite task csv
 * node run cite task check
 * node run cite task name
 * node run cite task snap
 * node run cite task paring
 *
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export default async function doDefault(req) {
  const task = req.params.name;

  switch (task) {
    case "csv":
      return csvWords(req);
    case "check":
      return checkWords(req);
    case "name":
      return nameWords(req);
    case "snap":
      return nounSnap(req);
    case "paring":
      return nameParings(req);
    default:
      return noTask(req);
  }
}

/**
 * @param {any} req
 */
async function noTask(req) {
  console.log(req);
  return "No task provided";
}

/**
 * Word ctd JSON to plain text (CSV) see {@env.citeModel}
 * @example
 * node run cite task csv --model=plain
 * node run cite task csv --model=dash
 * node run cite task csv --model=apostrophe
 * node run cite task csv --model=question
 * node run cite task csv --model=exclamation
 *
 * @param {any} req
 */
async function csvWords(req) {
  const model = req.query.model || "plain";
  const srcFile = env.citeISOFile.replace("iso", "ctd").replace("model", model);
  // const resFile = srcFile.replace("/word/", "/").replace(".json", ".csv");
  const resFile = srcFile.replace("cite/word", "tmp").replace(".json", ".csv");

  let ctd = await base.readJSON(srcFile, { identify: {}, word: [] });

  await base.write(resFile, ctd.word.join("\n"));
  return "Exported " + model + " csv: " + ctd.word.length + ", at: " + resFile;
}

/**
 * Format flat file to JSON
 * @example
 * node run cite task check
 * @param {any} req
 */
async function checkWords(req) {
  const resFile = env.citeFileName
    .replace("cite", "tmp")
    .replace(".tsv", "-testing.json");

  const res = await base.cite();
  // res.sort((a, b) => a.ord - b.ord);
  res.sort((a, b) => a.ord.localeCompare(b.ord));

  const groupByTypes = base.groupBy(res, (e) => e.t);

  const currentTypeList = groupByTypes.keys();

  for (const pos of currentTypeList) {
    // console.log(pos);
    const currentType = groupByTypes.get(pos);
    const total = currentType.length;
    if (pos == "phrase;on the land/on earth") {
      console.log("???", currentType);
    }
    if (pos == "") {
      console.log("?? pos empty", currentType);
    }
    console.log(" ", pos, "->", total);
  }

  await base.writeJSON(resFile, res, 2);

  return "Checked words: " + res.length + ", at: " + resFile;
}

/**
 * Get the first character of a string with uppercase
 * @example
 * node run cite task name --model=plain
 * node run cite task name --model=dash
 * node run cite task name --model=apostrophe
 * node run cite task name --model=question
 * node run cite task name --model=exclamation
 * @param {any} req
 */
async function nameWords(req) {
  const model = req.query.model || "plain";

  if (!env.citeModel.includes(model)) {
    return model + " not found in model";
  }

  const srcFile = env.citeISOFile.replace("iso", "ctd").replace("model", model);
  const resFile = srcFile
    .replace("cite/word", "tmp")
    .replace(".json", "-uppercase.csv");
  // const resFile = srcFile
  //   .replace("/word/", "/")
  //   .replace(".json", "-uppercase.v0.csv");
  const lit = new Set();

  /**
   * @type {{identify:string[],word:string[]}};
   */
  const raw = await base.readJSON(srcFile, { identify: [], word: [] });

  for (let index = 0; index < raw.word.length; index++) {
    const ord = raw.word[index];
    if (base.checkFirstletterIsUppercase(ord)) {
      // res.push(ord);
      lit.add(ord);
    }
  }

  // await base.writeJSON(resFile, res, 2);
  let res = Array.from(lit);
  await base.write(resFile, res.join("\n"));

  return "Exported words: " + res.length + ", at: " + resFile;
}

/**
 * Todo paring for Uppercase which are likely to be a name
 * @example
 * node run cite task paring --model=plain
 * node run cite task paring --model=plain state=uppercase
 * node run cite task paring --model=dash
 * node run cite task paring --model=dash state=uppercase
 * node run cite task paring --model=apostrophe
 * node run cite task paring --model=question
 * node run cite task paring --model=exclamation
 * @param {any} req - {params:{task:string, name:string}, query:{model?:string, state:string}}
 */
async function nameParings(req) {
  const model = req.query.model || "plain";
  // const state = req.query.state || "uppercase";
  const state = req.query.state || "regular";

  if (!env.citeModel.includes(model)) {
    return model + " not found in model";
  }

  const srcFile = env.citeISOFile.replace("iso", "ctd").replace("model", model);
  const resFile = srcFile
    .replace("cite/word", "tmp")
    .replace(".json", `-paring-${state}.tsv`);

  if (!base.exists(srcFile)) {
    return "No such * file found".replace("*", srcFile);
  }

  const nameContent = await base.readJSON(srcFile, { identify: [], word: [] });

  const res = [];

  const flatFile = env.citeFileName;
  if (!base.exists(flatFile)) {
    return "No such -*- file found".replace("*", flatFile);
  }

  const flatContent = await base.flatfile(flatFile);
  const raws = [];

  for (let index = 0; index < flatContent.length; index++) {
    const row = flatContent[index];
    if (row) {
      const rowFormated = base.citeFlatObject(row);
      if (rowFormated) {
        raws.push(rowFormated);
      }
    }
  }
  for (let index = 0; index < nameContent.word.length; index++) {
    const ord = nameContent.word[index];
    if (ord) {
      if (state == "uppercase") {
        if (base.checkFirstletterIsUppercase(ord)) {
          // if (!raws.find((e) => e.ord == ord)) {
          if (!raws.find((e) => e.ord.toLowerCase() == ord.toLowerCase())) {
            let tpl = "*=(t:uppercase) (w:*)".replaceAll("*", ord);
            res.push(tpl);
          }
        }
      } else if (!raws.find((e) => e.ord.toLowerCase() == ord.toLowerCase())) {
        let tpl = "*=(t:todo> (w:*)".replaceAll("*", ord);
        res.push(tpl);
      }
    }
  }

  await base.write(resFile, res.join("\n"));

  if (res.length == 0) {
    return (
      "Its seem paring " + model + " with " + state + " has been completed"
    );
  }

  return "Paring: " + res.length + ", at: " + resFile;
}

/**
 * Import dump files [Beh, Khua] to TSV
 * @example
 * node run cite task snap
 * node run cite task snap --type=noun name=beh
 * node run cite task snap --type=noun name=khua
 * node run cite task snap --type=noun name=ni
 * node run cite task snap --type=noun name=kha
 * @param {any} req
 */
async function nounSnap(req) {
  const id = req.query.type;
  const name = req.query.name;

  if (!id) {
    return "Type should be provided.";
  }
  if (!name) {
    return "Name should be provided.";
  }

  const currentClass = env.citeClass.find((e) => e.id == id);

  if (!currentClass) {
    return "Type (id) not found.".replace("id", id);
  }

  if (!currentClass.val.find((e) => e == name)) {
    return "Name (vl) not found in type:(id)."
      .replace("vl", name)
      .replace("id", id);
  }

  const resFile = env.citeFileName.replace("dev", id).replace("main", name);
  const srcFile = resFile.replace("cite", "tmp").replace(".tsv", ".txt");

  if (!base.exists(srcFile)) {
    return "No such -*- file found".replace("*", srcFile);
  }

  // let tpl = "*=(t:!-!) (w:*)".replace("!", id).replace("!", name);
  let tpl = "";

  if (name == "beh") {
    tpl += "nang bang beh? kei ~ hi ing";
  } else if (name == "khua") {
    tpl += "koi khua pan? ko ~ hi ung";
  } else if (name == "kha") {
    tpl += "tukha pen bang ~ ahia le?";
  } else if (name == "ni") {
    tpl += "tuni pen bang ~ ahia le?";
  }

  const raw = await base.flatfile(srcFile);

  const res = [];

  for (let index = 0; index < raw.length; index++) {
    let oj = base.citeFlatObject(raw[index]);
    if (oj) {
      if (oj.t == "?") {
        // row.t = "(t:!-!)".replace("!", id).replace("!", name);
        // oj.t = "!-!".replace("!", id).replace("!", name);
        oj.t = name;
      }
      if (!oj.w) {
        // row.w = "(w:*)".replace("*", row.ord);
        oj.w = oj.ord;
      }
      if (!oj.e) {
        oj.e = tpl;
      }

      res.push(base.citeFlatString(oj));
    }
  }
  // const lit = new Set();
  // let arr = Array.from(lit);
  // arr.sort((a, b) => a.ord - b.ord);
  // arr.sort((a, b) => a.ord - b.ord);
  // arr.sort((a, b) => a.localeCompare(b));
  // const res = arr.map((e) => tpl.replaceAll("*", e));
  await base.write(resFile, res.join("\n"));

  return "Snap (id-vl): ln, at fl."
    .replace("id", id)
    .replace("vl", name)
    .replace("ln", res.length)
    .replace("fl", resFile);
}
