# Names

```js
\(eg.(.*)\)
<e:$1>

<t:(.*?)>
(t:$1)


\(([a-zA-Z]+):([^()]+)\)


\(([a-zA-Z]+):([^()]+)\)


\<([a-zA-Z]+):(.*)[^>]+\>

($1:$2)

<(k|s|e|t):.*[^>]+>

($1:$2)


    // var res = str.replace(/[\n\r\t]/gm, "").split(/\|(.*)/g);
    var res = str.replace(/[\n\r]/gm, "").split(/\t(.*)/g);

    let ord = res[0].replace(/\#.*/g, "$'").trim();
    if (ord == "") {
      return undefined;
    }
    let text = (res[1] || "")
      .replace(/\[\d+\]/g, "")
      .trim();
      // .replace(/~/gm, ord);

    // const descriptionRegex = /<(k|s|e|t):[^>]+>/g;

    const descriptionRegex = /<([twseado]):[^>]+>/g;
    const des = text.replace(descriptionRegex, "").trim();

    const typeRegex = /<t:([^>]+)>/g;
    const termRegex = /<w:([^>]+)>/g;
    const synonymRegex = /<s:([^>]+)>/g;
    const exampleRegex = /<e:([^>]+)>/g;
    const antonymRegex = /<a:([^>]+)>/g;
    const definitionRegex = /<d:([^>]+)>/g;
    const originRegex = /<o:([^>]+)>/g;



    let pos = "";
    text.replace(typeRegex, (_, match) => {
      pos += (pos ? ";" : "") + match.trim(); // Concatenate matches with ';'
      return ""; // No replacement needed
    });
    const termSet = new Set();

    text.replace(termRegex, (_, match) => {
      let k = match.split("/");
      k.forEach((w) => termSet.add(w.trim()));
      return ""; // No replacement needed
    });

    const trm = Array.from(termSet);

    const syn = [];
    text.replace(synonymRegex, (_, match) => {
      syn.push(match.trim());
      return ""; // No replacement needed
    });



    const egsSet = new Set();
    text.replace(exampleRegex, (_, match) => {
      let k = match.split("/");
      k.forEach((w) => egsSet.add(w.trim()));
      return ""; // No replacement needed
    });
    const egs = Array.from(egsSet);

    const antSet = new Set();
    text.replace(antonymRegex, (_, match) => {
      let k = match.split("/");
      k.forEach((w) => antSet.add(w.trim()));
      return ""; // No replacement needed
    });
    const ant = Array.from(antSet);

    const defSet = new Set();
    text.replace(definitionRegex, (_, match) => {
      let k = match.split("/");
      k.forEach((w) => defSet.add(w.trim()));
      return ""; // No replacement needed
    });
    const def = Array.from(defSet);

    const orgSet = new Set();
    text.replace(originRegex, (_, match) => {
      let k = match.split("/");
      k.forEach((w) => orgSet.add(w.trim()));
      return ""; // No replacement needed
    });
    const org = Array.from(orgSet);
    
    return { ord, pos, trm, des, egs, syn, ant, def, org };
```

Tags

```JSON
[
  "name",
  "masculine",
  "feminine",
  "place",
  "animal",
  "plant"
]
```



- <origin:?/?> - o
- <description:?> - d
- <tag:?/?> - t
- <mean:?/?> - m
- <explanation:?> - e
- <reference:?/?> - r

```cmd
<origin:?/?> o
<description:?> d
<tag:?/?> t
<mean:?/?> m
<explanation:> e
<reference:?/?> r

Abraham <o:?> <d:?> | <t:masculine> <m:?> ? <r:?>

Abraham <o:Hebrew> <d:Abraham, originally known as <Abram> | <t:masculine> <m:father of many/father of a multitude> Abraham is the father of <Isaac> <r:1.12.1-9>

Abigail <o:> <d:> | <t:feminine> <m:?> mother of Amasa, Sister of David. <r:13.2:15–17> | <t:feminine> <m:?> wife of the wicked Nabal, who became a wife of David after Nabal's death. <r:9.25>
```

## Format

