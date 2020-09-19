export class Chain {
  /**
   * @param order the length of context
   */
  constructor(order) {
    if (order < 1)
      throw new Error(`order must be >= 1, was ${order}`);

    this.order = order;

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
    for (const part of context) {
      map = map.get(part)[0];
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
    for (const part of context) {
      if (!map.has(part))
        map.set(part, [new Map(), 0]);
      const [nextMap, count] = map.get(part);
      map.set(part, [nextMap, count + 1]);
      map = nextMap;
    }

    // increment count
    if (!map.has(word))
      map.set(word, [null, 0]);
    map.set(word, [null, map.get(word)[0] + 1]);
  }

  transitionsFor(context) {
    if (context.length !== this.order)
      throw new Error(`Got context with length ${context.length}, should be ${this.order}`);

    // descend tree
    let map = this.data;
    for (const part of context) {
      map = map.get(part)[0];
      if (!map)
        return [];
    }

    const entries = Array.from(map.entries());
    const total = entries.reduce((sum, [_, [__, count]]) => sum + count, 0);
    return entries.map(([word, [_, count]]) => [word, count / total]);
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
      map = map.get(selected)[0];
      this.updateContext(selected);
      yield selected;
    }
  }

  *getToken() {
    if (this.context.length < this.chain.order) {
      yield* this.getStarter();
      return;
    }
    
    const transitions = this.chain.transitionsFor(this.context);
    if (transitions.length === 0) {
      yield* this.getStarter();
      return;
    }
    
    const choice = Math.random();
    let cumulativeProb = 0;
    for (const [b, prob] of transitions) {
      cumulativeProb += prob;
      if (choice < cumulativeProb) {
        this.updateContext(b);
        yield b;
        return;
      }
    }
    throw new Error("Probabilities didn't sum to 1!");
  }

  *getWord(maxChars=16) {
    // discard starters for better quality
    while (this.context.length < this.chain.order)
      for (const _ of this.getStarter()) {};

    // yield items until word separator
    for (let i = 0; i < maxChars; ++i) {
      for (const tok of this.getToken()) {
        yield tok;
        if (/\p{Zs}/u.test(tok)) {
          return;
        }
      }
    }
  }

  *getSentence(numWords) {
    for (let i = 0; i < numWords; ++i)
      yield* this.getWord();
  }
}
