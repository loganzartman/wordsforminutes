import {useState, useMemo, useEffect, useCallback} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import {ChainBuilder, TextGenerator} from "./markov.js";
import {normalizeSentence} from "./text.js";
import corpus from "./computer.js";

// really bad splitting into words
const sourceWords = corpus
  .replace(/[\n\r]+/g, " ")
  .replace(/[\d\[\]()_]/g, "")
  .split("");

export default function useWords({coherence=8, length=100, punctuation=true, caps=true}={}) {
  const generator = useMemo(() => {
    // really dumb markov chain building
    const builder = new ChainBuilder(coherence);
    sourceWords.forEach(word => builder.consume(word));

    return new TextGenerator(builder.chain);
  }, [coherence]);

  const generate = useCallback(
  	() => {
  		let w = Array.from(generator.getSentence(length)).join("");
  		if (!punctuation)
  			w = w.replace(/\p{P}/ug, "");
  		if (!caps)
  			w = w.toLocaleLowerCase();
  		return w;
  	},
  	[generator, punctuation, caps]
 	);

	const [words, setWords] = useState();

 	useEffect(
 		() => setWords(generate()),
 		[coherence, punctuation, caps]
 	);
	
	const refreshWords = () => setWords(generate());
	return [words, refreshWords];
};
