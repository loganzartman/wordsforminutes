import {html} from "https://unpkg.com/htm/preact/standalone.mjs?module";

export default (props) => {
  const handleInput = (event) => {
    const text = event.target.value;
    if (/\p{Zs}$/u.test(text)) {
      event.target.value = "";
    }
  };

  return html`
    <div class="text-input-container">
      <input type="text"
        class="text-input"
        onInput=${handleInput}
      />
    </div>
  `;
};
