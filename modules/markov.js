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

export class ChainBuilder {
  constructor(order) {
    this.order = order;
    this.chain = new Chain();
    this.context = [];
  }

  consume(word) {
    if (this.context.length < this.order) {
      this.context.push(word);
      return;
    }
    this.chain.add(JSON.stringify(this.context), word);
    this.context.shift();
    this.context.push(word);
  }
}

export class TextGenerator {
  constructor(chain, order) {
    this.chain = chain;
    this.order = order;
    this.context = [];
  }

  updateContext(word) {
    if (this.context.length >= this.order)
      this.context.shift();
    this.context.push(word);
  }

  *getStarter() {
    const starters = Array.from(this.chain.transitionCount.keys());
    const starter = JSON.parse(starters[Math.floor(Math.random() * starters.length)]);
    starter.forEach(word => this.updateContext(word));
    yield* starter;
  }

  *getWord() {
    if (this.context.length < this.order) {
      yield* this.getStarter();
      return;
    }
    
    const transitions = this.chain.transitionsFor(JSON.stringify(this.context));
    if (transitions.length === 0) {
      yield* this.getStarter();
      return;
    }
    
    console.log("hit");
    const choice = Math.random();
    let cumulativeProb = 0;
    for (let [b, prob] of transitions) {
      cumulativeProb += prob;
      if (choice < cumulativeProb) {
        this.updateContext(b);
        yield b;
        return;
      }
    }
    throw new Error("Probabilities didn't sum to 1!");
  }

  *getSentence(numWords) {
    for (let i = 0; i < numWords; ++i)
      yield* this.getWord();
  }
}
