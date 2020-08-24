import {render, html} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import TypingTester from "./TypingTester.js";

const App = (props) => {
  return html`
    <main class="main-content">
      <h1 class="title">words for minutes</h1>
      <${TypingTester} />
    </main>
  `;
};

render(html`<${App}/>`, document.body);
