import {useState, useMemo, useEffect, useCallback} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import {ChainBuilder, TextGenerator} from "./markov.js";
import {normalizeCorpus, stripSpace, splitWords} from "./text.js";
import corpus from "./corpus/tao.js";

// best attempt splitting into characters
// const sourceWords = Array.from(normalizeCorpus(corpus));

// best attempt at splitting into words
const sourceWords = splitWords(normalizeCorpus(corpus)); 

export default function useWordGetter({coherence=8, length=100, punctuation=true, caps=true, stripSpaces=true}={}) {
  const generator = useMemo(() => {
    // really dumb markov chain building
    const builder = new ChainBuilder(coherence);
    sourceWords.forEach(word => builder.consume(word));

    return new TextGenerator(builder.chain);
  }, [coherence]);

  return useCallback(
  	() => {
      let w = Array.from(generator.getWord()).join("");
  		if (!punctuation)
  			w = w.replace(/\p{P}/ug, "");
  		if (!caps)
  			w = w.toLocaleLowerCase();
      if (stripSpaces)
        w = stripSpace(w);
  		return w;
  	},
  	[generator, punctuation, caps, stripSpaces]
 	);
}
