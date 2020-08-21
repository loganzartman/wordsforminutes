import {html, render} from "../node_modules/htm/preact/standalone.module.js";

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
