/*
<ai_context>
This client component provides the features section for the landing page.
</ai_context>
*/

"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  AppWindow,
  Database,
  DollarSign,
  LucideIcon,
  Shield
} from "lucide-react"

interface FeatureProps {
  title: string
  description: string
  icon: LucideIcon
}

const features: FeatureProps[] = [
  {
    title: "Frontend",
    description: "Next.js, Tailwind, Shadcn, Framer Motion",
    icon: AppWindow
  },
  {
    title: "Backend",
    description: "Postgres, Supabase, Drizzle ORM, Server Actions",
    icon: Database
  },
  {
    title: "Auth",
    description: "Clerk",
    icon: Shield
  },
  {
    title: "Payments",
    description: "Stripe",
    icon: DollarSign
  }
]

const FeatureCard = ({ title, description, icon: Icon }: FeatureProps) => (
  <div className="transform-gpu">
    <Card className="group transition-shadow duration-200 hover:shadow-lg">
      <CardHeader>
        <Icon className="text-primary mb-2 size-12" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </div>
)

export const FeaturesSection = () => {
  return (
    <section className="mt-20 bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div>
          <h2 className="mb-12 text-center text-4xl font-bold">Tech Stack</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
