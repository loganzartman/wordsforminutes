import {html, render, useState} from "../node_modules/htm/preact/standalone.module.js";
import {ChainBuilder, TextGenerator} from "./markov.js";
import {normalizeSentence} from "./text.js";
import corpus from "./pride_and_prejudice.js";

// really bad splitting into words
const words = corpus
  .toLocaleLowerCase()
  .replace(/[\n\r]+/, "")
  .split(/\W+/);

// really dumb markov chain building
const builder = new ChainBuilder(3);
words.forEach(word => builder.consume(word));

const generator = new TextGenerator(builder.chain, builder.order);

const App = (props) => {
  const generateText = () => normalizeSentence(Array.from(generator.getSentence(100)));
  const [text, setText] = useState(generateText());

  return html`
    <div>
      <h1>computer dreams of news</h1>
      <button onClick=${() => setText(generateText())}>aaah</button>
      <div style="max-width: 30em">
        ${text}
      </div>
    </div>
  `;
};

render(html`<${App}/>`, document.body);
