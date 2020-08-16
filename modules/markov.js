export class Chain {
  constructor() {
    // A -> B -> count
    this.transitionCount = new Map();

    // A -> sum(count) for all B
    this.totalCount = new Map();
  }

  empty() {
    return this.transitionCount.size === 0;
  }

  has(word) {
    return this.transitionCount.has(word);
  }

  add(a, b) {
    if (!this.has(a)) {
      this.transitionCount.set(a, new Map());
      this.totalCount.set(a, 0);
    }
    const bMap = this.transitionCount.get(a);
    
    if (!bMap.has(b)) {
      bMap.set(b, 0);
    }
    bMap.set(b, bMap.get(b) + 1);
    this.totalCount.set(a, this.totalCount.get(a) + 1);
  }

  transitionsFor(a) {
    if (!this.has(a)) {
      return [];
    }
    const total = this.totalCount.get(a);
    return Array.from(this.transitionCount.get(a).entries())
      .map(([b, count]) => [b, count / total]);
  }

  toString() {
    const lines = []
    for (let [a, bMap] of this.transitionCount.entries()) {
      const aTotal = this.totalCount.get(a);
      lines.push(`${a} -> ${aTotal}`);
      for (let [b, count] of bMap.entries()) {
        lines.push(`  ${b} -> ${count}`);
      }
    }
    return lines.join("\n");
  }
}

export function randomWord(chain, previous=null) {
  if (chain.empty()) {
    throw new Error("Empty chain provided!");
  }

  // if no context, pick a starting word at random
  if (!previous || !chain.has(previous)) {
    const starters = Array.from(chain.transitionCount.keys());
    return starters[Math.floor(Math.random() * starters.length)];
  }
  
  // some words have never been followed by anything
  const options = chain.transitionsFor(previous);
  if (options.length === 0) {
    return null;
  }

  const choice = Math.random();
  let cumulativeProb = 0;
  for (let [b, prob] of options) {
    cumulativeProb += prob;
    if (choice < cumulativeProb) {
      return b;
    }
  }
  throw new Error("Probabilities didn't sum to 1!");
}

export function randomSentence(chain, numWords) {
  const first = chain.has(".") ? randomWord(chain, ".") : randomWord(chain);
  const sentence = [first];
  for (let i = 1; i < numWords; ++i) {
    sentence.push(randomWord(chain, sentence[i - 1]));
  }
  return sentence;
}
