import {html, useState, useMemo} from "./preact.js";

const defaultFormatter = (value) => value.toLocaleString(undefined, {maximumFractionDigits: 2});
const defaultPairFormatter = (x, y) => `${defaultFormatter(x)}, ${defaultFormatter(y)}`;

export default function ScatterPlot({style, xData, yData, formatter=defaultFormatter, pairFormatter=defaultPairFormatter, title}={}) {
  const [tooltipIndex, setTooltipIndex] = useState(-1);
  const margin = 0.1;

  const width = 1;
  const height = 1;
  const left = margin;
  const right = width - margin;
  const top = margin;
  const bottom = height - margin;
  const plotWidth = right - left;
  const plotHeight = bottom - top;

  const xMax = Math.max(...xData);
  const yMax = Math.max(...yData);

  const yAxisLabelProps = {
    x: left - 0.01,
    y: top,
    "text-anchor": "end",
    "dominant-baseline": "hanging"
  };
  const xAxisLabelProps = {
    "x": right,
    "y": bottom,
    "text-anchor": "start",
    "dominant-baseline": "middle",
  };

  const xAxisLabelText = formatter(xMax);
  const yAxisLabelText = formatter(yMax);
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
    <text class="barchart-label barchart-label-bg" ...${xAxisLabelProps} >${xAxisLabelText}</text>
    <text class="barchart-label" ...${xAxisLabelProps} >${xAxisLabelText}</text>
    <text class="barchart-label barchart-label-bg" ...${yAxisLabelProps} >${yAxisLabelText}</text>
    <text class="barchart-label" ...${yAxisLabelProps} >${yAxisLabelText}</text>
  `;

  const pointsData = [];
  for (let i = 0; i < xData.length; ++i) {
    const x = left + plotWidth * xData[i] / xMax;
    const y = bottom - plotHeight * yData[i] / yMax;
    pointsData.push([x, y]);
  }

  const points = pointsData.map(([x, y], i) => {
    return html`
      <g 
        key=${i}
        class="scatterplot-point"
        onPointerOver=${() => setTooltipIndex(i)}
        onPointerOut=${() => setTooltipIndex(-1)}
      >
        <circle class="scatterplot-point-area" cx=${x} cy=${y} r=${0.04} />
        <circle cx=${x} cy=${y} r=${0.01} />
      </g> 
    `;
  });

  const pointLabels = pointsData.map(([x, y], i) => {
    const label = pairFormatter(x, y);

    const textProps = {
      "text-anchor": "middle",
      "dominant-baseline": "baseline",
      x: x,
      y: y - 0.04,
    };

    const cls = i === tooltipIndex ? "" : "barchart-label-hidden";
    return html`
      <g key=${i} class="barchart-label ${cls}">
        <text class="barchart-label-bg" ...${textProps}>${label}</text>
        <text ...${textProps}>${label}</text>
      </g>
    `;
  });

  const line = html`
    <polyline
      class="scatterplot-line"
      points=${pointsData.map(([x, y]) => x + "," + y).join(" ")}
    />
  `;

  const titleElem = title && html`
    <div class="barchart-title">${title}</div>
  `;
  return html`
    <div style=${{display: "inline-flex", flexDirection: "column"}}>
      ${titleElem}
      <svg viewBox="0 0 1 1" style=${style ?? {}}>
        ${axes}
        ${line}
        ${points}
        ${pointLabels}
      </svg>
    </div>
  `;
}
