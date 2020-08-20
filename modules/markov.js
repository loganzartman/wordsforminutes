export class Chain {
  /**
   * @param order the length of context
   */
  constructor(order) {
    if (order < 1)
      throw new Error(`order must be >= 1, was ${order}`);

    this.order = order;

    // A... -> B -> count
    this.data = new Map();
  }

  empty() {
    return this.data.size === 0;
  }

  has(context) {
    if (context.length !== this.order)
      throw new Error(`Got context with length ${context.length}, should be ${this.order}`);
    
    // descend tree
    let map = this.data;
    for (let part of context) {
      map = map.get(part);
      if (!map)
        return false;
    }
    return true;
  }

  add(context, word) {
    if (context.length !== this.order)
      throw new Error(`Got context with length ${context.length}, should be ${this.order}`);

    // build tree branch
    let map = this.data;
    for (let part of context) {
      if (!map.has(part))
        map.set(part, new Map());
      map = map.get(part);
    }

    // increment count
    if (!map.has(word))
      map.set(word, 0);
    map.set(word, map.get(word) + 1);
  }

  transitionsFor(context) {
    if (context.length !== this.order)
      throw new Error(`Got context with length ${context.length}, should be ${this.order}`);

    // descend tree
    let map = this.data;
    for (let part of context) {
      map = map.get(part);
      if (!map)
        return [];
    }

    const entries = Array.from(map.entries());
    const total = entries.reduce((sum, [_, count]) => sum + count, 0);
    return entries.map(([word, count]) => [word, count / total]);
  }
}

export class ChainBuilder {
  constructor(order) {
    this.order = order;
    this.chain = new Chain(order);
    this.context = [];
  }

  consume(word) {
    if (this.context.length < this.order) {
      this.context.push(word);
      return;
    }
    this.chain.add(this.context, word);
    this.context.shift();
    this.context.push(word);
  }
}

export class TextGenerator {
  constructor(chain) {
    this.chain = chain;
    this.context = [];
  }

  updateContext(word) {
    if (this.context.length >= this.chain.order)
      this.context.shift();
    this.context.push(word);
  }

  *getStarter() {
    let map = this.chain.data;
    for (let i = 0; i < this.chain.order; ++i) {
      const keys = Array.from(map.keys());
      const selected = keys[Math.floor(Math.random() * keys.length)];
      map = map.get(selected);
      this.updateContext(selected);
      yield selected;
    }
  }

  *getWord() {
    if (this.context.length < this.chain.order) {
      yield* this.getStarter();
      return;
    }
    
    const transitions = this.chain.transitionsFor(this.context);
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
