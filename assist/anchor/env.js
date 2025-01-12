import * as natural from "natural";
import core, { seek, Prompt } from "lethil";
// import core, {Prompt } from "lethil";

/**
 * @typedef {Object} RowOfLanguage - used in info.language and lang file
 * @property {string} text - Seperated by common local to global as of popularity. If empty, not ready production
 * @property {string} textdirection - text direction eg.[ltr, rtl]
 * @property {string} [local] - language name (in local)
 * @property {string} name - language code (ISO-639-3) eg.[eng, ctd]
 *
 * @typedef {Object} TypeOfInfo - see `./book.json` shelf TypeOfBookShelf TypeOfShelf
 * @property {string} identify - id of the Bible [1,2]
 * @property {string} name - Bible name eg.[King James Version]
 * @property {string} shortname - Shortname eg.[KJV]
 * @property {string} year - Year
 * @property {RowOfLanguage} language - Language
 * @property {number} version - Version
 * @property {string} [description] - Description
 * @property {string} [publisher] - Publisher
 * @property {string} [contributors] - Contributors
 * @property {string} [copyright] - Copyright
 *
 * @typedef {Object<string, string>} TypeOfNote - ???
 *
 * @typedef {string[]} TypeOfDigit - Number in Language
 *
 * @typedef {Object} TypeOfBibleLocale - Each Bible locale
 * @property {string} chapter - Chapter in language eg.[Chapter, Alian]
 * @property {string} verse - Verse in language eg.[Verse, Aneu]
 *
 * @typedef {{info:{name:string,shortname:string, desc?:string}, other:any}} NameOfTestament - testament
 * @typedef {Object<number,NameOfTestament>} TypeOfTestament - Bible testament
 *
 * @typedef {Object<number,Object<number,Object<number,RowOfStory>>>} TypeOfStory - Bible story
 *
 * @typedef {Object} RowOfStory - Each Bible locale
 * @property {string} text
 * @property {string} [title]
 * @property {string} [ref]
 * @property {string} [other]
 *
 * @typedef {Object} InfoOfBook - ?
 * @property {string} name - Name of the book eg.[Genesis, Piancilna]
 * @property {string} shortname - shortname of the book eg.[Gen, Pian]
 * @property {string[]} abbr - Name abbreviation eg.[]
 * @property {string} desc - Book description
 *
 * @typedef {Object<any,any>} RowOfBibleTopic - ?
 *
 * @typedef {Object} RowOfVerse - ?
 * @property {string} text - Context eg.[In the beginning...]
 * @property {string} [title] - Title eg.[The Creation of the World...]
 * @property {string} [heading] - Heading eg.[The Creation of the World...]
 * @property {string} [ref] - Reference eg.[Gen.9.1,Gen.1.28..]
 * @property {string} [merge] - is Merge eg.[2]
 *
 * @typedef {Object<number,RowOfVerse>} TypeOfVerse - ?
 * @typedef {Object<number,RowOfVerse>} TypeOfChapter - ?
 *
 * @typedef {Object<number,{info:InfoOfBook, topic: RowOfBibleTopic, chapter:Object<number,{verse:TypeOfVerse}>}>} TypeOfBibleBook - Bible book
 *
 * @typedef {RowOfBibleBook[]} TypeOfBibleBookArray - Bible book
 *
 * @typedef {Object} RowOfBibleBook - ?
 * @property {string|number} id
 * @property {InfoOfBook} info
 * @property {RowOfBibleTopic} [topic]
 * @property {RowOfBibleChapter[]} chapter
 *
 * @typedef {Object} RowOfBibleChapter - ?
 * @property {string|number} id
 * @property {RowOfBibleVerse[]} verse
 *
 * @typedef {Object} RowOfBibleVerse - ?
 * @property {string|number} id
 * @property {string} text - Context eg.[In the beginning...]
 * @property {string} [title] - Title eg.[The Creation of the World...]
 * @property {string} [heading] - Heading eg.[The Creation of the World...]
 * @property {string} [ref] - Reference eg.[Gen.9.1,Gen.1.28..]
 * @property {string} [merge] - is Merge eg.[2]
 *
 * @typedef {Object} TypeOfBible - ?
 * @property {TypeOfInfo} info
 * @property {TypeOfDigit} digit
 * @property {any} [note]
 * @property {TypeOfBibleLocale} language - ?
 * @property {TypeOfTestament} testament
 * @property {TypeOfStory} story
 * @property {TypeOfBibleBook} book
 *
 * {testament?:number, book:number[]}
 * @typedef {{testament?:number, book:number[]}} TypeOfSearchParameter
 */

