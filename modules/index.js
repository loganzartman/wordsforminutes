import {html, render, useState, useMemo} from "../node_modules/htm/preact/standalone.module.js";
import {ChainBuilder, TextGenerator} from "./markov.js";
import {normalizeSentence} from "./text.js";
import corpus from "./pride_and_prejudice.js";

// really bad splitting into words
const words = corpus
  .replace(/[\n\r]+/g, " ")
  .replace(/[\d\[\]()_]/g, "")
  .split("");

debugger;

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
    <div style=${{
      display: "flex",
      flexDirection: "column",
      maxWidth: "25em"
    }}>
      <h1>computer dreams of words</h1>
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
      <button onClick=${() => setText(generateText())}>aaah</button>
      <div>
        ${text}
      </div>
    </div>
  `;
};

render(html`<${App}/>`, document.body);
