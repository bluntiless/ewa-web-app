"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { AssessmentService } from "@/services/AssessmentService"

interface Assessment {
  id: string
  title: string
  status: "Pending" | "Completed" | "Overdue"
  dueDate: string
  assessor: string
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(AssessmentService.getMockAssessments())

  const handleViewDetails = (id: string) => {
    alert(`Viewing details for assessment: ${id}`)
    // In a real app, this would navigate to a detailed assessment page
  }

  const getStatusVariant = (status: Assessment["status"]) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Completed":
        return "default"
      case "Overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Assessments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {assessments.length === 0 ? (
            <p className="text-center text-gray-500">No assessments found.</p>
          ) : (
            <div className="grid gap-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-grow space-y-1 mb-3 md:mb-0">
                    <h3 className="text-lg font-semibold">{assessment.title}</h3>
                    <p className="text-sm text-gray-600">Assessor: {assessment.assessor}</p>
                    <p className="text-sm text-gray-600">Due Date: {assessment.dueDate}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end space-y-2 md:space-y-0 md:space-x-4 md:flex-row">
                    <Badge variant={getStatusVariant(assessment.status)} className="px-3 py-1 text-md">
                      {assessment.status}
                    </Badge>
                    <Button onClick={() => handleViewDetails(assessment.id)} size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <Separator />
          <Button className="w-full">Request New Assessment</Button>
        </CardContent>
      </Card>
    </div>
  )
}
