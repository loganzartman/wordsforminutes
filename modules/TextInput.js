import {html, useState} from "https://unpkg.com/htm/preact/standalone.mjs?module";

export default (props) => {
  const placeholder = "type here to start";
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const handleInput = (event) => {
    if (showPlaceholder)
      setShowPlaceholder(false);

    const text = event.target.value;
    if (/\p{Zs}$/u.test(text)) {
      event.target.value = "";
    }
  };

  return html`
    <div class="text-input-container">
      <input type="text"
        class="text-input"
        placeholder=${showPlaceholder ? placeholder : ""}
        onInput=${handleInput}
        onBlur=${() => setShowPlaceholder(true)}
      />
    </div>
  `;
};
