import {html, useState, useEffect, useRef, useMemo} from "./preact.js";
import TestSettings from "./TestSettings.js";
import TextInput from "./TextInput.js";
import WordScroller from "./WordScroller.js";
import useWordGetter from "./useWordGetter.js";
import {unicodeEquals} from "./text.js";
import {
  computeWpm,
  computeWpmPrefix,
  computeCorrect,
  computeWrong,
  computeCharMistakeRate,
  meanWordLength
} from "./stats.js";
import BarChart from "./BarChart.js";
import ScatterPlot from "./ScatterPlot.js";
import ShowHide from "./ShowHide.js";

const PAUSE_TIMEOUT = 1000;
const MAX_HISTORY_ITEMS = 10000;

export default function TypingTester() {
  const [isRecording, setIsRecording] = useState(false);
  const pauseTimeout = useRef(null);

  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({});
  const [showSettings, setShowSettings] = useState(false);
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
    if (!input.isComposing) {
      setHistory((history) => [
        ...history, 
        {event: "input", data: input.data, timestamp: Date.now()}
      ].slice(-MAX_HISTORY_ITEMS));
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
      .filter(({data}) => /\p{L}/u.test(data))
      .reduce((freq, {data}) => {
        freq.set(data, (freq.get(data) ?? 0) + 1);
        return freq;
      }, new Map())
      .entries()
    )
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 10)
  , [history]);
  const barChartData = barChartEntries.map(([_, v]) => v);
  const barChartLabels = barChartEntries.map(([k, _]) => k);

  const mistakeRateEntries = useMemo(
    () => computeCharMistakeRate(history)
      .sort(([_, a], [__, b]) => b - a),
    [history]
  );
  const mistakeRateData = mistakeRateEntries.map(([_, v]) => v);
  const mistakeRateLabels = mistakeRateEntries.map(([k, _]) => k);

  const wpmPrefix = Array.from(computeWpmPrefix(history)).filter(({wpm}) => wpm > 0).slice(-50);
  const wpmTimes = wpmPrefix.map(({timestamp}) => timestamp - wpmPrefix[0].timestamp);
  const wpmValues = wpmPrefix.map(({wpm}) => wpm);
  
  return html`
    <button onClick=${() => doReset()}>
      reset
    </button>
    <button onClick=${() => setShowSettings((s) => !s)}>
      ${showSettings ? "hide settings" : "show settings"}
    </button>
    <${ShowHide} hidden=${!showSettings}>
      <${TestSettings} onChange=${(s) => setSettings(s)} />
    <//>
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
    <${ShowHide} hidden=${isRecording}>
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
        title="characters typed"
        style=${{width: "400px", height: "400px"}}
        data=${barChartData}
        labels=${barChartLabels}
      />
      <${BarChart} 
        title="error rate by character"
        style=${{width: "400px", height: "400px"}}
        data=${mistakeRateData}
        labels=${mistakeRateLabels}
        formatter=${(value) => value.toLocaleString(undefined, {style: "percent"})}
        horizontal
      />
      <${ScatterPlot} 
        title="recent wpm plot"
        style=${{width: "800px", height: "400px"}}
        xData=${wpmTimes}
        yData=${wpmValues}
        labels=${null}
      />
    <//>
  `;
}
