import {render, html, useState, useEffect} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import TextInput from "./TextInput.js";
import WordScroller from "./WordScroller.js";
import useWordGetter from "./useWordGetter.js";

export default function TypingTester() {
  const [coherence, setCoherence] = useState(8);
  const [punctuation, setPunctuation] = useState(true);
  const [caps, setCaps] = useState(true);

  const wordGetter = useWordGetter({
    coherence,
    punctuation,
    caps,
    length: 500
  });

  const [currentWords, setCurrentWords] = useState([]);
  const [prevWord, setPrevWord] = useState("");

  const handleWord = (word) => {
    setCurrentWords([
      ...currentWords.slice(1),
      wordGetter()
    ]);
    setPrevWord(word);
  };

  useEffect(() => {
    setCurrentWords(
      Array.from({length: 8}, _ => wordGetter()));
  }, [wordGetter]);

  const controls = html`
    <button class="reset-button">reset</button>
    <label>
      <input
        type="checkbox"
        checked=${punctuation}
        onChange=${(e) => setPunctuation(e.target.checked)}
      />
      punctuation
    </label>
    <label>
      <input
        type="checkbox"
        checked=${caps}
        onChange=${(e) => setCaps(e.target.checked)}
      />
      caps
    </label>
  `;

  return html`
    <div style=${{display: "flex", flexDirection: "row"}}>
      <input name="coherence" 
        style=${{flex: 1}}
        type="range" 
        min="1" max="20" step="1" 
        value=${coherence}  
        onchange=${(event) => setCoherence(Number.parseInt(event.target.value))}
      />
      <label for="coherence">coherence: ${coherence}</label>
    </div>
    ${controls}
    <div class="words-area">
      <${WordScroller}
        words=${currentWords}
        prevWord=${prevWord}
      />
    </div>
    <${TextInput}
      onWord=${(word) => handleWord(word)}
    />
  `;
}
