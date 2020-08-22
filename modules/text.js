export const normalizeCorpus = (str) => {
  return str
    .normalize()
    .replace(/[\r\n]+/ug, " ") // newlines to spaces
    .replace(/(\p{Zs})+/ug, "$1") // condense extra word separators
};
