import {html, useState, useRef, useEffect} from "https://unpkg.com/htm/preact/standalone.mjs?module";

const endingSpace = /\p{Zs}$/u;

export default ({onWord}={}) => {
  const placeholder = "type here to start";
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const inputRef = useRef();

  const handleInput = (event) => {
    if (showPlaceholder)
      setShowPlaceholder(false);

    const text = event.target.value;
    if (endingSpace.test(text)) {
      if (typeof onWord === "function") {
        const word = event.target.value.replace(endingSpace, "");
        onWord(word);
      }
      event.target.value = "";
    }
  };

  useEffect(() => setTimeout(() => inputRef.current.focus(), 100), [inputRef]);

  return html`
    <div class="text-input-container">
      <input type="text"
        ref=${inputRef}
        class="text-input"
        placeholder=${showPlaceholder ? placeholder : ""}
        onInput=${handleInput}
        onBlur=${() => setShowPlaceholder(true)}
      />
    </div>
  `;
};
