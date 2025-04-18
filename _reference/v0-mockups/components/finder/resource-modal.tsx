"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { FileText, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ResourceModalProps {
  specialty?: string
  condition?: string
}

export function ResourceModal({ specialty, condition }: ResourceModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const resource = getResourcesByContext(specialty, condition)[0] // Get the first relevant resource

  if (!resource) return null

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="group relative flex size-14 flex-col items-center justify-center rounded-full p-0 shadow-lg"
        >
          <FileText className="size-6" />
          <span className="bg-background absolute -top-12 right-0 whitespace-nowrap rounded-md border px-3 py-1 text-xs opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            {resource.title}
          </span>
        </Button>
      </div>

      {/* Modal dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="text-primary size-5" />
              {resource.title}
            </DialogTitle>
            <DialogDescription>{resource.description}</DialogDescription>
          </DialogHeader>

          {resource.bulletPoints && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-md p-4">
                <h3 className="mb-2 font-medium">Key Questions to Ask:</h3>
                <ul className="space-y-2">
                  {resource.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {resource.additionalTips && (
                <div>
                  <h3 className="mb-2 font-medium">Additional Tips:</h3>
                  <ul className="space-y-2">
                    {resource.additionalTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more <ExternalLink className="ml-1 size-3" />
              </Link>
            </Button>
            <Button size="sm" className="gap-1">
              <Download className="size-4" /> Download Guide
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function getResourcesByContext(
  specialty?: string,
  condition?: string
): Array<{
  title: string
  description: string
  bulletPoints?: string[]
  additionalTips?: string[]
  url: string
}> {
  // This would typically come from a database or API
  // For now, we'll return static resources based on the context

  if (specialty?.toLowerCase().includes("cardio")) {
    return [
      {
        title: "Heart Health Discussion Guide",
        description:
          "Questions to ask your cardiologist during your next appointment",
        bulletPoints: [
          "What lifestyle changes can improve my heart health?",
          "What tests should I expect during my visit?",
          "How do I know if my symptoms are serious?",
          "What medications might be right for me?"
        ],
        additionalTips: [
          "Bring a list of all medications you're currently taking",
          "Note any family history of heart disease",
          "Track your blood pressure readings before your appointment",
          "Write down any symptoms you've experienced, including when they occur"
        ],
        url: "/resources/cardiology-guide"
      }
    ]
  }

  if (specialty?.toLowerCase().includes("pediatric")) {
    return [
      {
        title: "Child Wellness Checklist",
        description: "Essential topics to discuss with your pediatrician",
        bulletPoints: [
          "Age-appropriate developmental milestones",
          "Vaccination schedule and concerns",
          "Nutrition and growth tracking",
          "Common childhood illness symptoms to watch for"
        ],
        additionalTips: [
          "Bring your child's immunization records",
          "Note any changes in eating, sleeping, or behavior",
          "Prepare questions about developmental concerns",
          "Consider bringing a second adult to help with your child during the exam"
        ],
        url: "/resources/pediatric-guide"
      }
    ]
  }

  if (condition?.toLowerCase().includes("diabet")) {
    return [
      {
        title: "Diabetes Management Guide",
        description: "Key questions for your diabetes care provider",
        bulletPoints: [
          "Understanding your A1C and glucose targets",
          "Medication management and side effects",
          "Diet and exercise recommendations",
          "Preventing long-term complications"
        ],
        additionalTips: [
          "Bring your glucose monitoring logs",
          "Note any episodes of high or low blood sugar",
          "List any changes in medication or diet since your last visit",
          "Ask about new treatment options or technologies"
        ],
        url: "/resources/diabetes-guide"
      }
    ]
  }

  // Default resource if no specific match
  return [
    {
      title: "Doctor Visit Preparation Guide",
      description: "Make the most of your healthcare appointments",
      bulletPoints: [
        "Prepare a list of your current medications",
        "Write down your symptoms and concerns",
        "Bring your medical history and records",
        "Consider bringing a friend or family member"
      ],
      additionalTips: [
        "Prioritize your questions - ask the most important ones first",
        "Take notes during your appointment",
        "Ask for clarification if you don't understand something",
        "Discuss follow-up plans before leaving"
      ],
      url: "/resources/appointment-guide"
    }
  ]
}
