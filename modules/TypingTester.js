import {render, html, useState} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import TextInput from "./TextInput.js";
import WordScroller from "./WordScroller.js";
import useWords from "./useWords.js";

export default function TypingTester() {
  const [coherence, setCoherence] = useState(8);
  const [punctuation, setPunctuation] = useState(true);
  const [caps, setCaps] = useState(true);

  const [words, refreshWords] = useWords({
    coherence,
    punctuation,
    caps,
    length: 500
  });

  const [currentWords, setCurrentWords] = useState(["hello", "world", "this", "is", "a", "test"]);

  const handleWord = (word) => {
    setCurrentWords(currentWords.slice(1));
  };

  const controls = html`
    <button class="reset-button" onClick=${() => refreshWords()}>reset</button>
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
      />
    </div>
    <${TextInput}
      onWord=${(word) => handleWord(word)}
    />
  `;
}
