import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ResourceCardProps {
  specialty?: string
  condition?: string
}

export function ResourceCard({ specialty, condition }: ResourceCardProps) {
  const resources = getResourcesByContext(specialty, condition)

  if (!resources.length) return null

  const resource = resources[0] // Display the first relevant resource

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="text-primary size-5" />
          {resource.title}
        </CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {resource.bulletPoints && (
          <ul className="space-y-1 text-sm">
            {resource.bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="link" className="text-primary h-auto p-0" asChild>
          <Link href={resource.url}>
            Learn more <ExternalLink className="ml-1 size-3" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="size-4" /> Download Guide
        </Button>
      </CardFooter>
    </Card>
  )
}

function getResourcesByContext(
  specialty?: string,
  condition?: string
): Array<{
  title: string
  description: string
  bulletPoints?: string[]
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
      url: "/resources/appointment-guide"
    }
  ]
}
