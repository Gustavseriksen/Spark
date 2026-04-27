import { CardInterviewsOffers } from "@/components/card-interviews-offers"
import { CardSentApplications } from "@/components/card-sent-applications"
import { CardWeeklyGoal } from "@/components/card-weekly-goal"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      <CardSentApplications />
      <CardWeeklyGoal />
      <CardInterviewsOffers />
    </div>
  )
}
