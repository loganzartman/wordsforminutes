import {render, html, useState, useEffect, useRef} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import TestSettings from "./TestSettings.js";
import TextInput from "./TextInput.js";
import WordScroller from "./WordScroller.js";
import useWordGetter from "./useWordGetter.js";
import {unicodeEquals} from "./text.js";
import {computeWpm} from "./stats.js";

export default function TypingTester() {
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimeout = useRef(null);

  const [history, setHistory] = useState([{event: "start", timestamp: Date.now()}]);
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

  useEffect(() => {
    setCurrentWords(
      Array.from({length: 16}, _ => wordGetter()));
  }, [wordGetter]);

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
    setHistory((history) => {
      const expected = currentWords[0];
      const typed = word;

      return [...history, {
        event: "word typed",
        expected,
        typed,
        correct: unicodeEquals(expected, typed),
        timestamp: Date.now()
      }];
    });
  };

  const handleInputBlur = () => {
    setHistory((history) => 
      [...history, {event: "stop", timestamp: Date.now()}]);
  };

  const wpm = computeWpm(history);

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
      onBlur=${handleInputBlur}
    />
    <div class="stats-container">
      <div class="stats-item">
        <i class="material-icons">
          ${isRecording ? "play_arrow" : "pause"}
        </i>
      </div>
      <div class="stats-item">WPM: ${wpm.toFixed(0)}</div>
    </div>
  `;
}
