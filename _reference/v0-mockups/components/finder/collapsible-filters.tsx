"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Locate
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"

interface FilterSection {
  id: string
  title: string
  content: React.ReactNode
}

export function CollapsibleFilters() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Set filters visible by default on desktop
  useEffect(() => {
    setIsFiltersVisible(isDesktop)
  }, [isDesktop])

  const filterSections: FilterSection[] = [
    {
      id: "distance",
      title: "Distance",
      content: (
        <div className="space-y-4">
          <Slider defaultValue={[25]} max={100} step={5} />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>0 mi</span>
            <span>25 mi</span>
            <span>100 mi</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex w-full items-center gap-1 text-xs"
          >
            <Locate className="size-3" /> Use Current Location
          </Button>
        </div>
      )
    },
    {
      id: "availability",
      title: "Availability",
      content: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="new-patients" />
            <Label htmlFor="new-patients" className="text-sm">
              Accepting new patients
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="telehealth" />
            <Label htmlFor="telehealth" className="text-sm">
              Offers telehealth
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="online-scheduling" />
            <Label htmlFor="online-scheduling" className="text-sm">
              Online scheduling
            </Label>
          </div>
        </div>
      )
    },
    {
      id: "appointment",
      title: "Appointment",
      content: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="next-available" />
            <Label htmlFor="next-available" className="text-sm">
              Next available
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="today" />
            <Label htmlFor="today" className="text-sm">
              Today
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="tomorrow" />
            <Label htmlFor="tomorrow" className="text-sm">
              Tomorrow
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="this-week" />
            <Label htmlFor="this-week" className="text-sm">
              This week
            </Label>
          </div>
        </div>
      )
    },
    {
      id: "specialty",
      title: "Specialty",
      content: (
        <div className="space-y-2">
          {[
            "Cardiology",
            "Pediatrics",
            "Family Medicine",
            "Internal Medicine",
            "Dermatology"
          ].map(specialty => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox id={specialty.toLowerCase().replace(/\s+/g, "-")} />
              <Label
                htmlFor={specialty.toLowerCase().replace(/\s+/g, "-")}
                className="text-sm"
              >
                {specialty}
              </Label>
            </div>
          ))}
          <Button variant="link" size="sm" className="h-6 p-0 text-xs">
            Show more specialties
          </Button>
        </div>
      )
    },
    {
      id: "conditions",
      title: "Conditions Treated",
      content: (
        <div className="space-y-2">
          {[
            "Diabetes",
            "Hypertension",
            "Asthma",
            "Arthritis",
            "Depression"
          ].map(condition => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox id={condition.toLowerCase().replace(/\s+/g, "-")} />
              <Label
                htmlFor={condition.toLowerCase().replace(/\s+/g, "-")}
                className="text-sm"
              >
                {condition}
              </Label>
            </div>
          ))}
          <Button variant="link" size="sm" className="h-6 p-0 text-xs">
            Show more conditions
          </Button>
        </div>
      )
    },
    {
      id: "procedures",
      title: "Procedures Performed",
      content: (
        <div className="space-y-2">
          {[
            "Colonoscopy",
            "Skin Biopsy",
            "Joint Injection",
            "Echocardiogram"
          ].map(procedure => (
            <div key={procedure} className="flex items-center space-x-2">
              <Checkbox id={procedure.toLowerCase().replace(/\s+/g, "-")} />
              <Label
                htmlFor={procedure.toLowerCase().replace(/\s+/g, "-")}
                className="text-sm"
              >
                {procedure}
              </Label>
            </div>
          ))}
          <Button variant="link" size="sm" className="h-6 p-0 text-xs">
            Show more procedures
          </Button>
        </div>
      )
    },
    {
      id: "insurance",
      title: "Insurance",
      content: (
        <div className="space-y-2">
          {["Medicare", "Blue Cross", "Aetna", "UnitedHealthcare", "Cigna"].map(
            insurance => (
              <div key={insurance} className="flex items-center space-x-2">
                <Checkbox id={insurance.toLowerCase().replace(/\s+/g, "-")} />
                <Label
                  htmlFor={insurance.toLowerCase().replace(/\s+/g, "-")}
                  className="text-sm"
                >
                  {insurance}
                </Label>
              </div>
            )
          )}
          <Button variant="link" size="sm" className="h-6 p-0 text-xs">
            Show more insurance plans
          </Button>
        </div>
      )
    },
    {
      id: "demographics",
      title: "Patient Demographics",
      content: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="adults" />
            <Label htmlFor="adults" className="text-sm">
              Adults
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="children" />
            <Label htmlFor="children" className="text-sm">
              Children
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="seniors" />
            <Label htmlFor="seniors" className="text-sm">
              Seniors
            </Label>
          </div>
        </div>
      )
    },
    {
      id: "hospital",
      title: "Hospital Affiliation",
      content: (
        <div className="space-y-2">
          {[
            "Memorial Hospital",
            "University Medical Center",
            "Community Hospital"
          ].map(hospital => (
            <div key={hospital} className="flex items-center space-x-2">
              <Checkbox id={hospital.toLowerCase().replace(/\s+/g, "-")} />
              <Label
                htmlFor={hospital.toLowerCase().replace(/\s+/g, "-")}
                className="text-sm"
              >
                {hospital}
              </Label>
            </div>
          ))}
          <Button variant="link" size="sm" className="h-6 p-0 text-xs">
            Show more hospitals
          </Button>
        </div>
      )
    },
    {
      id: "gender",
      title: "Gender",
      content: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="male" />
            <Label htmlFor="male" className="text-sm">
              Male
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="female" />
            <Label htmlFor="female" className="text-sm">
              Female
            </Label>
          </div>
        </div>
      )
    }
  ]

  return (
    <>
      {/* Mobile filter toggle button */}
      <div className="mb-4 md:hidden">
        <Button
          variant="outline"
          className="flex w-full items-center justify-between"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          <span className="flex items-center">
            <Filter className="mr-2 size-4" /> Filters
          </span>
          {isFiltersVisible ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
      </div>

      {/* Filters content */}
      <div className={`${isFiltersVisible ? "block" : "hidden md:block"}`}>
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <Filter className="size-4" /> Filters
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 md:hidden"
                  onClick={() => setIsFiltersVisible(false)}
                >
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>

            {/* Filter sections */}
            <div className="space-y-6">
              {filterSections.map(section => (
                <Collapsible
                  key={section.id}
                  defaultOpen={section.id === "distance"}
                >
                  <div className="space-y-2">
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
                      <span>{section.title}</span>
                      <ChevronRight className="ui-open:rotate-90 size-4 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      {section.content}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}

              <Button className="w-full">
                <SlidersHorizontal className="mr-2 size-4" /> Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