/**
 * @typedef {Object} BookOfCategory
 * @property {number} t - testamentId
 * property {number} b - bookId
 * @property {number} s - sectionId
 * @property {number} c - total chapter
 * @property {number[]} v - list of each total verses
 *
 * @typedef {Object} TypeOfCategory - a set of name eg.[section, testament, book, digit]
 * @property {TypeOfDigit} digit
 * @property {TypeOfBibleLocale} language
 * @property {Object<number,string>} section - eg[Law,History ..]
 * @property {TypeOfTestament} testament
 * @property {SetOfBookInfo[]} book
 * @property {Object<number,Object<number,number[]>>} guide - index of each books
 * @property {Object<string,string>} locale
 *
 * @typedef {Object} SetOfBookInfo - ??? {id:string, info:InfoOfBook, clue:BookOfCategory}
 * @property {string} id - Book Id
 * @property {InfoOfBook} info - Book Info
 * @property {BookOfCategory} clue
 *
 */

/**
 * @typedef {Object} TypeOfBook
 * @property {string} name - app name
 * @property {Date} updated - last modified
 * @property {number} version
 * @property {TypeOfInfo[]} book - book info
 */

/**
 * @typedef {Object} TypeOfReference
 * @property {string} book - book name or abbreviation
 * @property {Number|undefined} bookId - book Id
 * @property {Number} chapter - chapter
 * @property {Number} verse - verse from
 * @property {Number|undefined} to - verse to
 *
 * @typedef {{info:TypeOfInfo, bible:TypeOfBible, category:TypeOfCategory}} TypeOfLoadedBible
 */

/**
 * @typedef {Object} TypeOfCite - Citation (cite) types
 * @property {string} ord - word
 * @property {string} t - part of speech
 * @property {string[]} w - term
 * @property {string} des - description
 * @property {string[]} d - definition
 * @property {string[]} e - example
 * @property {string[]} s - synonym
 * @property {string[]} a - antonym
 * @property {string[]} o - origin
 * @param {string} str
 */
const fileOfBook = "./book.json";
const fileOfCategory = "./category.json";
const fileOfStructure = "./structure.json";

/**
 * Source word JSON file, `iso` and `model` need to replaced
 * @example
 * ctd-ord-plain.json
 * ctd-ord-question.json
 */
export const citeISOFile = "./cite/word/iso-ord-model.json";

/**
 * Source/working flat file
 * org: ctd-cite.tsv
 */
export const citeFileName = "./cite/ctd-dev-main.tsv";
/**
 * Cite model
 */
export const citeModel = [
  "plain",
  "dash",
  "apostrophe",
  "exclamation",
  "question",
];

/**
 * Cite class, known Nouns
 * model state
 *
 * ctd-dev-main.tsv
 * ctd-noun-beh.tsv
 * ctd-noun-khua.tsv
 * ctd-noun-ni.tsv
 * ctd-noun-kha.tsv
 */
export const citeClass = [
  {
    id: "dev",
    val: ["main"],
  },
  {
    id: "noun",
    val: ["beh", "khua", "kha", "ni", "min", "ganhing","test"],
  },
];

/**
 * Template `./structure.json`
 * set to {} note, story, book
 * info: required manully update
 * digit: required manully update
 * language: required manully update
 * testament: required manully update
 * @type {TypeOfBible}
 */
export const structure = await seek.readJSON(fileOfStructure);

/**
 * `./category.json`
 * @type {TypeOfCategory}
 */
export const category = await seek.readJSON(fileOfCategory);

/**
 * Index of Book(Bible) from `./book.json`
 * listOfBible
 * @type {TypeOfBook}
 */
export const listOfBible = await seek.readJSON(fileOfBook);

/**
 * Loaded Bible list
 * type {TypeOfBible[]}
 * @type {TypeOfLoadedBible[]}
 */
export const listOfLoadedBible = [];

/**
 * Merge core.config & local
 */
export const config = core.config.merge({
  /**
   * ./book.json
   */
  fileOfBook: fileOfBook,
  /**
   * ./category.json
   */
  fileOfCategory: fileOfCategory,
  /**
   * ./structure.json
   */
  fileOfStructure: fileOfStructure,
  /**
   * ./json/~.json
   */
  fileOfBible: "./json/~.json",
  /**
   * ./lang/iso-~.json
   */
  fileOfLang: "./lang/iso-~.json",
});

