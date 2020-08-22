import {html, useState} from "https://unpkg.com/htm/preact/standalone.mjs?module";

export default function WordScroller({words=[], prevWord=""}={}) {
  const wordsElems = words.map((word, i) => {
    const classes = ["scroller-word"];
    if (i === 0)
      classes.push("scroller-word-active");

    return html`
      <div class=${classes.join(" ")}>
        ${word}
      </div>
    `
  });

  const prevWordEl = prevWord && html`
    <div class="scroller-word scroller-word-prev">
      ${prevWord}
    </div>
  `;

  return html`
    <div class="scroller-words">
      ${prevWordEl}
      ${wordsElems}
    </div>
  `;
};
