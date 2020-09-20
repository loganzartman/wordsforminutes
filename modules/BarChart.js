import {html, useState, useMemo} from "./preact.js";

const defaultFormatter = (value) => value.toLocaleString(undefined, {maximumFractionDigits: 2});

export default function BarChart({style, data, labels, formatter=defaultFormatter, horizontal}={}) {
  const [tooltipIndex, setTooltipIndex] = useState(-1);
  const barSpacing = 0.1;
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

  const mainAxisLabelProps = {};
  if (horizontal) {
    mainAxisLabelProps["x"] = right;
    mainAxisLabelProps["y"] = bottom;
    mainAxisLabelProps["text-anchor"] = "start";
    mainAxisLabelProps["dominant-baseline"] = "middle";
  } else {
    mainAxisLabelProps["x"] = left - 0.01;
    mainAxisLabelProps["y"] = top;
    mainAxisLabelProps["text-anchor"] = "end";
    mainAxisLabelProps["dominant-baseline"] = "hanging";
  }
  const mainAxisLabelText = formatter(max);
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
    <text class="barchart-label barchart-label-bg" ...${mainAxisLabelProps} >${mainAxisLabelText}</text>
    <text class="barchart-label" ...${mainAxisLabelProps} >${mainAxisLabelText}</text>
  `;

  const barDimensions = (value, i) => {
    const mainSize = horizontal ? plotWidth : plotHeight;
    const crossSize = horizontal ? plotHeight : plotWidth;
    const crossPos = spacePerBar * 0.5 + i / count * crossSize;
    const mainBarSize = value / max * mainSize;
    const crossBarSize = barWidth;

    if (horizontal) {
      return {
        x: left,
        y: top + crossPos,
        width: mainBarSize,
        height: crossBarSize
      };
    } else {
      return {
        x: left + crossPos,
        y: bottom - mainBarSize,
        width: crossBarSize,
        height: mainBarSize
      };
    }
  };

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

  const valueLabels = useMemo(() => data.map((x, i) => {
    const label = formatter(x);
    const dimensions = barDimensions(x, i);

    const textProps = {};
    if (horizontal) {
      textProps["text-anchor"] = "start";
      textProps["dominant-baseline"] = "middle";
      textProps.x = dimensions.x + dimensions.width + 0.02;
      textProps.y = dimensions.y + dimensions.height / 2;
    } else {
      textProps["text-anchor"] = "middle";
      textProps["dominant-baseline"] = "baseline";
      textProps.x = dimensions.x + dimensions.width / 2;
      textProps.y = dimensions.y - 0.02;
    }

    const cls = i === tooltipIndex ? "" : "barchart-label-hidden";
    return html`
      <g class="barchart-label ${cls}">
        <text class="barchart-label-bg" ...${textProps}>${label}</text>
        <text ...${textProps}>${label}</text>
      </g>
    `;
  }), [data, tooltipIndex]);

  const namedLabels = useMemo(() => {
    if (!labels)
      return null;
    if (labels.length !== data.length)
      throw new Error(`Length of labels (${labels.length}) must equal length of data (${data.length})`);

    return labels.map((label, i) => {
      const dimensions = barDimensions(0, i);
      
      const textProps = {};
      if (horizontal) {
        textProps["text-anchor"] = "end";
        textProps["dominant-baseline"] = "middle";
        textProps.x = dimensions.x - 0.01;
        textProps.y = dimensions.y + dimensions.height / 2;
      } else {
        textProps["text-anchor"] = "middle";
        textProps["dominant-baseline"] = "hanging";
        textProps.x = dimensions.x + dimensions.width / 2;
        textProps.y = dimensions.y + 0.01;
      }

      return html`
        <g class="barchart-label">
          <text ...${textProps}>${label}</text>
        </g>
      `;
    });
  }, [labels, data]);

  return html`
    <svg viewBox="0 0 1 1" style=${style ?? {}}>
      ${bars}
      ${axes}
      ${valueLabels}
      ${namedLabels}
    </svg>
  `;
}
