import {render, html, useState, useEffect} from "https://unpkg.com/htm/preact/standalone.mjs?module";

export default function TestSettings({onChange}={}) {
  const [enableSpeech, setEnableSpeech] = useState(false);
  const [coherence, setCoherence] = useState(3);
  const [punctuation, setPunctuation] = useState(false);
  const [caps, setCaps] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange({
        enableSpeech,
        coherence,
        punctuation,
        caps
      });
    }
  }, [enableSpeech, coherence, punctuation, caps]);

  return html`
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
    <label>
      <input
        type="checkbox"
        checked=${punctuation}
        onChange=${(e) => setPunctuation(e.target.checked)}
      />
      punctuation
    </label>
    <label>
      <input
        type="checkbox"
        checked=${caps}
        onChange=${(e) => setCaps(e.target.checked)}
      />
      caps
    </label>
    <label>
      <input
        type="checkbox"
        checked=${enableSpeech}
        onChange=${(e) => setEnableSpeech(e.target.checked)}
      />
      speak
    </label>
  `;
}
