export const computeWpm = (history) => {
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
          acc.words += 1;
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
