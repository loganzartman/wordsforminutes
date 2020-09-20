import {html, useState, useRef, useEffect} from "./preact.js";

const endingSpace = /\p{Zs}$/u;

export default ({onWord, onBlur, onInput, targetWord}={}) => {
  const placeholder = "type here to start";
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [partiallyWrong, setPartiallyWrong] = useState(false);
  const inputRef = useRef();

  const handleInput = (event) => {
    if (showPlaceholder)
      setShowPlaceholder(false);
    if (event.isComposing)
      return; // wait for user to finish composing before updating anything
    
    const text = event.target.value;

    const isPartiallyWrong = targetWord && !targetWord.normalize().startsWith(text.normalize());
    if (partiallyWrong ^ isPartiallyWrong)
      setPartiallyWrong(isPartiallyWrong);

    if (endingSpace.test(text)) {
      if (typeof onWord === "function") {
        const word = event.target.value.replace(endingSpace, "");
        onWord(word);
      }
      event.target.value = "";
      setPartiallyWrong(false);
    }

    if (onInput)
      onInput(event);
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
        id="text-input"
        ref=${inputRef}
        class="text-input ${wrongClass}"
        spellcheck="false"
        placeholder=${showPlaceholder ? placeholder : ""}
        onInput=${handleInput}
        onBlur=${handleBlur}
        onKeyDown=${handleKeyDown}
      />
      <label for="text-input" style="display: none">
        typing test text input
      </label>
    </div>
  `;
};
