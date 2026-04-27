"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Total sent applications, split into targeted and unsolicited"

const chartData = [
  { month: "current", targetedApplications: 132, unsolicitedApplications: 276 },
]

const chartConfig = {
  unsolicitedApplications: {
    label: "Unsolicited Applications",
    color: "var(--chart-1)",
  },
  targetedApplications: {
    label: "Targeted Applications",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function CardSentApplications() {
  const totalSent =
    chartData[0].targetedApplications + chartData[0].unsolicitedApplications

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
        <CardTitle>Total Sent Applications</CardTitle>
        <CardDescription>April – June 2024</CardDescription>
      </CardHeader>
      <CardContent className="relative flex flex-1 items-center px-2 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[230px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            cy="70%"
            innerRadius="85%"
            outerRadius="100%"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <RadialBar
              dataKey="targetedApplications"
              fill="var(--color-targetedApplications)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="unsolicitedApplications"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-unsolicitedApplications)"
              className="stroke-transparent stroke-2"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 28}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSent.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 6}
                          className="fill-muted-foreground text-sm"
                        >
                          Sent
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
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total applications for the last 3 months
        </div>
      </CardFooter>
    </Card>
  )
}
