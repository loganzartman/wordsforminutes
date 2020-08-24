import {html, useState, useRef, useEffect} from "https://unpkg.com/htm/preact/standalone.mjs?module";
import {almostStartsWith} from "./text.js";

const endingSpace = /\p{Zs}$/u;

export default ({onWord, onBlur, targetWord}={}) => {
  const placeholder = "type here to start";
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [partiallyWrong, setPartiallyWrong] = useState(false);
  const inputRef = useRef();

  const handleInput = (event) => {
    const text = event.target.value;

    if (showPlaceholder)
      setShowPlaceholder(false);

    setPartiallyWrong(
      targetWord && !almostStartsWith(targetWord, text));

    if (endingSpace.test(text)) {
      if (typeof onWord === "function") {
        const word = event.target.value.replace(endingSpace, "");
        onWord(word);
      }
      event.target.value = "";
      setPartiallyWrong(false);
    }
  };

  const handleBlur = (event) => {
    setShowPlaceholder(true);
    if (onBlur)
      onBlur();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      inputRef.current.blur();
    }
  };

  useEffect(() => setTimeout(() => inputRef.current.focus(), 100), [inputRef]);

  const wrongClass = partiallyWrong ? "text-input-bad" : "";

  return html`
    <div class="text-input-container">
      <input type="text"
        ref=${inputRef}
        class="text-input ${wrongClass}"
        spellcheck="false"
        placeholder=${showPlaceholder ? placeholder : ""}
        onInput=${handleInput}
        onBlur=${handleBlur}
        onKeyDown=${handleKeyDown}
      />
    </div>
  `;
};