```JSON
[
  {
    "w": "Abraham",
    "o": ["Hebrew"],
    "d": "Abraham, originally known as <Abram>",
    "l": [
      {
        "t": [
          1
        ],
        "m": ["father of many","father of a multitude"],
        "e": "Abraham is the father of <Isaac>",
        "f": "1.12.1-9"
      }
    ]
  },
  {
    "w": "Abigail",
    "o": [],
    "d": "",
    "l": [
      {
        "t": [
          2
        ],
        "m": [],
        "d": "mother of Amasa, Sister of David.",
        "e": [],
        "f": "13.2:15–17"
      },
      {
        "t": [
          2
        ],
        "m": [],
        "e": "wife of the wicked Nabal, who became a wife of David after Nabal's death.",
        "f": "9.25"
      }
    ]
  }masculine and feminine
]
```

"A",
"kipat",
"cil"

ppm postpositional marker to indicate objective case (as in သူ့တွေ့တယ်။).
part emphatic particle suffixed to words (as in သိပ်ကောင်းတယ်။ပြောပြောရမယ်။သူ့က။စုံမြိုင်ပင်ရိပ်ခန်းမှာ).
ppm postpositional marker indicating destination. Same as သို့ ppm (as in မန္တလေးသွားမယ်။).
1v (a) be dumb (as in နားပင်းသော်၊သော်); (b) be dumbfounded (as inတွေ့တွေ့ချင်းနှစ်ဦးစလုံးနေကြပေ-).
2v be a dud (as in ဒင်္ဂါး-).
3v be a simpleton (as in ရိုးလွန်းလွန်း-).
4v (a) be inert; not thrive (as in လုပ်ငန်း-); (b) be denatured; lose potency (as inထုံး-).
5v be disproportionate; look stodgy (as in ပုံ-).
6adj dumb (as in လူ).
7adj dud (as in ကျည်). à
8part particle prefixed to verbs and adjectives to form nouns or adverbs (as in ပြောဆို၊ညီညွတ်၊မရရ၊ချို့၊ဖြူ).
9part particle prefixed to numerical classifiers for tens or multiples of tens (as in လူယောက်ငါးဆယ်၊ရာထောင်သောင်း).
10part particle prefixed to replicated nouns or verbs to convey the idea of profusion (as in မြို့မြို့၊ထပ်ထပ်၊လီလီ).
11part particle used in combination with nouns for euphonic effect (as in ကလေးဘဝကပင်).
12part particle prefixed to a component part of some Myanmar names in order to derive a diminutive form (as in ဖြူ, orဝင်းfromဖြူဖြူ

<t:noun/verb> o
<description:female/male> d

<tag:female/male> t
<mean:female/male> m
<explanation:> e
<reference:female/male> r
<keyword:?/?> k
<synonym:?/?> s

### TODO

- [ ] ki, na, mah, ah, in, ding etc for particle, postpositional marker, determiner needs to be described.
- [ ] sak: hisak, beisak, hoihsak
- [ ] end with [in, ah a, pa, nu, mi, ni, te, pi]
- [ ] end with [sak, pen]
- [ ] technology
- [ ] daily
- [x] beh - `name-beh.tsv`
  - row are not yet verified, in term of [punctuation, mixing]
- [x] khua - `name-khua.tsv`
  - row are not yet verified, in term of [punctuation, mixing], and space separation of words which formed phrase or sentence.
- [x] plain - `ctd-plain.csv`
  - were extracted from [tedim1932, 3561] Tedim Bible using natural.
- [x] dash - `ctd-dash.csv`
  - any words with separated by space, but removed non alphabetic within, except dashes
- [x] apostrophe - `ctd-apostrophe.csv`
  - any words with separated by space, but removed non alphabetic within, except apostrophes
- [x] exclamation - `ctd-exclamation.csv`
  - ny words with separated by space, but removed non alphabetic within, except exclamations
- [x] question - `ctd-question.csv`
  - words with separated by space, but removed non alphabetic within, except question marks

Categorizing the class of Nouns for common and individual, such as [Adam, river] should be used as "noun". But when specify the individual names should be identify as its formal appearance, form or gender. Such the person is masculine or feminine, the place is land, mountain, the tree's name, the river's name.

Example.

1. "river" is a common term. When not mentioning the name of the river, we'll simply declare as "noun".
2. In most cases, "Adam" is a name, and we know that its a person, and preferable the person is masculine. Therefore we'll declare as "person,masculine", and describe what "Adam"  is in the context.

```cmd
