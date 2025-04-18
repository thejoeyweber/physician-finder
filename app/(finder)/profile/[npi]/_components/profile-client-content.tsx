"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { Calendar, Heart, MessageSquare, Share, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import type { SelectPhysician } from "@/db/schema"

interface ProfileClientContentProps {
  physician: SelectPhysician
}

export function ProfileClientContent({ physician }: ProfileClientContentProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved
        ? "Removed from saved physicians"
        : "Saved to your profile",
      description: isSaved
        ? "This physician has been removed from your saved list"
        : "You can view your saved physicians in your profile"
    })
  }

  const handleShare = async (method: "copy" | "email") => {
    const profileUrl = window.location.href

    if (method === "copy") {
      await navigator.clipboard.writeText(profileUrl)
      toast({
        title: "Link copied",
        description: "The profile link has been copied to your clipboard"
      })
    } else if (method === "email") {
      const subject = `Check out Dr. ${physician.lastName}'s profile`
      const body = `I thought you might be interested in this physician's profile:\n\n${profileUrl}`
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={isSaved ? "default" : "outline"}
        size="sm"
        className="gap-1"
        onClick={handleSave}
      >
        <Heart className="size-4" fill={isSaved ? "currentColor" : "none"} />
        <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="gap-1">
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Schedule</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule an Appointment</DialogTitle>
            <DialogDescription>
              This feature is coming soon. Please call the office directly to
              schedule an appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href={`tel:${physician.phoneNumbers?.[0]?.number}`}>
                Call Office
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Share className="size-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShare("copy")}>
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("email")}>
            Share via Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
