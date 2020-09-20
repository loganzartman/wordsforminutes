import {html} from "./preact.js";

export default function ShowHide({hidden, children}={}) {
  return html`
    <div class=${"show-hide" + (hidden ? " show-hide-hidden" : "")} >
      ${children} 
    </div>
  `;
};
