"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import {
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  X,
  BookOpen
} from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ResourceToastProps {
  specialty?: string
  condition?: string
}

export function ResourceToast({ specialty, condition }: ResourceToastProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const resources = getResourcesByContext(specialty, condition)

  if (!resources.length) return null

  return (
    <>
      {/* Persistent toast or icon button */}
      <div className="animate-in slide-in-from-bottom-5 fixed bottom-6 right-6 z-50">
        {isCollapsed ? (
          // Collapsed state - circular button
          <Button
            onClick={() => setIsCollapsed(false)}
            className="group relative flex size-12 items-center justify-center rounded-full p-0 shadow-lg"
          >
            <BookOpen className="size-5" />
            <span className="bg-background absolute -top-12 right-0 whitespace-nowrap rounded-md border px-3 py-1 text-xs opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              Open Healthcare Resources
            </span>
          </Button>
        ) : (
          // Expanded state - toast notification
          <div className="bg-background w-full max-w-sm overflow-hidden rounded-lg border shadow-lg sm:w-80">
            <div className="relative p-4 pr-10">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 size-7 rounded-full opacity-70 hover:opacity-100"
                onClick={() => setIsCollapsed(true)}
              >
                <X className="size-4" />
                <span className="sr-only">Minimize</span>
              </Button>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <FileText className="text-primary size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium">
                    {resources[0].title}
                  </h4>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {resources[0].description}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full justify-between"
                onClick={() => setIsOpen(true)}
              >
                View Resources <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Resources sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-md"
        >
          <SheetHeader className="text-left">
            <SheetTitle>Healthcare Resources</SheetTitle>
            <SheetDescription>
              Helpful guides and information for your healthcare journey
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {resources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface ResourceCardProps {
  resource: Resource
}

function ResourceCard({ resource }: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <div
            className={cn(
              "rounded-full p-1.5",
              resource.type === "guide"
                ? "bg-primary/10"
                : resource.type === "video"
                  ? "bg-orange-500/10"
                  : "bg-blue-500/10"
            )}
          >
            <FileText
              className={cn(
                "size-4",
                resource.type === "guide"
                  ? "text-primary"
                  : resource.type === "video"
                    ? "text-orange-500"
                    : "text-blue-500"
              )}
            />
          </div>
          {resource.title}
        </CardTitle>
        <CardDescription className="text-xs">
          {resource.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex h-auto items-center gap-1 p-0 text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
          <ChevronRight
            className={cn(
              "size-3 transition-transform",
              isExpanded ? "rotate-90" : ""
            )}
          />
        </Button>

        {isExpanded && (
          <div className="mt-3 space-y-3 text-sm">
            {resource.bulletPoints && (
              <div className="bg-muted/50 rounded-md p-3">
                <h4 className="mb-2 text-xs font-medium">Key Points:</h4>
                <ul className="space-y-1.5 text-xs">
                  {resource.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resource.additionalInfo && (
              <p className="text-muted-foreground text-xs">
                {resource.additionalInfo}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        {resource.url && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            asChild
          >
            <Link href={resource.url} target="_blank" rel="noopener noreferrer">
              {resource.type === "video" ? "Watch" : "Learn more"}{" "}
              <ExternalLink className="ml-1 size-3" />
            </Link>
          </Button>
        )}

        {resource.downloadUrl && (
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
            <Download className="size-3" /> Download
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

interface Resource {
  title: string
  description: string
  type: "guide" | "video" | "article"
  bulletPoints?: string[]
  additionalInfo?: string
  url?: string
  downloadUrl?: string
}

function getResourcesByContext(
  specialty?: string,
  condition?: string
): Resource[] {
  // Default resources that appear for all searches
  const defaultResources: Resource[] = [
    {
      title: "Doctor Visit Preparation Guide",
      description: "Make the most of your healthcare appointments",
      type: "guide",
      bulletPoints: [
        "Prepare a list of your current medications",
        "Write down your symptoms and concerns",
        "Bring your medical history and records",
        "Consider bringing a friend or family member"
      ],
      url: "/resources/appointment-guide",
      downloadUrl: "/downloads/appointment-checklist.pdf"
    },
    {
      title: "Understanding Medical Bills",
      description: "A guide to decoding healthcare costs and insurance",
      type: "article",
      bulletPoints: [
        "Common billing codes explained",
        "How to spot billing errors",
        "Negotiating medical bills",
        "Financial assistance programs"
      ],
      url: "/resources/medical-billing",
      downloadUrl: "/downloads/billing-guide.pdf"
    }
  ]

  // Specialty-specific resources
  if (specialty?.toLowerCase().includes("cardio")) {
    return [
      {
        title: "Heart Health Discussion Guide",
        description:
          "Questions to ask your cardiologist during your next appointment",
        type: "guide",
        bulletPoints: [
          "What lifestyle changes can improve my heart health?",
          "What tests should I expect during my visit?",
          "How do I know if my symptoms are serious?",
          "What medications might be right for me?"
        ],
        additionalInfo:
          "Developed by board-certified cardiologists to help patients have more productive appointments.",
        url: "/resources/cardiology-guide",
        downloadUrl: "/downloads/heart-health-checklist.pdf"
      },
      {
        title: "Understanding Heart Disease Risk Factors",
        description: "Learn about modifiable and non-modifiable risk factors",
        type: "article",
        bulletPoints: [
          "Family history and genetics",
          "Lifestyle factors you can control",
          "How to monitor your heart health at home",
          "Warning signs that require immediate attention"
        ],
        url: "/resources/heart-disease-risk"
      },
      {
        title: "Heart-Healthy Cooking Demonstration",
        description:
          "Video series featuring heart-healthy recipes and cooking techniques",
        type: "video",
        additionalInfo:
          "Featuring Chef Maria Lopez and Dr. James Chen, Cardiologist",
        url: "/resources/heart-healthy-cooking"
      },
      ...defaultResources
    ]
  }

  if (specialty?.toLowerCase().includes("pediatric")) {
    return [
      {
        title: "Child Wellness Checklist",
        description: "Essential topics to discuss with your pediatrician",
        type: "guide",
        bulletPoints: [
          "Age-appropriate developmental milestones",
          "Vaccination schedule and concerns",
          "Nutrition and growth tracking",
          "Common childhood illness symptoms to watch for"
        ],
        url: "/resources/pediatric-guide",
        downloadUrl: "/downloads/child-wellness-checklist.pdf"
      },
      {
        title: "Childhood Vaccination Schedule",
        description:
          "Complete guide to recommended immunizations from birth to age 18",
        type: "article",
        bulletPoints: [
          "CDC-recommended vaccination timeline",
          "What to expect after vaccinations",
          "Common concerns addressed",
          "Catch-up schedules for missed vaccines"
        ],
        url: "/resources/vaccination-schedule",
        downloadUrl: "/downloads/vaccination-chart.pdf"
      },
      ...defaultResources
    ]
  }

  if (condition?.toLowerCase().includes("diabet")) {
    return [
      {
        title: "Diabetes Management Guide",
        description: "Key questions for your diabetes care provider",
        type: "guide",
        bulletPoints: [
          "Understanding your A1C and glucose targets",
          "Medication management and side effects",
          "Diet and exercise recommendations",
          "Preventing long-term complications"
        ],
        url: "/resources/diabetes-guide",
        downloadUrl: "/downloads/diabetes-management.pdf"
      },
      {
        title: "Blood Sugar Monitoring Log",
        description:
          "Printable log to track glucose readings, meals, and medication",
        type: "guide",
        additionalInfo:
          "Includes space for notes about physical activity and how you're feeling.",
        downloadUrl: "/downloads/glucose-log.pdf"
      },
      {
        title: "Living Well with Diabetes",
        description:
          "Video series featuring real patients sharing their experiences and tips",
        type: "video",
        url: "/resources/diabetes-stories"
      },
      ...defaultResources
    ]
  }

  // Return default resources if no specific match
  return defaultResources
}
