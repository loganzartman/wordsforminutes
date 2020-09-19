import {html, useState, useEffect, useRef, useMemo} from "./preact.js";
import TestSettings from "./TestSettings.js";
import TextInput from "./TextInput.js";
import WordScroller from "./WordScroller.js";
import useWordGetter from "./useWordGetter.js";
import {unicodeEquals} from "./text.js";
import {computeWpm, computeCorrect, computeWrong, meanWordLength} from "./stats.js";
import BarChart from "./BarChart.js";

const PAUSE_TIMEOUT = 1000;

export default function TypingTester() {
  const [isRecording, setIsRecording] = useState(false);
  const pauseTimeout = useRef(null);

  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({});
  const [currentWords, setCurrentWords] = useState([]);
  const [typedWords, setTypedWords] = useState([]);

  const {coherence, punctuation, caps, enableSpeech} = settings;
  const wordGetter = useWordGetter({
    coherence,
    punctuation,
    caps,
    length: 500
  });

  const resetWords = () => {
    setTypedWords(
      Array.from({length: 6}, _ => wordGetter())
        .map(x => ({typed: x, expected: x}))
    );
    setCurrentWords(Array.from({length: 16}, _ => wordGetter()));
  };

  const doReset = () => {
    setHistory([]);
    resetWords();
  };

  useEffect(() => doReset(), [wordGetter]);

  useEffect(() => {
    if (isRecording) {
      setHistory([...history, {event: "start", timestamp: Date.now()}]);
    } else {
      setHistory([...history, {event: "stop", timestamp: Date.now()}]);
    }
  }, [isRecording]);

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

    setTypedWords((typedWords) => 
      [...typedWords, {typed: word, expected: currentWords[0]}]
        .slice(-6) // only keep last 6 items
    );

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

  const handleInput = (input) => {
    resetPauseTimeout();
    if (input.composed) {
      setHistory((history) => 
        [...history, {event: "input", data: input.data, timestamp: Date.now()}]);
    }
  };

  const wpm = useMemo(() => computeWpm(history), [history]);
  const numCorrect = useMemo(() => computeCorrect(history), [history]);
  const numWrong = useMemo(() => computeWrong(history), [history]);
  const acc = numCorrect / Math.max(1, numCorrect + numWrong);
  const meanLen = useMemo(() => meanWordLength(history), [history]);

  const barChartEntries = useMemo(() => 
    Array.from(history
      .filter(({event}) => event === "input")
      .reduce((freq, {data}) => {
        freq.set(data, (freq.get(data) ?? 0) + 1);
        return freq;
      }, new Map())
      .entries()
    )
    .sort(([_, a], [__, b]) => b - a)
  , [history]);
  const barChartData = barChartEntries.map(([_, v]) => v);
  const barChartLabels = barChartEntries.map(([k, _]) => k);

  return html`
    <button 
      class="reset-button"
      onClick=${() => doReset()}
    >
      reset
    </button>
    <${TestSettings}
      onChange=${(s) => setSettings(s)}
    />
    <div class="words-area">
      <${WordScroller}
        words=${currentWords}
        typedWords=${typedWords}
      />
    </div>
    <${TextInput}
      targetWord=${currentWords[0]}
      onWord=${handleWord}
      onBlur=${handleInputBlur}
      onInput=${handleInput}
    />
    <div class="stats-container">
      <div class="stats-item" title=${"statistics " + (isRecording ? "recording" : "paused")}>
        <i class="material-icons">
          ${isRecording ? "play_arrow" : "pause"}
        </i>
      </div>
      <div class="stats-item" title="words per minute">wpm: ${wpm.toFixed(0)}</div>
      <div class="stats-item" title="accuracy">acc: ${(acc * 100).toFixed(0)}%</div>
      <div class="stats-item" title="total words">words: ${numCorrect + numWrong}</div>
      <div class="stats-item" title="average word length">mean length: ${Math.round(meanLen)}</div>
    </div>
    <${BarChart} 
      style=${{width: "500px", height: "500px"}}
      data=${barChartData}
      labels=${barChartLabels}
    />
  `;
}
