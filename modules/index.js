import {html, render, useState, useMemo} from "../node_modules/htm/preact/standalone.module.js";
import {ChainBuilder, TextGenerator} from "./markov.js";
import {normalizeSentence} from "./text.js";
import corpus from "./pride_and_prejudice.js";
import TextInput from "./TextInput.js";

// really bad splitting into words
const words = corpus
  .replace(/[\n\r]+/g, " ")
  .replace(/[\d\[\]()_]/g, "")
  .split("");

const App = (props) => {
  const [coherence, setCoherence] = useState(8);
  const generator = useMemo(() => {
    // really dumb markov chain building
    const builder = new ChainBuilder(coherence);
    words.forEach(word => builder.consume(word));

    return new TextGenerator(builder.chain);
  }, [coherence]);

  const generateText = () => Array.from(generator.getSentence(500)).join("");
  const [text, setText] = useState(generateText());

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
      <button class="reset-button" onClick=${() => setText(generateText())}>aaah</button>
      <div class="words-area">
        ${text}
      </div>
      <${TextInput}/>
    </div>
  `;
};

render(html`<${App}/>`, document.body);
