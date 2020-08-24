import {render, html, useState, useEffect} from "https://unpkg.com/htm/preact/standalone.mjs?module";

export default function TestSettings({onChange}={}) {
  const [enableSpeech, setEnableSpeech] = useState(false);
  const [coherence, setCoherence] = useState(9);
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
    <button class="reset-button">reset</button>
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
