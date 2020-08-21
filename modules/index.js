import {html, render, useState} from "../node_modules/htm/preact/standalone.module.js";
import useWords from "./useWords.js";
import TextInput from "./TextInput.js";

const App = (props) => {
  const [coherence, setCoherence] = useState(8);

  const [words, refreshWords] = useWords({
    coherence,
    length: 500
  });

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
      <button class="reset-button" onClick=${() => refreshWords()}>aaah</button>
      <div class="words-area">
        ${words}
      </div>
      <${TextInput}/>
    </div>
  `;
};

render(html`<${App}/>`, document.body);
