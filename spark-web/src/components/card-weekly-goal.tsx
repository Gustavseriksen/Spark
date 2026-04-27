"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Weekly application goal progress"

const goal = 50
const sent = 12

const chartData = [{ name: "sent", value: sent, fill: "var(--color-sent)" }]

const chartConfig = {
  value: {
    label: "Sent",
  },
  sent: {
    label: "Sent",
    color: "#ffffff",
  },
} satisfies ChartConfig

export function CardWeeklyGoal() {
  const progress = Math.min(sent / goal, 1)
  const endAngle = progress * 360
  const percent = Math.round(progress * 100)

  return (
    <Card className="@container/card relative flex flex-col bg-radial from-zinc-300 via-zinc-700 to-black text-white ring-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-white/5 via-transparent to-transparent"
      />
      <CardHeader className="relative items-center pb-0">
        <CardTitle>Weekly Goal</CardTitle>
        <CardDescription>This week</CardDescription>
      </CardHeader>
      <CardContent className="relative flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            outerRadius={90}
            innerRadius={80}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-white/5 last:fill-black/70"
              polarRadius={[90, 80]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-4xl font-bold"
                        >
                          {sent} / {goal}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white/60"
                        >
                          Weekly Goal
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="relative flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {percent}% of weekly goal reached <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-white/60">
          Resets every Monday
        </div>
      </CardFooter>
    </Card>
  )
}
