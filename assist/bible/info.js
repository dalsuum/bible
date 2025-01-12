import * as base from "./base.js";

const env = base.env;
// const config = env.config;
const listOfBible = env.listOfBible;
const category = env.category;
// const structure = env.structure;

/**
 * @example
 * // Generate info for readme
 * node run bible info
 * // Generate info for shortname
 * node run bible info shortname
 * @param {any} req - {query:{identify?:string, timeout?:number}}
 */
export default async function doDefault(req) {

  if (req.params.name == "shortname") {
    return await listShortname();
  }
  listOfBibleMarkDown();

}

function listOfBibleMarkDown() {
  const totalBible = listOfBible.book.length;

  console.log("|", "Name", "|", "Year", "|", "Language", "|", "ISO", "|");
  console.log("|", "---", "|", "---", "|", "---", "|", "---", "|");
  for (let index = 0; index < totalBible; index++) {
    const book = listOfBible.book[index];

    let name = "? (*)".replace("?", book.name).replace("*", book.shortname);
    let year = book.year;
    let lang = book.language.text;
    let iso = book.language.name;
    console.log("|", name, "|", year, "|", lang, "|", iso, "|");
  }

  const langDump = listOfBible.book.map((e) => e.language.name);
  let langList = [...new Set(langDump)];

  console.log("\n> Books:", totalBible, "langs:", langList.length);
  return "info default";
}

/**
 * @example
 * node run bible info shortname
 */
async function listShortname() {
  const books = category.book;

  // const csv = "|";
  // const abc=["#","Name","Abbr"];
  // const headerTitle = csv+abc.join(csv)+ csv;
  // const headerSep = abc.map(e=>csv);

  const c3 =[];
  const c2 =[];
  console.log("Abbreviation")
  console.log("|",  "#", "|", "Name", "|", "abbr", "|", "shortname", "|");
  console.log("|", "---", "|", "---", "|", "---", "|", "---", "|");
  for (let index = 0; index < books.length; index++) {
    const book = books[index];
    const name = book.info.name;
    const char3 = book.info.abbr[0];
    const char2 = book.info.abbr[2];
    // const char2 = book.info.abbr.join(", ");
    // const abbr = book.info.abbr[2].toLowerCase();

    c3.push(char3);
    c2.push(char2);

    console.log("|", index+1, "|", name, "|", char3, "|", char2, "|");

  }


  const c2d = findDuplicates(c2);

  if (c2d.length){
    console.log("char2 has duplicates");
    // Unique duplicates
    console.log([...new Set(c2d)])
  }
  const c3d = findDuplicates(c3);

  if (c3d.length){
    console.log("char3 has duplicates");
    // Unique duplicates
    console.log([...new Set(c3d)])
  }

  return "info shortname";
}

/**
 * let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)
 *
 * The findDuplicates
 * @returns
 */
function findDuplicates(lists){
  return lists.filter((item, index) => lists.indexOf(item) !== index)
}