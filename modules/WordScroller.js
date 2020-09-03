import {html, useState, useRef, useLayoutEffect} from "./preact.js";
import {unicodeEquals} from "./text.js";

export default function WordScroller({words=[], typedWords=[]}={}) {
  const [scrollDistance, setScrollDistance] = useState(0);
  const firstWordRef = useRef();
  const scrollerRef = useRef();

  // upcoming words
  const wordsElems = words.map((word, i) => {
    const classes = ["scroller-word"];
    if (i === 0)
      classes.push("scroller-word-active");

    return html`
      <div 
        key=${word}
        ref=${i === 0 ? firstWordRef : undefined}
        class=${classes.join(" ")}
      >
        ${word}
      </div>
    `
  });

  // previous (typed) words
  const typedWordsElems = typedWords.map(({typed, expected}) => {
    const classes = ["scroller-word"];
    if (!unicodeEquals(typed, expected))
      classes.push("scroller-word-bad");
    return html`
      <div key=${expected} class=${classes.join(" ")}>
        ${expected}
      </div>
    `;
  });

  // smooth scroll effect
  useLayoutEffect(() => {
    scrollerRef.current.style.transition = "none"; // don't animate
    scrollerRef.current.style.transform = `translateX(${scrollDistance}px)`;
    scrollerRef.current.offsetWidth; // force reflow
    scrollerRef.current.style.transition = null; // do animate
    scrollerRef.current.style.transform = `translateX(0)`;

    setScrollDistance(firstWordRef.current.offsetWidth);
  }, [words]);

  return html`
    <div ref=${scrollerRef} class="scroller-words">
      <div class="scroller-words-prev">
        ${typedWordsElems}
      </div>
      ${wordsElems}
    </div>
  `;
};
