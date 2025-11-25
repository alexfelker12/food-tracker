"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

/* ---------------- CONFIG SECTION ---------------- */

const CHART_STYLE = {
  innerRadius: 26,
  outerRadius: 30,
  startAngle: 90,
  endAngle: -270,
  centerFontSize: "1rem",
  centerFontWeight: 600,
  animation: false,
  stroke: "none",
} as const;

/* ------------------------------------------------- */

type FoodMacroChartProps = {
  fatPer100g: number;
  carbsPer100g: number;
  proteinPer100g: number;
  portionGrams: number;
  numberOfPortions: number;
};

export function FoodMacroChart({
  fatPer100g,
  carbsPer100g,
  proteinPer100g,
  portionGrams,
  numberOfPortions,
}: FoodMacroChartProps) {
  const fatCals100 = fatPer100g * 9;
  const carbsCals100 = carbsPer100g * 4;
  const proteinCals100 = proteinPer100g * 4;

  const totalCals100 = fatCals100 + carbsCals100 + proteinCals100;

  const portionFactor = portionGrams / 100;
  const totalCalsPortion = totalCals100 * portionFactor;
  const totalCalsAllPortions = totalCalsPortion * numberOfPortions;

  const data = [
    { name: "Fette", value: fatCals100 },
    { name: "Kohlenhydrate", value: carbsCals100 },
    { name: "Proteine", value: proteinCals100 },
  ];

  const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

  const chartConfig = {
    Fette: { label: "Fette", color: COLORS[0] },
    Kohlenhydrate: { label: "Kohlenhydrate", color: COLORS[1] },
    Proteine: { label: "Proteine", color: COLORS[2] },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="w-full h-full min-h-[40px]">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={CHART_STYLE.innerRadius}
          outerRadius={CHART_STYLE.outerRadius}
          startAngle={CHART_STYLE.startAngle}
          endAngle={CHART_STYLE.endAngle}
          stroke={CHART_STYLE.stroke}
          isAnimationActive={CHART_STYLE.animation}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        {/* middle text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="pointer-events-none select-none"
        >
          {/* kcal number */}
          <tspan
            x="50%"
            y="50%"
            dy="-0.2em"
            style={{
              fontSize: "1.375rem",
              fontWeight: 500,
              fill: "var(--primary-foreground)",
            }}
          >
            {Math.round(totalCalsAllPortions)}
          </tspan>

          {/* kcal label */}
          <tspan
            x="50%"
            y="50%"
            dy="1em"
            style={{
              fontSize: "0.75rem",
              fontWeight: 400,
              fill: "var(--muted-foreground)",
            }}
          >
            Kcal
          </tspan>
        </text>
      </PieChart>
    </ChartContainer>
  );
}

function Temmp() {
  return (
    <div className="flex justify-between items-center gap-2 min-h-16">
      <div className="flex-1 items-center min-w-20 h-full">
        <FoodMacroChart
          carbsPer100g={0.8}
          fatPer100g={11}
          proteinPer100g={13}
          portionGrams={58}
          numberOfPortions={1}
        />
      </div>
      <div className="flex flex-col flex-1 items-center gap-0.5">
        <span className="text-chart-1 text-xs">2%</span>
        <span className="text-muted-foreground text-xs">0.3g</span>
        <span className="text-muted-foreground text-xs">Fette</span>
      </div>
      <div className="flex flex-col flex-1 items-center gap-0.5">
        <span className="text-chart-2 text-xs">2%</span>
        <span className="text-muted-foreground text-xs">0.3g</span>
        <span className="text-muted-foreground text-xs">Kohlenhydrate</span>
      </div>
      <div className="flex flex-col flex-1 items-center gap-0.5">
        <span className="text-chart-3 text-xs">2%</span>
        <span className="text-muted-foreground text-xs">0.3g</span>
        <span className="text-muted-foreground text-xs">Proteine</span>
      </div>
    </div>
  )
}
