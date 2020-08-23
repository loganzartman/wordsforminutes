import {html, useState, useRef, useLayoutEffect} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import {unicodeEquals} from "./text.js";

export default function WordScroller({words=[], prevWord="", expectedPrevWord=""}={}) {
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
        ref=${i === 0 ? firstWordRef : undefined}
        class=${classes.join(" ")}
      >
        ${word}
      </div>
    `
  });

  // previous (typed) word
  const prevWordClasses = ["scroller-word", "scroller-word-prev"];
  if (!unicodeEquals(prevWord, expectedPrevWord))
    prevWordClasses.push("scroller-word-bad");

  const prevWordEl = prevWord && html`
    <div class=${prevWordClasses.join(" ")}>
      ${prevWord}
    </div>
  `;

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
      ${prevWordEl}
      ${wordsElems}
    </div>
  `;
};
