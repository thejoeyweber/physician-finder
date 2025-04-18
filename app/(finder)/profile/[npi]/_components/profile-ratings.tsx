"use client"

import type { SelectPhysician } from "@/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"
import { useMockData } from "./profile-client-content"
import { Star } from "lucide-react"

interface ProfileRatingsProps {
  physician: SelectPhysician
}

export function ProfileRatings({ physician }: ProfileRatingsProps) {
  const { ratings, metrics } = useMockData(physician)

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Star className="size-5" /> Ratings & Reviews
          <MockDataIndicator field="ratings" />
        </h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg p-4 md:w-1/3">
            <div className="mb-2 text-5xl font-bold">{metrics.rating}</div>
            <div className="mb-2 flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`size-5 ${star <= metrics.rating ? "fill-primary text-primary" : "text-muted"}`}
                />
              ))}
            </div>
            <div className="text-muted-foreground text-sm">
              Based on {metrics.reviewCount} reviews
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Trustworthiness</span>
                  <span className="text-sm font-medium">
                    {ratings.trustworthiness}
                  </span>
                </div>
                <Progress
                  value={ratings.trustworthiness * 20}
                  className="h-2"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Explains conditions well</span>
                  <span className="text-sm font-medium">
                    {ratings.explainsConditions}
                  </span>
                </div>
                <Progress
                  value={ratings.explainsConditions * 20}
                  className="h-2"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Takes time to answer questions
                  </span>
                  <span className="text-sm font-medium">
                    {ratings.answersQuestions}
                  </span>
                </div>
                <Progress
                  value={ratings.answersQuestions * 20}
                  className="h-2"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Provides follow-up as needed</span>
                  <span className="text-sm font-medium">
                    {ratings.providesFollowUp}
                  </span>
                </div>
                <Progress
                  value={ratings.providesFollowUp * 20}
                  className="h-2"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Staff friendliness</span>
                  <span className="text-sm font-medium">
                    {ratings.staffFriendliness}
                  </span>
                </div>
                <Progress
                  value={ratings.staffFriendliness * 20}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
