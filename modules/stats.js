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

  const data = history.reduce((acc, e) => {
    if (e.event === "start") {
      acc.timerRunning = true;
      acc.timerStart = e.timestamp;
    }
    if (e.event === "stop") {
      acc.timerRunning = false;
    }
    if (e.event === "word typed") {
      if (acc.timerRunning) {
        const dt = e.timestamp - acc.timerStart;
        acc.duration += dt;
        if (e.correct)
          acc.words += lengthAdjusted ? unicodeLength(e.typed) / meanLen : 1;
      }
      acc.timerStart = e.timestamp;
      acc.timerRunning = true;
    }
    return acc;
  }, {
    words: 0,
    duration: 0,
    timerRunning: false,
    timerStart: 0,
  });

  if (data.words === 0)
    return 0;

  return data.words / (data.duration / 1000 / 60);
};

export const computeCorrect = (history) => history
  .filter(e => e.event === "word typed")
  .reduce((n, e) => n + (e.correct ? 1 : 0), 0);

export const computeWrong = (history) => history
  .filter(e => e.event === "word typed")
  .reduce((n, e) => n + (!e.correct ? 1 : 0), 0);
