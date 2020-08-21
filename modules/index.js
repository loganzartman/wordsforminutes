import {render, html, useState} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import useWords from "./useWords.js";
import TextInput from "./TextInput.js";

const App = (props) => {
  const [coherence, setCoherence] = useState(8);
  const [punctuation, setPunctuation] = useState(true);
  const [caps, setCaps] = useState(true);

  const [words, refreshWords] = useWords({
    coherence,
    punctuation,
    caps,
    length: 500
  });

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
    <div class="main-content">
      <h1 class="title">statistype</h1>
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
        ${words}
      </div>
      <${TextInput}/>
    </div>
  `;
};

render(html`<${App}/>`, document.body);
