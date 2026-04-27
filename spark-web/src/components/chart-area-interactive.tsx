"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-04-02", unsolicitedApplications: 2, targetedApplications: 2 },
  { date: "2024-04-03", unsolicitedApplications: 4, targetedApplications: 1 },
  { date: "2024-04-04", unsolicitedApplications: 5, targetedApplications: 2 },
  { date: "2024-04-05", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-04-06", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-04-07", unsolicitedApplications: 1, targetedApplications: 0 },
  { date: "2024-04-08", unsolicitedApplications: 6, targetedApplications: 3 },
  { date: "2024-04-09", unsolicitedApplications: 3, targetedApplications: 2 },
  { date: "2024-04-10", unsolicitedApplications: 4, targetedApplications: 1 },
  { date: "2024-04-11", unsolicitedApplications: 2, targetedApplications: 2 },
  { date: "2024-04-12", unsolicitedApplications: 5, targetedApplications: 3 },
  { date: "2024-04-13", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-04-14", unsolicitedApplications: 1, targetedApplications: 1 },
  { date: "2024-04-15", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-04-16", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-04-17", unsolicitedApplications: 7, targetedApplications: 3 },
  { date: "2024-04-18", unsolicitedApplications: 5, targetedApplications: 2 },
  { date: "2024-04-19", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-04-20", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-04-21", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-04-22", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-04-23", unsolicitedApplications: 3, targetedApplications: 2 },
  { date: "2024-04-24", unsolicitedApplications: 6, targetedApplications: 4 },
  { date: "2024-04-25", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-04-26", unsolicitedApplications: 1, targetedApplications: 1 },
  { date: "2024-04-27", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-04-28", unsolicitedApplications: 2, targetedApplications: 0 },
  { date: "2024-04-29", unsolicitedApplications: 5, targetedApplications: 3 },
  { date: "2024-04-30", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-05-01", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-05-02", unsolicitedApplications: 3, targetedApplications: 2 },
  { date: "2024-05-03", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-05-04", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-05-05", unsolicitedApplications: 1, targetedApplications: 0 },
  { date: "2024-05-06", unsolicitedApplications: 8, targetedApplications: 4 },
  { date: "2024-05-07", unsolicitedApplications: 5, targetedApplications: 2 },
  { date: "2024-05-08", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-05-09", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-05-10", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-05-11", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-05-12", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-05-13", unsolicitedApplications: 6, targetedApplications: 3 },
  { date: "2024-05-14", unsolicitedApplications: 7, targetedApplications: 3 },
  { date: "2024-05-15", unsolicitedApplications: 5, targetedApplications: 2 },
  { date: "2024-05-16", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-05-17", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-05-18", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-05-19", unsolicitedApplications: 1, targetedApplications: 1 },
  { date: "2024-05-20", unsolicitedApplications: 5, targetedApplications: 2 },
  { date: "2024-05-21", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-05-22", unsolicitedApplications: 1, targetedApplications: 1 },
  { date: "2024-05-23", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-05-24", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-05-25", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-05-26", unsolicitedApplications: 1, targetedApplications: 0 },
  { date: "2024-05-27", unsolicitedApplications: 7, targetedApplications: 4 },
  { date: "2024-05-28", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-05-29", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-05-30", unsolicitedApplications: 5, targetedApplications: 3 },
  { date: "2024-05-31", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-06-01", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-06-02", unsolicitedApplications: 1, targetedApplications: 0 },
  { date: "2024-06-03", unsolicitedApplications: 6, targetedApplications: 3 },
  { date: "2024-06-04", unsolicitedApplications: 5, targetedApplications: 2 },
  { date: "2024-06-05", unsolicitedApplications: 1, targetedApplications: 1 },
  { date: "2024-06-06", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-06-07", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-06-08", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-06-09", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-06-10", unsolicitedApplications: 5, targetedApplications: 3 },
  { date: "2024-06-11", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-06-12", unsolicitedApplications: 8, targetedApplications: 4 },
  { date: "2024-06-13", unsolicitedApplications: 1, targetedApplications: 1 },
  { date: "2024-06-14", unsolicitedApplications: 6, targetedApplications: 2 },
  { date: "2024-06-15", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-06-16", unsolicitedApplications: 1, targetedApplications: 0 },
  { date: "2024-06-17", unsolicitedApplications: 7, targetedApplications: 3 },
  { date: "2024-06-18", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-06-19", unsolicitedApplications: 5, targetedApplications: 2 },
  { date: "2024-06-20", unsolicitedApplications: 6, targetedApplications: 3 },
  { date: "2024-06-21", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-06-22", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-06-23", unsolicitedApplications: 1, targetedApplications: 1 },
  { date: "2024-06-24", unsolicitedApplications: 4, targetedApplications: 2 },
  { date: "2024-06-25", unsolicitedApplications: 3, targetedApplications: 1 },
  { date: "2024-06-26", unsolicitedApplications: 6, targetedApplications: 3 },
  { date: "2024-06-27", unsolicitedApplications: 7, targetedApplications: 4 },
  { date: "2024-06-28", unsolicitedApplications: 2, targetedApplications: 1 },
  { date: "2024-06-29", unsolicitedApplications: 0, targetedApplications: 0 },
  { date: "2024-06-30", unsolicitedApplications: 5, targetedApplications: 2 },
]

const chartConfig = {
  visitors: {
    label: "Sent Applications",
  },
  unsolicitedApplications: {
    label: "Unsolicited Applications",
    color: "var(--chart-1)",
  },
  targetedApplications: {
    label: "Targeted Applications",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Applications</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillUnsolicitedApplications" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-unsolicitedApplications)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-unsolicitedApplications)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTargetedApplications" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-targetedApplications)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-targetedApplications)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="targetedApplications"
              type="natural"
              fill="url(#fillTargetedApplications)"
              stroke="var(--color-targetedApplications)"
              stackId="a"
            />
            <Area
              dataKey="unsolicitedApplications"
              type="natural"
              fill="url(#fillUnsolicitedApplications)"
              stroke="var(--color-unsolicitedApplications)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
