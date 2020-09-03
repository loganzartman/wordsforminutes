import {html, useState, useMemo} from "./preact.js";

export default function BarChart(props) {
  const {data} = props;
  const [tooltipIndex, setTooltipIndex] = useState(-1);
  const barSpacing = 0.1;

  const count = data.length;
  const max = Math.max(...data) + 0.1;
  const spacePerBar = barSpacing / count;
  const barWidth = 1 / count - spacePerBar;

  const bars = useMemo(() => data.map((x, i) => {
    return html`
      <g 
        class="barchart-bar"
        onpointerover=${() => setTooltipIndex(i)}
        onpointerout=${() => setTooltipIndex(-1)}
        key=${i}
      >
        <rect 
          x=${i / count} 
          y=${1 - x / max} 
          width=${barWidth} 
          height=${x / max}
        />
      </g>
    `;
  }), [data]);

  const barLabels = data.map((x, i) => {
    const label = x.toLocaleString(undefined, {maximumFractionDigits: 2});
    const textProps = {
      x: i / count + barWidth / 2,
      y: 1 - x / max - 0.01,
      ["text-anchor"]: "middle",
    };

    const cls = i === tooltipIndex ? "barchart-label-visible" : "";
    return html`
      <g class="barchart-label ${cls}">
        <text class="barchart-label-bg" ...${textProps}>${label}</text>
        <text ...${textProps}>${label}</text>
      </g>
    `;
  })

  return html`
    <svg viewBox="0 0 1 1" style=${props.style ?? {}}>
      ${bars}
      ${barLabels}
    </svg>
  `;
}
