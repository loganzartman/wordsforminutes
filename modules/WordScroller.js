import {html, useState, useRef, useLayoutEffect} from "https://unpkg.com/htm/preact/standalone.mjs?module";

export default function WordScroller({words=[], prevWord=""}={}) {
  const [scrollDistance, setScrollDistance] = useState(0);
  const firstWordRef = useRef();
  const scrollerRef = useRef();

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

  const prevWordEl = prevWord && html`
    <div class="scroller-word scroller-word-prev">
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