/**
 * Validate query, and convert into `TypeOfReference`.
 * When `bookId` is provided in result, its safe to assure that the ref. meet
 * @example
 * Gen 1:3, 2:2-5; Exo 2:4; Gamlak Vakna 2:4
 * Gen 1:3, 7-9; Exo 2:4
 * Gen.1:3, 2:7-9; Exo.2:4
 * Gen.1.3, 2.7-9, 11; Exo.2.4
 * Gen.1.3
 * Gen.36:2,14,18,37:2; Gen.21:2
 * Songs of Solomon 8:2-4
 * 1 kings 1:5
 * Gen.1.3, 9, 11; Exo.2.4
 * Thu Hilhkikna 28:39,59, 32:42
 * Thu Hilhkikna 28:39, 28:59, 32:42
 * 2 Samuel 5:4; Gen.1.3-4, 4; Gen.1.4
 * 1.1.1; 1 1:1; 1.1:1 -> which is Gen 1:1
 *
 * Invalid form
 * [Gen 1.3] -> must be [Gen.1.3, Gen.1:3, Gen 1:3 ]
 *
 * remove duplicate
 * Gen.1.3-4, 4; Gen.1.4
 * Gen.1.4, 3-4; Gen.1.4
 * @param {string} str - see example referenceFormat referenceQuery
 * @returns {TypeOfReference[]} - if bookId is not undefined, it is verified and book name is abbreviation
 *
 */
export function referenceQuery(str) {
  /**
   * @type {TypeOfReference[]}
   */
  const res = [];
  const seperator = { book: ";", chapter: ",", verse: "-" };

  let bookName = "";

  if (!Array.isArray(str)) str = str.replace(/  +/g, " ").split(seperator.book);
  for (var i in str) {
    let bookId = undefined;
    let chapter = "";
    let verseFrom = "";
    let verseTo = undefined;
    if (str[i]) {
      var c = str[i].trim().split(seperator.chapter);
      for (var x in c) {
        if (x == 0) {
          var re =
            /(\d?(\w+?)?(\s?)\w+(\s?)?(\s?)\w+([. ]+?))?((\d+)((\s+?)?[.:]?(\s+)?)?)((\d+)([\-–])?(\d+)?)?/.exec(
              c[x]
            );

          if (re && re[1]) {
            // bookName=this.search(re[1]);
            bookName = filterBookName(re[1]);
            if (bookName) {
              chapter = filterChapterNumber(re[8]);
              verseFrom = filterVerseNumber(re[13]);
              verseTo = filterVerseNumber(re[15]);
            } else {
              break;
            }
          } else {
            // NOTE: 1.1.2, 66.2:1, 50 1:2-5
            var re =
              /(\d+?)[. ]+?((\d+)((\s+?)?[.:]?(\s+)?)?)((\d+)([\-–])?(\d+)?)?/.exec(
                c[x]
              );

            // bookName = filterBookName(re[1]);
            // chapter = filterChapterNumber(re[3]);
            // verseFrom = filterVerseNumber(re[8]);
            // verseTo = filterVerseNumber(re[10]);

            if (re) {
              bookName = filterBookName(re[1]);
              chapter = filterChapterNumber(re[3]);
              verseFrom = filterVerseNumber(re[8]);
              verseTo = filterVerseNumber(re[10]);
            }
            // break;
          }
        } else if (bookName) {
          var re =
            /(\s?(\d+?)(\s+)?\:(\s+)?)?(\s?\d+)?(\s?(\d+?)?([\-–])?(\s?\d+)?)/.exec(
              c[x]
            );
          if (re) {
            chapter = filterChapterNumber(re[2] || chapter);

            verseFrom = filterVerseNumber(re[5]);
            verseTo = filterVerseNumber(re[9]);
          } else {
            break;
          }
        }

        // NOTE: check and push
        if (bookName) {
          if (chapter) {
            let ind = res.findIndex(
              (e) =>
                e.book.toLowerCase() == bookName.toLowerCase() &&
                e.chapter == chapter &&
                (e.verse == verseFrom ||
                  e.to == verseFrom ||
                  e.verse == verseTo)
            );
            // NOTE: avoid duplicate
            if (ind == -1) {
              const ref = referenceBookInfo(bookName);
              let bookNameOrAbbr = bookName;

              if (ref) {
                bookId = ref.id;
                bookNameOrAbbr = ref.info.abbr[0];
                // NOTE: Get by index
                const verseCount = ref.clue.v[chapter - 1];

                if (verseFrom > 0 && verseFrom <= verseCount) {
                  if (verseTo) {
                    if (verseTo < verseFrom) {
                      verseTo = undefined;
                    } else if (verseTo > verseCount) {
                      verseTo = verseCount;
                    }
                  }
                } else {
                  // NOTE: 2 Samuel 2;
                  // where verse does not provided
                  verseFrom = 1;
                  verseTo = verseCount;
                }
              }

              res.push({
                book: bookNameOrAbbr,
                bookId: bookId,
                chapter: chapter,
                verse: verseFrom,
                to: verseTo,
              });
            }
          }
        }
      }
    }
  }
  return res;
}

