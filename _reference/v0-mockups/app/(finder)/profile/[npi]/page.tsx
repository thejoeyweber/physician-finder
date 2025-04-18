import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPhysicianByNpi } from "@/lib/actions"
import { notFound } from "next/navigation"
import {
  Star,
  Share,
  Printer,
  Calendar,
  MessageSquare,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Stethoscope,
  Flag,
  Edit,
  ThumbsUp,
  Activity,
  Pill,
  Building,
  User,
  Users,
  Briefcase,
  GraduationCap,
  BookOpen,
  Heart,
  Check
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProfilePageProps {
  params: {
    npi: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const physician = await getPhysicianByNpi(params.npi)

  if (!physician) {
    notFound()
  }

  // Calculate years of experience (mock data)
  const yearsOfExperience = 15

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <div className="text-muted-foreground mb-1 flex items-center gap-2">
            <Link href="/results" className="text-sm hover:underline">
              Back to results
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {physician.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {physician.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Heart className="size-4" />
            <span className="hidden sm:inline">Save to favorites</span>
            <span className="sm:hidden">Save</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Schedule appointment</span>
            <span className="sm:hidden">Schedule</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">
                Overview
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex-1">
                Locations
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="background" className="flex-1">
                Background
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="md:w-1/3">
                      <div className="bg-muted relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-md md:mx-0">
                        <Image
                          src="/placeholder.svg"
                          alt={physician.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                        <Stethoscope className="size-5" /> About
                      </h2>
                      <div className="mb-3 flex items-center gap-2">
                        <Briefcase className="text-muted-foreground size-4" />
                        <span>{yearsOfExperience} years of experience</span>
                      </div>
                      <p className="mb-4">
                        Dr. {physician.name.split(" ")[1]} is a{" "}
                        {physician.specialties[0]} specialist with extensive
                        experience in patient care.
                        {physician.specialties.length > 1 &&
                          ` They also specialize in ${physician.specialties.slice(1).join(", ")}.`}
                      </p>
                      <p className="text-muted-foreground italic">
                        Dr. {physician.name.split(" ")[1]} is dedicated to
                        providing comprehensive care for patients with a wide
                        range of conditions. With a patient-centered approach,
                        they focus on preventive care and personalized treatment
                        plans to help patients achieve optimal health outcomes.
                      </p>
                      <p className="text-muted-foreground mt-4 text-xs">
                        (Source: AI Model, Last Refreshed: April 2025)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Activity className="size-5" /> Conditions Treated
                  </h2>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {getConditionsBySpecialty(physician.specialties[0]).map(
                      (condition, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="text-primary size-4" />
                          <span>{condition}</span>
                        </div>
                      )
                    )}
                  </div>
                  <Button variant="link" className="mt-4 h-auto p-0">
                    View all conditions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Pill className="size-5" /> Procedures Performed
                  </h2>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {getProceduresBySpecialty(physician.specialties[0]).map(
                      (procedure, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="text-primary size-4" />
                          <span>{procedure}</span>
                        </div>
                      )
                    )}
                  </div>
                  <Button variant="link" className="mt-4 h-auto p-0">
                    View all procedures
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations" className="mt-6 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <MapPin className="size-5" /> Practice Locations
                  </h2>

                  {physician.locations.map((location, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      {index > 0 && <Separator className="mb-6" />}
                      <h3 className="mb-2 font-medium">
                        Location {index + 1}:
                      </h3>
                      <p className="font-medium">{location.name}</p>
                      <p>{location.address1}</p>
                      {location.address2 && <p>{location.address2}</p>}
                      <p>
                        {location.city}, {location.state} {location.zip}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Phone className="text-muted-foreground size-4" />
                        <p>{location.phone}</p>
                      </div>
                      {location.fax && (
                        <div className="mt-1 flex items-center gap-2">
                          <Mail className="text-muted-foreground size-4" />
                          <p>Fax: {location.fax}</p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`https://maps.google.com/?q=${encodeURIComponent(
                              `${location.address1}, ${location.city}, ${location.state} ${location.zip}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="mr-1 size-4" /> Get Directions
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-1 size-4" /> Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Building className="size-5" /> Hospital Affiliations
                  </h2>
                  <div className="space-y-4">
                    {getHospitalAffiliations().map((hospital, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Building className="text-muted-foreground mt-0.5 size-4" />
                        <div>
                          <p className="font-medium">{hospital.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {hospital.address}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Clock className="size-5" /> Office Hours
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4 text-xs">
                    Hours are approximate and may vary. Please call to confirm.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Star className="size-5" /> Ratings & Reviews
                  </h2>
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg p-4 md:w-1/3">
                      <div className="mb-2 text-5xl font-bold">4.2</div>
                      <div className="mb-2 flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`size-5 ${star <= 4 ? "fill-primary text-primary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Based on 42 reviews
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Trustworthiness</span>
                            <span className="text-sm font-medium">4.5</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Explains conditions well
                            </span>
                            <span className="text-sm font-medium">4.3</span>
                          </div>
                          <Progress value={86} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Takes time to answer questions
                            </span>
                            <span className="text-sm font-medium">4.1</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Provides follow-up as needed
                            </span>
                            <span className="text-sm font-medium">4.0</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Staff friendliness</span>
                            <span className="text-sm font-medium">3.9</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-lg font-semibold">
                    Patient Reviews
                  </h2>
                  <div className="space-y-6">
                    {[
                      {
                        name: "Sarah J.",
                        date: "March 15, 2025",
                        rating: 5,
                        comment:
                          "Dr. Reed was very thorough and took the time to explain everything to me. I never felt rushed during my appointment."
                      },
                      {
                        name: "Michael T.",
                        date: "February 28, 2025",
                        rating: 4,
                        comment:
                          "Very knowledgeable doctor. The wait time was a bit long, but the care I received was worth it."
                      },
                      {
                        name: "Jessica L.",
                        date: "January 10, 2025",
                        rating: 5,
                        comment:
                          "I've been seeing Dr. Reed for years and have always received excellent care. Highly recommend!"
                      }
                    ].map((review, index) => (
                      <div key={index} className="pb-4 last:pb-0">
                        {index > 0 && <Separator className="mb-4" />}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{review.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {review.date}
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`size-4 ${
                                  star <= review.rating
                                    ? "fill-primary text-primary"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                        <div className="mt-2 flex gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                          >
                            <ThumbsUp className="size-4" /> Helpful
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                          >
                            <Flag className="size-4" /> Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4 w-full">Write a Review</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="background" className="mt-6 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <GraduationCap className="size-5" /> Education & Training
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Medical School</h3>
                      <p>University of Chicago Pritzker School of Medicine</p>
                      <p className="text-muted-foreground text-sm">
                        Graduated 2010
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Residency</h3>
                      <p>Johns Hopkins Hospital</p>
                      <p className="text-muted-foreground text-sm">
                        Completed 2013
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Fellowship</h3>
                      <p>Mayo Clinic</p>
                      <p className="text-muted-foreground text-sm">
                        Completed 2015
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Award className="size-5" /> Certifications & Licensure
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Board Certification</h3>
                      <p>American Board of Internal Medicine</p>
                      <p className="text-muted-foreground text-sm">
                        Certified 2015, Expires 2025
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">State Licenses</h3>
                      <p>Illinois Medical License</p>
                      <p className="text-muted-foreground text-sm">
                        Active, Expires 2026
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Award className="size-5" /> Awards & Recognition
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Award className="text-primary mt-0.5 size-4" />
                      <div>
                        <p className="font-medium">Top Doctor Award</p>
                        <p className="text-muted-foreground text-sm">
                          2023, 2024
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="text-primary mt-0.5 size-4" />
                      <div>
                        <p className="font-medium">Patient's Choice Award</p>
                        <p className="text-muted-foreground text-sm">
                          2022, 2023, 2024
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="text-primary mt-0.5 size-4" />
                      <div>
                        <p className="font-medium">
                          Compassionate Doctor Recognition
                        </p>
                        <p className="text-muted-foreground text-sm">
                          2021, 2022, 2023
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <BookOpen className="size-5" /> Publications & Research
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Journal Articles</h3>
                      <ul className="mt-2 list-disc space-y-2 pl-5">
                        <li>
                          <p>
                            "Advances in Treatment Options for Cardiovascular
                            Disease" - Journal of Cardiology, 2023
                          </p>
                        </li>
                        <li>
                          <p>
                            "Patient Outcomes Following Implementation of New
                            Hypertension Guidelines" - American Journal of
                            Medicine, 2022
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium">Research Interests</h3>
                      <ul className="mt-2 list-disc space-y-2 pl-5">
                        <li>
                          <p>Preventive cardiology</p>
                        </li>
                        <li>
                          <p>Hypertension management</p>
                        </li>
                        <li>
                          <p>Heart failure treatment outcomes</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-lg font-semibold">
                Contact & Appointments
              </h2>
              <div className="space-y-4">
                <Button className="w-full">
                  <Calendar className="mr-2 size-4" /> Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 size-4" /> Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 size-4" /> Call Office
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-lg font-semibold">Insurance</h2>
              <p className="mb-2 text-sm">This provider may accept:</p>
              <ul className="space-y-1 text-sm">
                <li>• Medicare</li>
                <li>• Blue Cross Blue Shield</li>
                <li>• Aetna</li>
                <li>• UnitedHealthcare</li>
                <li>• Cigna</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-xs">
                Please contact the provider's office to verify insurance
                coverage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-lg font-semibold">
                Patient Demographics
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground size-4" />
                  <span>Treats adults and children</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground size-4" />
                  <span>All genders welcome</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-primary size-4" />
                  <span>Accepting new patients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-primary size-4" />
                  <span>Offers telehealth appointments</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Share className="mr-2 size-4" /> Share Profile
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Printer className="mr-2 size-4" /> Print Profile
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Flag className="mr-2 size-4" /> Report Incorrect Information
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Edit className="mr-2 size-4" /> Claim This Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getConditionsBySpecialty(specialty: string): string[] {
  const conditionsBySpecialty: Record<string, string[]> = {
    Cardiology: [
      "Heart Disease",
      "Hypertension",
      "Arrhythmia",
      "Heart Failure",
      "Coronary Artery Disease",
      "Valve Disorders"
    ],
    Pediatrics: [
      "Asthma",
      "Allergies",
      "Developmental Disorders",
      "Ear Infections",
      "Respiratory Infections",
      "Childhood Obesity"
    ],
    "Internal Medicine": [
      "Diabetes",
      "Hypertension",
      "COPD",
      "Arthritis",
      "Thyroid Disorders",
      "Infectious Diseases"
    ],
    Dermatology: [
      "Acne",
      "Eczema",
      "Psoriasis",
      "Skin Cancer",
      "Rosacea",
      "Dermatitis"
    ]
  }

  return conditionsBySpecialty[specialty] || ["General Health Conditions"]
}

function getProceduresBySpecialty(specialty: string): string[] {
  const proceduresBySpecialty: Record<string, string[]> = {
    Cardiology: [
      "Echocardiogram",
      "Stress Test",
      "Cardiac Catheterization",
      "Pacemaker Implantation",
      "Cardioversion",
      "Holter Monitoring"
    ],
    Pediatrics: [
      "Well-Child Visits",
      "Immunizations",
      "Growth Assessments",
      "Developmental Screenings",
      "Vision and Hearing Tests",
      "Allergy Testing"
    ],
    "Internal Medicine": [
      "Annual Physical Exams",
      "Preventive Screenings",
      "Chronic Disease Management",
      "Vaccinations",
      "EKG",
      "Blood Pressure Monitoring"
    ],
    Dermatology: [
      "Skin Biopsy",
      "Mole Removal",
      "Cryotherapy",
      "Acne Treatment",
      "Botox Injections",
      "Laser Therapy"
    ]
  }

  return proceduresBySpecialty[specialty] || ["General Medical Procedures"]
}

function getHospitalAffiliations(): Array<{ name: string; address: string }> {
  return [
    {
      name: "Memorial Hospital",
      address: "500 Medical Center Dr, Springfield, IL 62704"
    },
    {
      name: "University Medical Center",
      address: "1200 University Ave, Springfield, IL 62704"
    }
  ]
}
