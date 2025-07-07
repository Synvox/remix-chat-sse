import { forwardRef } from "react";

export function iconOf(path: string, width = 24, height = width, padding = 0) {
  const max = Math.max(width, height);
  const realPadding = (max * padding) / 24;
  const transform = `translate(${(max - width) / 2}px,${(max - height) / 2}px)`;
  const viewBox = `${-realPadding} ${-realPadding} ${max + realPadding * 2} ${
    max + realPadding * 2
  }`;
  return forwardRef<SVGSVGElement, JSX.IntrinsicElements["svg"]>(
    ({ width = "24px", height = "24px", className, ...props }, ref) => {
      return (
        <svg
          preserveAspectRatio="xMidYMid meet"
          viewBox={viewBox}
          fill="currentColor"
          ref={ref}
          width={width}
          height={height}
          className={["icon", className].filter(Boolean).join(" ")}
          role="presentation"
          {...props}
        >
          <g style={{ transform }}>
            <path d={path} />
          </g>
        </svg>
      );
    },
  );
}

export type IconFunction = ReturnType<typeof iconOf>;
export type Icon = ReturnType<IconFunction>;
