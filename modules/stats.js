import {unicodeLength} from "./text.js";

export const meanWordLength = (history) => {
  const wordEvents = history.filter(e => e.event === "word typed");
  const total = wordEvents.reduce((n, e) => n + unicodeLength(e.expected), 0);
  if (wordEvents.length === 0)
    return 0;
  return total / wordEvents.length;
}

export const last = (iterable) => {
  let result;
  for (const item of iterable)
    result = item;
  return result;
};

export function* computeWpmPrefix(history, {lengthAdjusted=true}={}) {
  const meanLen = meanWordLength(history);

  let timerRunning = false;
  let timerStart = 0;
  let words = 0;
  let duration_ms = 0;
  
  for (let i = 0; i < history.length; ++i) {
    const item = history[i];
    const {event, timestamp} = item;
    if (event === "start") {
      timerRunning = true;
      timerStart = timestamp;
    }
    else if (event === "stop") {
      timerRunning = false;
    }
    else if (event === "word typed") {
      if (timerRunning) {
        duration_ms += timestamp - timerStart;
        if (item.correct) {
          if (lengthAdjusted)
            words += unicodeLength(item.typed) / meanLen;
          else
            words += 1;
        }
      }
      timerRunning = true;
      timerStart = timestamp;
    }
    else {
      continue;
    }

    let wpm = 0;
    if (words > 0)
      wpm = words / (duration_ms / 1000 / 60); 
    yield {i, timestamp, wpm};
  }
};

export const computeWpm = (history, args) => {
  return last(computeWpmPrefix(history, args))?.wpm ?? 0;
};

export const computeCorrect = (history) => history
  .filter(e => e.event === "word typed")
  .reduce((n, e) => n + (e.correct ? 1 : 0), 0);

export const computeWrong = (history) => history
  .filter(e => e.event === "word typed")
  .reduce((n, e) => n + (!e.correct ? 1 : 0), 0);

export const computeCharMistakeRate = (history) => {
  const increment = (map, item) => {
    map.set(item, (map.get(item) ?? 0) + 1);
    return map;
  };

  const charFreq = history
    .filter(({event}) => event === "word typed")
    .flatMap(({expected}) => Array.from(expected))
    .reduce((map, char) => increment(map, char), new Map());
  const mistakeFreq = history
    .filter(({event}) => event === "word typed")
    .filter(({correct}) => !correct)
    .flatMap(({expected}) => Array.from(expected))
    .reduce((map, char) => increment(map, char), new Map());
  return Array.from(mistakeFreq.entries())
    .map(([char, freq]) => [char, freq / charFreq.get(char)]);
};
