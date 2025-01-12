import * as natural from "natural";
import * as base from "./base.js";

const env = base.env;
// const config = env.config;
const listOfBible = env.listOfBible;
const category = env.category;
// const structure = env.structure;

/**
 * @example
 * // Generate quiz
 * node run bible quiz
 * // Generate quiz for test
 * node run bible quiz test
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export default async function doDefault(req) {
  if (req.params.name == "test") {
    return await qTest();
  }
  return qDefault();
}

async function qDefault() {
  return "quiz default";
}

function tagFilter(element) {
  let tagName = element;

  if (element == "OT") {
    tagName = "old testament";
  }
  if (element == "NT") {
    tagName = "new testament";
  }

  return tagName;
}

/**
 * @example
 * node run bible quiz test
 */
async function qTest() {
  // const books = category.book;

  let resultFile = "./tmp/questions.json";
  // await base.writeJSON(resultFile, res, 2);
  let raw = await base.readJSON(resultFile);

  // console.log(raw);

  const res = {
    rule: {
      tag: ["old testament", "new testament"],
      source: ["Quizzle", "4000 Questions"],
    },
    topic: [],
  };

  for (let index = 0; index < raw.length; index++) {
    const obj = raw[index];

    let question = obj.question;
    let answer = obj.answer;
    let tag = obj.categories.map(tagFilter);

    // res.tag.push(tag);

    res.rule.tag = res.rule.tag
      .concat(tag)
      .filter((e, i, self) => i === self.indexOf(e));

    let tagIndex = tag.map((tagName) =>
      res.rule.tag.findIndex((e) => e == tagName)
    );
    // let reference = obj.reference.replaceAll(",",";");
    let reference = env.referenceQueryShorten(
      obj.reference.replaceAll(",", ";")
    );

    res.topic.push({
      q: question,
      a: answer,
      t: tagIndex,
      r: reference,
      s: [0],
    });
    console.log("done->", question);
  }

  await base.writeJSON("./tmp/questions-testing.json", res, 2);

  return "quiz test " + res.topic.length;
}
