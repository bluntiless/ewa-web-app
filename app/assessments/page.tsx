"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react'
import React from 'react';

interface Assessment {
  id: string
  type: "EWA" | "NVQ" | "RPL"
  title: string
  date: string
  time: string
  location: string
  assessor: string
  status: "scheduled" | "completed" | "pending" | "cancelled"
  units: string[]
}

const mockAssessments: Assessment[] = [
  {
    id: "1",
    type: "EWA",
    title: "Practical Assessment - Electrical Installation",
    date: "2024-01-15",
    time: "09:00",
    location: "Workshop A, Building 2",
    assessor: "John Smith",
    status: "scheduled",
    units: ["Unit 1", "Unit 2"],
  },
  {
    id: "2",
    type: "NVQ",
    title: "Portfolio Review - Level 3 Electrical",
    date: "2024-01-10",
    time: "14:00",
    location: "Online",
    assessor: "Sarah Johnson",
    status: "completed",
    units: ["Unit 3", "Unit 4", "Unit 5"],
  },
  {
    id: "3",
    type: "RPL",
    title: "Recognition of Prior Learning Interview",
    date: "2024-01-20",
    time: "11:00",
    location: "Room 101, Building 1",
    assessor: "Mike Wilson",
    status: "pending",
    units: ["Unit 6", "Unit 7"],
  },
]

const AssessmentsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<"all" | "EWA" | "NVQ" | "RPL">("all")

  const filteredAssessments =
    selectedType === "all" ? mockAssessments : mockAssessments.filter((assessment) => assessment.type === selectedType)

  const getStatusIcon = (status: Assessment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: Assessment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Assessments</h1>
          <p className="text-neutral-400">Manage your assessment schedule and view results</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "EWA", "NVQ", "RPL"].map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type as any)}
              className="whitespace-nowrap"
            >
              {type === "all" ? "All Assessments" : type}
            </Button>
          ))}
        </div>

        {/* Assessments List */}
        <div className="space-y-4">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <CardDescription className="text-neutral-400">{assessment.type} Assessment</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(assessment.status)}
                    <Badge className={getStatusColor(assessment.status)}>
                      {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(assessment.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Clock className="h-4 w-4" />
                    {assessment.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <MapPin className="h-4 w-4" />
                    {assessment.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <User className="h-4 w-4" />
                    {assessment.assessor}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-neutral-400 mb-2">Units covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {assessment.units.map((unit, index) => (
                      <Badge key={index} variant="secondary" className="bg-neutral-800 text-neutral-300">
                        {unit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {assessment.status === "scheduled" && (
                    <>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="destructive">
                        Cancel
                      </Button>
                    </>
                  )}
                  {assessment.status === "completed" && (
                    <Button size="sm" variant="outline">
                      View Results
                    </Button>
                  )}
                  {assessment.status === "pending" && <Button size="sm">Book Assessment</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="text-center py-8">
              <p className="text-neutral-400">No assessments found for the selected filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AssessmentsPage;