/**
 * Format reference query, see more on `referenceQuery`
 * @example
 * 2 Samuel 1:4 -> 1Sa.1.4
 * Genesis 50:4, Judges 1.2  -> Gen.40.4; Jdg.1.2
 * 2 Samuel 2; Gen.1.3, 4; Gamlak vakna 4:2; Gen.1.3 -> 2Sa.2.1-32; Gen.1.3; Gen.1.4
 * @param {string} str
 * @returns {string} - can be empty string
 */
export function referenceQueryShorten(str) {
  const res = [];
  const refs = referenceQuery(str);
  for (let index = 0; index < refs.length; index++) {
    const ref = refs[index];
    if (ref.bookId) {
      let verses = ref.verse;
      // let verseTo = ref.to;
      if (ref.to) {
        verses = verses + "-" + ref.to;
      }
      let vrs = ref.book + "." + ref.chapter + "." + verses;
      res.push(vrs);
    }
  }
  return res.join("; ");
}

/**
 * Check reference book info
 * @example
 * referenceBookInfo('Gen')
 * referenceBookInfo('1')
 * @param {string} str - such as `[Gen, Exo, 2 Samuel, Gamlak vakna, 1]`
 * @returns {SetOfBookInfo | undefined}
 */
function referenceBookInfo(str) {
  // e.info.abbr.some(x => x.toLowerCase() == str.toLowerCase())
  // if (category.book[str]){
  //   // NOTE: by bookId
  //   console.log('???', 'by book-id',str);
  //   return category.book[str];
  // }
  return category.book.find(
    // (e) => e.info.name == str || e.info.abbr.includes(str)
    (e) =>
      e.id == str ||
      e.info.name == str ||
      e.info.abbr.some((x) => x.toLowerCase() == str.toLowerCase())
  );
}

/**
 * Format reference book name, trim and remove trailing dot and spaces for both leading & trailing
 * @param {string} e
 * @returns {string|undefined}
 */
function filterBookName(e) {
  if (e) {
    return e.trim().replace(/\.+$/, "");
  }
  return undefined;
}

/**
 * Format reference chapter, trim
 * @param {string} e
 * @returns {Number|undefined}
 */
function filterChapterNumber(e) {
  if (e) {
    return Number(e);
  }
  return undefined;
}

/**
 * Format reference verse, trim
 * @param {string} e
 * @returns {Number|undefined}
 */
function filterVerseNumber(e) {
  if (e) {
    return Number(e);
  }
  return undefined;
}

/**
 * Load Bible from `./json/~.json`
 * @param {string?} identify - tedim1932
 * @returns {Promise<TypeOfLoadedBible?>}
 */
export async function loadBible(identify) {
  if (!identify) {
    // return "no identify: " + identify;
    return null;
  }

  const currentBibleInfo = listOfBible.book.find((e) => e.identify == identify);
  const file = config.fileOfBible.replace("~", identify);

  // if (!currentBibleInfo) {
  //   // return "not found identify: " + identify;
  //   return null;
  // }

  if (!currentBibleInfo) {
    let alreadFile = seek.exists(file);
    if (alreadFile == "") {
      return null;
    }
  }

  let currentBible = listOfLoadedBible.find(
    (e) => e.bible.info.identify == identify
  );
  if (!currentBible) {
    /**
     * @type {TypeOfBible?}
     */
    // ts-ignore
    let tmp = await seek.readJSON(file);
    let cat = Object.assign({}, category);

    if (tmp && Object.keys(tmp).length) {
      let abbr = [];
      for (let index = 0; index < cat.book.length; index++) {
        const e = cat.book[index];
        const i = tmp.book[e.id];

        if (i && i.info) {
          e.info.abbr.push(i.info.name);
          e.info.abbr.push(i.info.shortname);
          e.info.abbr.push(...i.info.abbr);
        }
      }

      currentBible = { info: tmp.info, bible: tmp, category: cat };
      listOfLoadedBible.push(currentBible);
    }
  }

  if (!currentBible) {
    // return "no book of identify: " + identify;
    return null;
  }

  return currentBible;
}

