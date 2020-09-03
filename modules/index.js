import {render, html} from "./preact.js";
import TypingTester from "./TypingTester.js";
import BarChart from "./BarChart.js";

const App = (props) => {
  return html`
    <main class="main-content">
      <h1 class="title">words for minutes</h1>
      <${TypingTester} />
      <${BarChart} 
        style=${{width: "500px", height: "500px"}}
        data=${Array.from({length: 16}).map(() => Math.random())}
      />
    </main>
  `;
};

render(html`<${App}/>`, document.body);
