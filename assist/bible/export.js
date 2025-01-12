import * as base from "./base.js";
// import thesaurus from "word-thesaurus";
// import WordPOS from "wordpos";

const env = base.env;
// const config = env.config;
// const listOfBible = env.listOfBible;
// const category = env.category;
// const structure = env.structure;

/**
 * @example
 * node run bible export tedim1932 --task=words
 * node run bible export 3561 --task=words
 * node run bible export niv2011 --task=words
 *
 * node run bible export names
 * node run bible export names --task=feminine
 * node run bible export names --task=place
 * node run bible export names --task=name
 *
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export default async function doDefault(req) {
  const task = req.query.task;
  if (task == "words") {
    return await exportWords(req);
  } else if (req.params.name == "names") {
    return await readNameByLines(req);
  }

  console.log(req);

  return "No task provided";
  // const tmp = thesaurus.find(task);
  // console.log('??',tmp);

  // const wpos = new WordPOS({
  //   profile: true,
  //   stopwords: true,
  //   preload: true,
  //   includeData: true,
  //   debug: false,
  // });
  // const afes = await wpos.getPOS(
  //   "The angry bear chased the frightened little squirrel in the hole.",
  //   console.log
  // );
  // console.log('??',afes);
  // console.log('??',wordpos);
}

/**
 * @example
 * node run bible export 3561 --task=words
 * node run bible export 3561 --task=words model=plain
 * node run bible export 3561 --task=words model=dash
 * node run bible export 3561 --task=words model=apostrophe
 * node run bible export 3561 --task=words model=question
 * node run bible export 3561 --task=words model=exclamation
 *
 * node run bible export tedim1932 --task=words model=plain
 * node run bible export tedim1932 --task=words model=dash
 * node run bible export tedim1932 --task=words model=apostrophe
 * node run bible export tedim1932 --task=words model=question
 * node run bible export tedim1932 --task=words model=exclamation
 *
 * tokenizer = new natural.WordTokenizer();
 *
 * Extract unique words but insensitive using `natural` as Array.
 * @param {any} req
 */
async function exportWords(req) {
  const identify = req.params.name;
  const model = req.query.model || 'plain';

  // return req;

  if (!identify) {
    return "No identify provided";
  }

  if (!env.citeModel.includes(model)){
    return model + " not found in model";
  }

  const arg = await env.getLookupParameter();
  const res = await env.getBibleWords(identify, arg, model);

  if (res && res.info.language.name) {
    if (res.ord == 0) {
      return "Exported words: zero, check model or identify";
    }


    const iso = res.info.language.name;

    const resFile = env.citeISOFile.replace("iso", iso).replace("model", model);

    /**
     * @type {{identify:string[],word:string[]}};
     */
    const rawContent = await base.readJSON(resFile, { identify: [], word: [] });

    rawContent.identify = [
      ...new Set([...rawContent.identify, ...[res.info.identify]]),
    ];

    for (let index = 0; index < res.ord.length; index++) {
      const ord = res.ord[index];
      const indexOrd = rawContent.word.findIndex((item) =>
        new RegExp(ord, "i").test(item)
      );
      if (indexOrd < 0) {
        rawContent.word.push(ord);
      }
    }

    // let resultFile = `./tmp/cite-${iso}-words.json`;
    await base.writeJSON(resFile, rawContent, 2);

    return "Exported "+model+": " + res.ord.length + ", at: " + resFile;
  }

  return `Invalid bible: ${identify}`;
}

/**
 * Get names from dump file
 * w,t, o,m,d,e,f -> word, tag, origin, meaning, description, example, reference
 * tag:[name, person, place,]
 * @param {any} req
 */
async function readNameByLines(req) {
  const task = req.query.task;

  if (!task) {
    return "No task provided for Names";
  }
  const resFile = "./tmp/name/result.json";
  // const recFile = "./tmp/name/dump.txt";
  const recFileTask = "./tmp/name/*.txt".replace("*", task);

  let recFile = base.exists(recFileTask);
  if (!recFile) {
    return "No such -*- file found".replace("*", task);
  }

  const res = await base.readJSON(resFile, { rule: { tag: [] }, data: [] });

  res.data = [];

  const tagIndex = res.rule.tag.findIndex((e) => e == task);
  if (tagIndex < 0) {
    return "Its seem Ok, but found no tag index of *".replace("*", task);
  }

  const raws = await base.read(recFile).then((e) => e.toString().split(/\n/));

  for (let index = 0; index < raws.length; index++) {
    const str = raws[index];

    if (str) {
      let row = readNameBreaks(str);

      if (row) {
        let ind = res.data.findIndex((e) => e.w == row.name);
        let l = {
          t: [tagIndex],
          m: row.mean,
          e: row.desc,
          f: row.ref,
        };
        if (ind >= 0) {
          res.data[ind].l.push(l);
        } else {
          res.data.push({
            w: row.name,
            o: [],
            d: "",
            l: [l],
          });
        }
      }
    }
  }

  await base.writeJSON(resFile, res, 2);

  return "Names: " + res.data.length;
}

/**
 * Extract unique words but insensitive using `natural` as Array.
 * @typedef {Object} readNameBreaksType -
 * @property {string} name -
 * @property {string} desc -
 * @property {string} ref -
 * @property {string[]} mean -
 * @param {string} str
 * @returns {readNameBreaksType}
 */
function readNameBreaks(str) {
  // var str = "Aaron, a teacher or lofty,[1] bright, shining (etymology doubtful)[2]";
  if (str) {
    // var res = str.replace(/[\n\r\t]/gm, "").split(/,(.*)/g);
    var res = str.replace(/[\n\r\t]/gm, "").split(/\|(.*)/g);
    // Abihail #1
    // Abihail #2
    let name = res[0].replace(/\#.*/g, "$'").trim();
    let text = (res[1] || "").replace(/\[\d+\]/g, "").trim();

    // const desc = text.split("<ref:")[0].trim();
    const desc = text.split(/<ref:|<mean:/)[0].trim();

    const referenceRegex = /<ref:([^>]+)>/g;
    const meanRegex = /<mean:([^>]+)>/g;

    let ref = "";
    text.replace(referenceRegex, (_, match) => {
      ref += (ref ? ";" : "") + match; // Concatenate matches with ';'
      return ""; // No replacement needed
    });
    const meanSet = new Set();

    text.replace(meanRegex, (_, match) => {
      meanSet.add(match); // Add match to the array
      return ""; // No replacement needed
    });

    const mean = Array.from(meanSet);

    if (name) {
      // return { name: name, desc: desc, ref: ref, mean: mean };
      return { name, desc, ref, mean };
    }
  }
}