/**
 * Load Bible
 * @param {string} identify
 * @param {TypeOfReference[]} arg
 * @returns {Promise<TypeOfBibleBook?>}
 */
export async function getBibleByReference(identify, arg) {
  const currentBible = await loadBible(identify);

  /**
   * @type {TypeOfBibleBook}
   */
  const res = {};
  if (!currentBible) {
    return null;
  }

  for (let index = 0; index < arg.length; index++) {
    const q = arg[index];

    // let book = category.book.find(
    //   (e) => e.info.name == q.book || e.info.abbr.includes(q.book)
    // );

    let book = referenceBookInfo(q.book);

    if (book) {
      // console.log(book.info.name);
      const bookId = book.id;
      const chapterId = q.chapter;
      // let chapter = currentBible.book[bookId].chapter[q.chapter].verse[q.verse];
      let _itemBook = currentBible.bible.book[bookId];
      if (_itemBook) {
        let _itemChapter = _itemBook.chapter[chapterId];
        if (_itemChapter) {
          if (!res[bookId]) {
            res[bookId] = {};
            res[bookId].info = _itemBook.info;

            // NOTE: merge with category book info (abbr)
            // const cBook = category.book.find(e=>e.id ==bookId );
            // const cBook = structure.book[1];
            // console.log('???', cBook);
            // console.log("???", book.info);
            // console.log('???', structure);

            res[bookId].topic = _itemBook.topic;
            res[bookId].chapter = {};
          }

          if (!res[bookId].chapter[chapterId]) {
            res[bookId].chapter[chapterId] = {
              verse: {},
            };
          }

          if (q.verse) {
            let vers = getVerse(_itemChapter.verse, q.verse, q.to);
            if (vers) {
              Object.assign(res[bookId].chapter[chapterId].verse, vers);
            }
          } else {
            // res[bookId].chapter[chapterId].verse = _itemChapter;
            let vers = getVerse(_itemChapter.verse);
            if (vers) {
              Object.assign(res[bookId].chapter[chapterId].verse, vers);
            }
          }
        }
      }
      // let chapter = currentBible.book[bookId].chapter[q.chapter];
      // console.log(book.info.name, q.chapter, q.verse, tmp.text);
    }
  }
  if (res) {
    return res;
  }
  return null;
}

/**
 * Feature: Support verse merge
 * @example
 * Gamlak Vakna 2:4-5 -> 4.2:3
 * @param {TypeOfVerse} verses - res
 * @param {string} [from] - from
 * @param {string} [to] - to
 * @returns {TypeOfVerse}
 */
export function getVerse(verses, from, to) {
  /**
   * @type {TypeOfVerse}
   */
  const res = {};

  if (!from) {
    return verses;
  } else {
    const _key = Object.keys(verses);

    let startAt = _key.filter((e) => parseInt(e) <= parseInt(from)).pop();

    if (startAt) {
      if (to) {
        let endAt = _key.filter((e) => parseInt(e) <= parseInt(to)).pop();
        if (endAt) {
          let from = parseInt(startAt);
          let to = parseInt(endAt);
          for (let vId = from; vId <= to; vId++) {
            res[vId] = verses[vId];
          }
        }
      } else {
        res[startAt] = verses[startAt];
      }
    }
  }
  return res;
}

/**
 * Load Bible
 * getByReference
 * getByKeyword
 * @param {string} identify
 * @param {string} keyword
 * @param {TypeOfSearchParameter} arg
 * @returns {Promise<TypeOfBibleBook?>}
 * returns {Promise<any>}
 */
