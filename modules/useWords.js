import {useState, useMemo, useCallback} from "../node_modules/htm/preact/standalone.module.js";
import {ChainBuilder, TextGenerator} from "./markov.js";
import {normalizeSentence} from "./text.js";
import corpus from "./pride_and_prejudice.js";

// really bad splitting into words
const sourceWords = corpus
  .replace(/[\n\r]+/g, " ")
  .replace(/[\d\[\]()_]/g, "")
  .split("");

export default function useWords({coherence=8, length=100}={}) {
  const generator = useMemo(() => {
    // really dumb markov chain building
    const builder = new ChainBuilder(coherence);
    sourceWords.forEach(word => builder.consume(word));

    return new TextGenerator(builder.chain);
  }, [coherence]);

  const generate = useCallback(
  	() => Array.from(generator.getSentence(length)).join(""),
  	[generator]
 	);

	const [words, setWords] = useState(generate());
	
	const refreshWords = () => setWords(generate());
	return [words, refreshWords];
};
