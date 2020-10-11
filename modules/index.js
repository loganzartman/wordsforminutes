import {render, html, useState} from "./preact.js";
import {IntlProvider, Text} from "./preact-i18n.js";
import LanguageSelector from "./LanguageSelector.js";
import TypingTester from "./TypingTester.js";

const AppInner = ({langDefinition}) => {
  return html`
      <${IntlProvider} definition=${langDefinition}>
        <${Text} id="test" />
        <${TypingTester} />
      <//>
  `;
};

const App = (props) => {
  const [langDefinition, setLangDefinition] = useState(null);

  let Content = AppInner;
  if (!langDefinition) {
    Content = (props) => html`<div>loading...</div>`;
  }

  return html`
    <main class="main-content">
      <h1 class="title">words for minutes</h1>
      <${LanguageSelector} onSetDefinition=${(d) => setLangDefinition(d)} />
      <${Content} langDefinition=${langDefinition} />
    </main>
  `;
};

render(html`<${App}/>`, document.body);
