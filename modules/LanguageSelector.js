import {html, useState, useEffect} from "./preact.js";

const languages = ["en", "es"];

export default function LanguageSelector({onSetDefinition}) {
  const locale = new Intl.Locale(navigator.languages?.[0] ?? languages[0]);
  const defaultLang = locale.language;

  const [langDefinition, setLangDefinition] = useState(null);
  const [selectedLang, setSelectedLang] = useState(defaultLang);

  useEffect(() => {
    console.log(`Loading language "${selectedLang}"`);
    if (!languages.includes(selectedLang)) {
      setSelectedLang(languages[0]);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`lang/${selectedLang}.json`);
        const def = await res.json();
        setLangDefinition(def);
      } catch (e) {
        setSelectedLang(languages[0]);
      }
    })();
  }, [selectedLang]);

  useEffect(() => onSetDefinition(langDefinition), [langDefinition]);

  const langOptions = languages.map(lang => html`<option value=${lang}>${lang}</option>`);

  return html`
    <select 
      value=${selectedLang}
      onChange=${(event) => setSelectedLang(event.target.value)}
    >
      ${langOptions}
    </select>
  `;
}
