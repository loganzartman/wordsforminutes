import {render, html, useState, useEffect, useRef} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import TestSettings from "./TestSettings.js";
import TextInput from "./TextInput.js";
import WordScroller from "./WordScroller.js";
import useWordGetter from "./useWordGetter.js";
import {unicodeEquals} from "./text.js";
import {computeWpm, computeCorrect, computeWrong, meanWordLength} from "./stats.js";

const PAUSE_TIMEOUT = 1000;

export default function TypingTester() {
  const [isRecording, setIsRecording] = useState(false);
  const pauseTimeout = useRef(null);

  const [history, setHistory] = useState([]);
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
    if (isRecording) {
      setHistory([...history, {event: "start", timestamp: Date.now()}]);
    } else {
      setHistory([...history, {event: "stop", timestamp: Date.now()}]);
    }
  }, [isRecording]);

  useEffect(() => {
    setCurrentWords(
      Array.from({length: 16}, _ => wordGetter()));
  }, [wordGetter]);

  const resetPauseTimeout = () => {
    if (pauseTimeout.current !== null) {
      clearTimeout(pauseTimeout.current);
    }
    pauseTimeout.current = setTimeout(() => {
      setIsRecording(false);
    }, PAUSE_TIMEOUT);
  }

  useEffect(() => resetPauseTimeout(), []);

  const handleWord = (word) => {
    const nextWord = wordGetter();

    // speech
    speechSynthesis.cancel();
    if (enableSpeech){
      const utterance = new SpeechSynthesisUtterance(currentWords[1]);
      utterance.rate = 2;
      speechSynthesis.speak(utterance);
    }

    setIsRecording(true);

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
    setIsRecording(false);
  };

  const wpm = computeWpm(history);
  const numCorrect = computeCorrect(history);
  const numWrong = computeWrong(history);
  const acc = numCorrect / (numCorrect + numWrong);
  const meanLen = meanWordLength(history);

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
      onWord=${handleWord}
      onBlur=${handleInputBlur}
      onInput=${() => resetPauseTimeout()}
    />
    <div class="stats-container">
      <div class="stats-item">
        <i class="material-icons">
          ${isRecording ? "play_arrow" : "pause"}
        </i>
      </div>
      <div class="stats-item">wpm: ${wpm.toFixed(0)}</div>
      <div class="stats-item">acc: ${(acc * 100).toFixed(0)}%</div>
      <div class="stats-item">words: ${numCorrect + numWrong}</div>
      <div class="stats-item">mean length: ${Math.round(meanLen)}</div>
    </div>
  `;
}
