"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, Award, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import BottomNavigation from "../components/BottomNavigation"
import { ewaUnits } from "../data/ewaUnits"
import { allNVQ1605Units } from "../data/ealUnits"

export default function HomePage() {
  const [selectedQualification, setSelectedQualification] = useState<"ewa" | "nvq">("ewa")

  // Calculate EWA progress
  const ewaCompleted = ewaUnits.filter((unit) => unit.progress === 100).length
  const ewaInProgress = ewaUnits.filter((unit) => unit.progress > 0 && unit.progress < 100).length
  const ewaTotal = ewaUnits.length
  const ewaOverallProgress = Math.round(ewaUnits.reduce((sum, unit) => sum + unit.progress, 0) / ewaTotal)

  // Calculate NVQ progress
  const nvqCompleted = allNVQ1605Units.filter((unit) => unit.progress === 100).length
  const nvqInProgress = allNVQ1605Units.filter((unit) => unit.progress > 0 && unit.progress < 100).length
  const nvqTotal = allNVQ1605Units.length
  const nvqOverallProgress = Math.round(allNVQ1605Units.reduce((sum, unit) => sum + unit.progress, 0) / nvqTotal)

  const currentUnits = selectedQualification === "ewa" ? ewaUnits : allNVQ1605Units
  const currentProgress = selectedQualification === "ewa" ? ewaOverallProgress : nvqOverallProgress
  const currentCompleted = selectedQualification === "ewa" ? ewaCompleted : nvqCompleted
  const currentInProgress = selectedQualification === "ewa" ? ewaInProgress : nvqInProgress
  const currentTotal = selectedQualification === "ewa" ? ewaTotal : nvqTotal

  // Recent activity (mock data)
  const recentActivity = [
    { type: "evidence", unit: "NETP3-01", action: "Evidence uploaded", time: "2 hours ago" },
    { type: "assessment", unit: "NETP3-02", action: "Assessment completed", time: "1 day ago" },
    { type: "feedback", unit: "NETP3-03", action: "Feedback received", time: "2 days ago" },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Qualifications</h1>
          <p className="text-gray-400">Track your progress across EWA and NVQ qualifications</p>
        </div>

        {/* Qualification Selector */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={selectedQualification === "ewa" ? "default" : "outline"}
            onClick={() => setSelectedQualification("ewa")}
            className={
              selectedQualification === "ewa"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }
          >
            <Award className="w-4 h-4 mr-2" />
            EWA Qualification
          </Button>
          <Button
            variant={selectedQualification === "nvq" ? "default" : "outline"}
            onClick={() => setSelectedQualification("nvq")}
            className={
              selectedQualification === "nvq"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }
          >
            <BookOpen className="w-4 h-4 mr-2" />
            NVQ 1605 Level 3
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Overall Progress</p>
                  <p className="text-2xl font-bold text-white">{currentProgress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <Progress value={currentProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Completed Units</p>
                  <p className="text-2xl font-bold text-green-500">{currentCompleted}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">of {currentTotal} total units</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-500">{currentInProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">units being worked on</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Remaining</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {currentTotal - currentCompleted - currentInProgress}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">units to start</p>
            </CardContent>
          </Card>
        </div>

        {/* Units Grid */}
        <Card className="bg-neutral-900 border-neutral-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              {selectedQualification === "ewa" ? "EWA Units" : "NVQ 1605 Units"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUnits.slice(0, 9).map((unit) => (
                <div key={unit.id} className="bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{unit.displayCode || unit.code}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{unit.title}</p>
                    </div>
                    <Badge
                      variant={unit.progress === 100 ? "default" : unit.progress > 0 ? "secondary" : "outline"}
                      className={`ml-2 text-xs ${
                        unit.progress === 100
                          ? "bg-green-600 hover:bg-green-700"
                          : unit.progress > 0
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "border-neutral-600 text-neutral-400"
                      }`}
                    >
                      {unit.progress === 100 ? "Complete" : unit.progress > 0 ? "In Progress" : "Not Started"}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{unit.progress}%</span>
                    </div>
                    <Progress value={unit.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
            {currentUnits.length > 9 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent"
                >
                  View All {currentTotal} Units
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-neutral-800 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "evidence"
                        ? "bg-blue-500"
                        : activity.type === "assessment"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.unit}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
