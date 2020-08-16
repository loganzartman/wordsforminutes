export function normalizeSentence(sentenceArray) {
  return sentenceArray.join(" ")
    .replace(/\s(['-])\s/g, "$1") // fix in-word punctuation
    .replace(/\s+([,.!?])/g, "$1") // fix punctuation
    .replace(/"\s*([^"]*)\s*"/g, '"$1"') // fix quotes
    .replace(/^\w/, (s) => s.toLocaleUpperCase()) // capitalize first letter
    .replace(/([.!?])\s+(\w)/g, (_, g1, g2) => `${g1} ${g2.toLocaleUpperCase()}`) // sentence case
}