export async function getBibleByKeyword(identify, keyword, arg) {
  // const keyword = "Abraham kiangah";
  const currentBible = await loadBible(identify);
  /**
   * @type {TypeOfBibleBook}
   */
  const res = {};
  if (!currentBible) {
    return null;
  }

  // currentBible.bible.book[bookId];

  for (let index = 0; index < arg.book.length; index++) {
    const bookId = arg.book[index];
    const book = currentBible.bible.book[bookId];
    for (const chapterId in book.chapter) {
      if (Object.hasOwnProperty.call(book.chapter, chapterId)) {
        const chapter = book.chapter[chapterId];
        // console.log("book chapter", bookId, chapterId);

        for (const verseId in chapter.verse) {
          if (Object.hasOwnProperty.call(chapter.verse, verseId)) {
            const verse = chapter.verse[verseId];
            // console.log("book chapter verse", bookId, chapterId, verseId);

            const verseMatch = verseSearch(verse.text, keyword);
            if (verseMatch >= 0) {
              if (!res[bookId]) {
                // @ts-ignore
                res[bookId] = {};
                res[bookId].info = book.info;
                res[bookId].topic = book.topic;
                res[bookId].chapter = {};
              }
              if (!res[bookId].chapter[chapterId]) {
                // @ts-ignore
                res[bookId].chapter[chapterId] = {};
              }
              if (!res[bookId].chapter[chapterId].verse) {
                res[bookId].chapter[chapterId].verse = {};
              }
              res[bookId].chapter[chapterId].verse[verseId] = verse;
            }
          }
        }
      }
    }
  }

  if (res) {
    return res;
  }
  return null;
}

/**
 * ...is internel and responsible for searching verse text
 * @param {string} text
 * @param {string | RegExp} keyword
 * @returns {number} -1: no match
 */
function verseSearch(text, keyword) {
  return text.search(new RegExp(keyword, "i"));
}

/**
 * Language file name `./lang/iso-~.json`
 * @param {string} iso - iso_639_3
 */
export function fileLanguage(iso) {
  return config.fileOfLang.replace("~", iso);
}

/**
 * Internal: Language generator
 * @param {string} iso - iso_639_3
 * @param {string} identify - book.identify
 */
export async function createLanguage(iso, identify) {
  const file = fileLanguage(iso);
  const res = await seek.readJSON(file, {
    digit: [],
    language: {},
    section: {},
    testament: {},
    book: {},
    locale: {},
  });

  const currentBible = await loadBible(identify);
  if (currentBible) {
    const bible = currentBible.bible;
    // const name = category.name;
    let digit = Object.assign({}, category.digit, res.digit);
    res.digit = Object.values(digit);
    res.language = Object.assign({}, category.language, res.language);
    res.section = Object.assign({}, category.section, res.section);
    res.testament = Object.assign({}, category.testament, res.testament);
    // res.locale = Object.assign({}, category.locale, res.locale);

    if (!res.book) {
      res.book = {};
    }
    let o = Object.keys(bible.book);

    for (let index = 0; index < o.length; index++) {
      const bookId = o[index];
      // console.log(bible.book[bookId].info.name, bookId);
      if (!res.book[bookId]) {
        res.book[bookId] = {};
      }
      // res.book[bookId].info = bible.book[bookId].info;
      res.book[bookId].info = Object.assign(
        {},
        bible.book[bookId].info,
        res.book[bookId].info
      );
      res.book[bookId].info.desc = "";
      const shortname = res.book[bookId].info.shortname;
      res.book[bookId].info.shortname = shortname.replace(/\.$/, "");
    }

    await seek.writeJSON(file, res, 2);
    return "created # at: ?".replace("#", identify).replace("?", file);
  } else {
    return "incomplete # is not ready".replace("#", identify);
  }
}

/**
 * Extract each words using `natural`
 * @param {string} identify
 * @param {TypeOfSearchParameter} arg
 * @param {string} model - [plain, dash, apostrophe, question, exclamation]
 * @returns {Promise<{info:TypeOfInfo, ord:string[]}>}
 */
