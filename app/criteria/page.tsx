'use client'

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { allUnits } from "@/data/units"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, XCircle, ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default function CriteriaPage() {
  const searchParams = useSearchParams()
  const unitCode = searchParams.get("unit")
  const criteriaCode = searchParams.get("criteria")

  const unit = useMemo(() => {
    return allUnits.find((u) => u.code === unitCode)
  }, [unitCode])

  const learningOutcome = useMemo(() => {
    return unit?.learningOutcomes.find((lo) =>
      lo.performanceCriteria.some((pc) => pc.code === criteriaCode)
    )
  }, [unit, criteriaCode])

  const performanceCriteria = useMemo(() => {
    return learningOutcome?.performanceCriteria.find((pc) => pc.code === criteriaCode)
  }, [learningOutcome, criteriaCode])

  // Mock function for progress - replace with actual logic later
  const getCriteriaStatus = (code: string) => {
    // In a real app, this would fetch actual status from a backend/context
    const statuses = ["completed", "in-progress", "not-started"]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  if (!unit || !learningOutcome || !performanceCriteria) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Criteria Not Found</h1>
        <p className="text-neutral-400 mb-6">
          The unit or performance criteria you are looking for could not be found.
        </p>
        <Link href="/units" passHref>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Units
          </Button>
        </Link>
      </div>
    )
  }

  const status = getCriteriaStatus(performanceCriteria.code)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "not-started":
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Circle className="h-5 w-5 text-yellow-500" />
      case "not-started":
      default:
        return <XCircle className="h-5 w-5 text-neutral-500" />
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/units" passHref>
          <Button variant="outline" className="mb-6 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Units
          </Button>
        </Link>

        <Card className="bg-neutral-900 border-neutral-800 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  {unit.qualification}
                </Badge>
                <CardTitle className="text-2xl">{unit.code}</CardTitle>
              </div>
              <Badge className={getStatusColor(status)}>
                {getStatusIcon(status)}
                <span className="ml-2">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </Badge>
            </div>
            <CardDescription className="text-neutral-300">{unit.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400">{unit.description}</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-xl">Learning Outcome: {learningOutcome.code}</CardTitle>
            <CardDescription className="text-neutral-300">{learningOutcome.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-3">Performance Criteria: {performanceCriteria.code}</h3>
            <p className="text-neutral-400 mb-4">{performanceCriteria.description}</p>

            <div className="flex gap-4">
              <Button className="bg-green-600 hover:bg-green-700">Mark as Completed</Button>
              <Button variant="outline">Upload Evidence</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
