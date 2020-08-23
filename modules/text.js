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

export const unicodeStrLength = (str) => Array.from(str).length;

/**
 * Checks whether the given string "almost starts with" the given prefix;
 * i.e. tests all but the last unicode character of the prefix.
 * This is useful for input languages which may require multiple inputs to 
 * type a single character, e.g. Korean.
 */
export const almostStartsWith = (str, prefix) => {
  str = str.normalize();
  prefix = prefix.normalize();
  if (unicodeStrLength(prefix) > unicodeStrLength(str))
    return false;

  return str.startsWith(unicodeSlice(prefix, 0, -1));
}