export async function getBibleWords(identify, arg, model) {
  const tokenizer = new natural.WordTokenizer();

  const currentBible = await loadBible(identify);

  const res = {
    info: {},
    ord: new Set(),
  };

  if (!currentBible) {
    return res;
  }

  res.info = currentBible.info;

  for (let index = 0; index < arg.book.length; index++) {
    const bookId = arg.book[index];
    const book = currentBible.bible.book[bookId];
    for (const chapterId in book.chapter) {
      if (Object.hasOwnProperty.call(book.chapter, chapterId)) {
        const chapter = book.chapter[chapterId];
        // console.log("book chapter", bookId, chapterId);

        for (const verseId in chapter.verse) {
          if (Object.hasOwnProperty.call(chapter.verse, verseId)) {
            const verse = chapter.verse[verseId];
            // console.log("book chapter verse", bookId, chapterId, verseId);
            // const verseWords = verse.text.split(' ');
            // const verseWords = verse.text.split(/\W+/);
            let verseWords = [];

            if (model != "plain" && model != "") {
              // NOTE: dash or apostrophe
              // let vWords = verse.text.split(' ').map(e=>e.replace(/[.,]/g,''));
              let vWords = verse.text
                .replace(/[.,:\(\)“"”’]/g, " ")
                .replace(/—/g, " ")
                .replace(/\?/g, "? ")
                .replace(/\!/g, "! ")
                .replace(/ +/g, " ")
                .trim()
                .split(" ");
              if (model == "dash") {
                verseWords = vWords.filter((str) => /[\-]/.test(str));
              } else if (model == "apostrophe") {
                verseWords = vWords.filter((str) => /[']/.test(str));
              } else if (model == "question") {
                verseWords = vWords.filter((str) => /[?]/.test(str));
              } else if (model == "exclamation") {
                verseWords = vWords.filter((str) => /[!]/.test(str));
              }
            } else {
              verseWords = tokenizer.tokenize(verse.text);

              // verseWords.forEach((e) => res.add(e));
              // verseWords.forEach((e) => res.ord.add(e));
            }

            // let v2List = verse.text.split(' ');
            // let vDashes = v2List.filter(str => /[\-]/.test(str));
            // let vApostrophes = v2List.filter(str => /[']/.test(str));

            verseWords.forEach((e) => res.ord.add(e));
          }
        }
      }
    }
  }

  res.ord = Array.from(res.ord);

  return res;
}

/**
 * Prompt for questions for testament and book
 * Used in getBibleByKeyword,
 * @returns {Promise<base.env.TypeOfSearchParameter>}
 */
export async function getLookupParameter() {
  const prompt = Prompt();
  let testamentPrompt =
    "> Choose testament between [1-2], or empty for both testaments: ";
  let testament = await prompt.question(testamentPrompt);
  // let bookPrompt = "Book [1-66] msg *: ";
  let bookPrompt = "> msg *: ";
  const res = {};

  if (testament == "1") {
    res.testament = 1;
    bookPrompt = bookPrompt
      .replace(
        "msg",
        "Choose book in 'Old Testament' between [1-39] seperated by comma"
      )
      .replace("*", "eg. 2,4, or empty for all books in Old Testament");
  } else if (testament == "2") {
    res.testament = 2;
    bookPrompt = bookPrompt
      .replace(
        "msg",
        "Choose book in 'New Testament' between [40-66] seperated by comma"
      )
      .replace("*", "eg. 41,44, or empty for all books in New Testament");
  } else {
    // NOTE: No Testament properly select
    bookPrompt = bookPrompt
      .replace("msg", "Choose book between [1-66] seperated by comma")
      .replace("*", "eg. 2,4 or empty for all books in Old & New Testament");
  }

  const book = await prompt.question(bookPrompt);
  // prompt.close();
  prompt.task.close();

  const selectedbook = book
    .split(",")
    .map((e) => e.trim())
    // .filter((v) => typeof v === "number")
    .filter((v) => Number.isNaN(v) == false)
    .filter(function (item, pos) {
      return book.indexOf(item) == pos;
    })
    .map((e) => parseInt(e));
  if (testament == "1") {
    res.book = selectedbook.filter((v) => v >= 1 && v <= 39);
    if (!res.book.length) {
      res.book = Array.from({ length: 39 }, (v, k) => k + 1);
    }
  } else if (testament == "2") {
    res.book = selectedbook.filter((v) => v >= 40 && v <= 66);
    if (!res.book.length) {
      res.book = Array.from({ length: 27 }, (v, k) => k + 40);
    }
  } else {
    res.book = selectedbook.filter((v) => v >= 1 && v <= 66);
    if (!res.book.length) {
      res.book = Array.from({ length: 66 }, (v, k) => k + 1);
    }
  }

  // res.book = [...new Set(res.book)];
  return res;
}

/**
 * to get latest merge, config must be used
 */
export default config;
