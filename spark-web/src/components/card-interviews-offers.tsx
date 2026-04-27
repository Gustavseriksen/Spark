"use client"

import { TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardInterviewsOffers() {
  return (
    <Card className="@container/card flex flex-col">
      <div className="flex flex-1 flex-col justify-start gap-2 py-2">
        <CardHeader>
          <CardDescription className="text-xl font-bold text-white">Received Interviews</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
            18
          </CardTitle>
        </CardHeader>
        <div className="text-muted-foreground px-4 text-lg">
          Up from last month
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-2 border-t py-6">
        <CardHeader>
        <CardDescription className="text-xl font-bold text-white">Received Offers</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5
          </CardTitle>
        </CardHeader>
        <div className="text-muted-foreground px-4 text-lg">
          Strong conversion rate
        </div>
      </div>
    </Card>
  )
}
