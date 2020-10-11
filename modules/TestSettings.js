import {render, html, useState, useEffect} from "./preact.js";
import {Text} from "./preact-i18n.js";
import useStoredState from "./useStoredState.js";

export default function TestSettings({onChange}={}) {
  const [enableSpeech, setEnableSpeech] = useStoredState(false, "settingsEnableSpeech");
  const [coherence, setCoherence] = useStoredState(3, "settingsCoherence");
  const [punctuation, setPunctuation] = useStoredState(false, "settingsPunctuation");
  const [caps, setCaps] = useStoredState(false, "settingsCaps");

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
      <label for="coherence"><${Text} id="settings.coherence">coherence<//>: ${coherence}</label>
    </div>
    <label>
      <input
        type="checkbox"
        checked=${punctuation}
        onChange=${(e) => setPunctuation(e.target.checked)}
      />
      <${Text} id="settings.punctuation">punctuation<//>
    </label>
    <label>
      <input
        type="checkbox"
        checked=${caps}
        onChange=${(e) => setCaps(e.target.checked)}
      />
      <${Text} id="settings.caps">caps<//>
    </label>
    <label>
      <input
        type="checkbox"
        checked=${enableSpeech}
        onChange=${(e) => setEnableSpeech(e.target.checked)}
      />
      <${Text} id="settings.speak">speak<//>
    </label>
  `;
}
