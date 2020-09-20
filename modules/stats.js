import {unicodeLength} from "./text.js";

export const meanWordLength = (history) => {
  const wordEvents = history.filter(e => e.event === "word typed");
  const total = wordEvents.reduce((n, e) => n + unicodeLength(e.expected), 0);
  if (wordEvents.length === 0)
    return 0;
  return total / wordEvents.length;
}

export const computeWpm = (history, {lengthAdjusted=true}={}) => {
  const meanLen = meanWordLength(history);

  let timerRunning = false;
  let timerStart = 0;
  let words = 0;
  let duration_ms = 0;
  
  for (let item of history) {
    const {event} = item;
    if (event === "start") {
      timerRunning = true;
      timerStart = item.timestamp;
    }
    if (event === "stop") {
      timerRunning = false;
    }
    if (event === "word typed") {
      if (timerRunning) {
        duration_ms += item.timestamp - timerStart;
        if (item.correct) {
          if (lengthAdjusted)
            words += unicodeLength(item.typed) / meanLen;
          else
            words += 1;
        }
      }
      timerRunning = true;
      timerStart = item.timestamp;
    }
  }

  if (words === 0)
    return 0;

  return words / (duration_ms / 1000 / 60);
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
