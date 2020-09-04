import {html, useState, useMemo} from "./preact.js";

export default function BarChart(props) {
  const {data} = props;
  const [tooltipIndex, setTooltipIndex] = useState(-1);
  const barSpacing = 0.2;
  const margin = 0.1;

  const width = 1;
  const height = 1;
  const left = margin;
  const right = width - margin;
  const top = margin;
  const bottom = height - margin;
  const plotWidth = right - left;
  const plotHeight = bottom - top;

  const count = data.length;
  const max = Math.max(...data);
  const spacePerBar = barSpacing / count;
  const barWidth = (plotWidth - spacePerBar) / count - spacePerBar;

  const axes = html`
    <line
      class="barchart-axis"
      x1=${left}
      y1=${top}
      x2=${left}
      y2=${bottom}
    />
    <line
      class="barchart-axis"
      x1=${left}
      y1=${bottom}
      x2=${right}
      y2=${bottom}
    />
    <text 
      class="barchart-label"
      x=${left + 0.01}
      y=${top}
      text-anchor="right"
      dominant-baseline="hanging"
    >
      ${max.toLocaleString(undefined, {maximumFractionDigits: 2})}
    </text>
  `;

  const barDimensions = (x, i) => ({
    x: left + spacePerBar * 0.5 + i / count * plotWidth, 
    y: bottom - x / max * plotHeight,
    width: barWidth,
    height: x / max * plotHeight,
  });

  const bars = useMemo(() => data.map((x, i) => {
    return html`
      <g 
        class="barchart-bar"
        onpointerover=${() => setTooltipIndex(i)}
        onpointerout=${() => setTooltipIndex(-1)}
        key=${i}
      >
        <rect ...${barDimensions(x, i)} />
      </g>
    `;
  }), [data]);

  const barLabels = useMemo(() => data.map((x, i) => {
    const label = x.toLocaleString(undefined, {maximumFractionDigits: 2});
    const dimensions = barDimensions(x, i);
    const textProps = {
      x: dimensions.x + dimensions.width / 2,
      y: dimensions.y - 0.01,
      ["text-anchor"]: "middle",
    };

    const cls = i === tooltipIndex ? "" : "barchart-label-hidden";
    return html`
      <g class="barchart-label ${cls}">
        <text class="barchart-label-bg" ...${textProps}>${label}</text>
        <text ...${textProps}>${label}</text>
      </g>
    `;
  }), [data, tooltipIndex]);

  return html`
    <svg viewBox="0 0 1 1" style=${props.style ?? {}}>
      ${bars}
      ${axes}
      ${barLabels}
    </svg>
  `;
}
