import {render, html, useState, useEffect} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import TestSettings from "./TestSettings.js";
import TextInput from "./TextInput.js";
import WordScroller from "./WordScroller.js";
import useWordGetter from "./useWordGetter.js";

export default function TypingTester() {
  const [settings, setSettings] = useState({});
  const [currentWords, setCurrentWords] = useState([]);
  const [typedWord, setTypedWord] = useState("");
  const [expectedWord, setExpectedWord] = useState("");

  const {coherence, punctuation, caps, enableSpeech} = settings;
  const wordGetter = useWordGetter({
    coherence,
    punctuation,
    caps,
    length: 500
  });

  const handleWord = (word) => {
    const nextWord = wordGetter();

    // speech
    speechSynthesis.cancel();
    if (enableSpeech){
      const utterance = new SpeechSynthesisUtterance(currentWords[1]);
      utterance.rate = 2;
      speechSynthesis.speak(utterance);
    }

    // update current words
    setCurrentWords([
      ...currentWords.slice(1),
      nextWord
    ]);

    setExpectedWord(currentWords[0]);
    setTypedWord(word);
  };

  useEffect(() => {
    setCurrentWords(
      Array.from({length: 8}, _ => wordGetter()));
  }, [wordGetter]);

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
    <${TestSettings}
      onChange=${(s) => setSettings(s)}
    />
    <div class="words-area">
      <${WordScroller}
        words=${currentWords}
        prevWord=${typedWord}
        expectedPrevWord=${expectedWord}
      />
    </div>
    <${TextInput}
      targetWord=${currentWords[0]}
      onWord=${(word) => handleWord(word)}
    />
  `;
}
