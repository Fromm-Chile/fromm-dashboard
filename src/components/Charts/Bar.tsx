import ResizableBox from "./ResizableBox";
import useDemoConfig from "../../hooks/useDemoConfig";
import React from "react";
import { AxisOptions, Chart } from "react-charts";

export default function Bar() {
  const { data } = useDemoConfig({
    series: 3,
    dataType: "ordinal",
  });

  const primaryAxis = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  return (
    <>
      <ResizableBox>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </ResizableBox>
    </>
  );
}
