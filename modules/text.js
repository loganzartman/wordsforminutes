export const normalizeCorpus = (str) => {
  return str
    .normalize()
    .replace(/[\r\n]+/ug, " ") // newlines to spaces
    .replace(/(\p{Zs})+/ug, "$1") // condense extra word separators
    .replace(/[“”]/g,'"') // replace fancy quotes
    .replace(/[‘’]/g,"'") // replace fancy quotes
};

export const stripSpace = (str) => str.replace(/\p{WSpace}/ug, "");

export const unicodeSlice = (str, start, end) => 
  Array.from(str).slice(start, end).join("");

export const unicodeEquals = (a, b) => a.normalize() === b.normalize();

export const unicodeLength = (str) => Array.from(str).length;

/**
 * Best effort split into words. Assumes that words are separated by non 
 * letter characters, which is not strictly valid.
 */
export const splitWords = (str) => 
  str.split(/(\p{L}+|[^\p{L}])/u).filter(x => x.length > 0);
