export const normalizeCorpus = (str) => {
  return str
    .normalize()
    .replace(/[\r\n]+/ug, " ") // newlines to spaces
    .replace(/(\p{Zs})+/ug, "$1") // condense extra word separators
};

export const unicodeSlice = (str, start, end) => 
  Array.from(str).slice(start, end).join("");

/**
 * Checks whether the given string "almost starts with" the given prefix;
 * i.e. tests all but the last unicode character of the prefix.
 * This is useful for input languages which may require multiple inputs to 
 * type a single character, e.g. Korean.
 */
export const almostStartsWith = (str, prefix) =>
  str.normalize().startsWith(unicodeSlice(prefix.normalize(), 0, -1));
