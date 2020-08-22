import {render, html} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import TypingTester from "./TypingTester.js";

const App = (props) => {
  return html`
    <div class="main-content">
      <h1 class="title">words for minutes</h1>
      <${TypingTester} />
    </div>
  `;
};

render(html`<${App}/>`, document.body);
