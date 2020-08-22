import {html, useState} from "https://unpkg.com/htm/preact/standalone.mjs?module";

export default function WordScroller({words=[]}={}) {
  debugger;
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

  return html`
    <div class="scroller-words">
      ${wordsElems}
    </div>
  `;
};
