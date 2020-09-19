import {render, html} from "./preact.js";
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
