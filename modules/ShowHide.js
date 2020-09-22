import {html, useEffect, useRef} from "./preact.js";

export default function ShowHide({hidden, children, duration=200}={}) {
  const containerRef = useRef();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container)
      return;
    
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
      
    if (hidden) {
      container.className = "show-hide show-hide-hidden";
      timeoutRef.current = setTimeout(() => {
        container.style.display = "none";
      }, duration);
    } else {
      container.style.display = "inherit";
      container.className = "show-hide show-hide-hidden";
      container.offsetWidth; // force reflow
      container.className = "show-hide";
    }
  }, [hidden]);

  return html`
    <div 
      ref=${containerRef}
      style=${{"transition-duration": `${duration}ms`}}
    >
      ${children} 
    </div>
  `;
};
