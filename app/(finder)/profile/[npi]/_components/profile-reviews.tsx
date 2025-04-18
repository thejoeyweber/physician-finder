"use client"

import type { SelectPhysician } from "@/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"
import { useMockData } from "./profile-client-content"
import { Star } from "lucide-react"

interface ProfileReviewsProps {
  physician: SelectPhysician
}

export function ProfileReviews({ physician }: ProfileReviewsProps) {
  const { reviews } = useMockData(physician)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Patient Reviews
          <MockDataIndicator field="reviews" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`size-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">
                  {review.date}
                </span>
              </div>
              <div className="font-medium">{review.name}</div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
