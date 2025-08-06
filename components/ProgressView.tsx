"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertTriangle, BookOpen } from "lucide-react"
import type { Unit } from "@/models/Unit"

interface ProgressViewProps {
  units: Unit[]
}

export default function ProgressView({ units }: ProgressViewProps) {
  const totalUnits = units.length
  const completedUnits = units.filter((u) => u.status === "completed").length
  const inProgressUnits = units.filter((u) => u.status === "in_progress").length
  const notStartedUnits = units.filter((u) => u.status === "not_started").length

  const overallProgress = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0

  const getStatusIcon = (status: Unit["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "assessed":
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-neutral-500" />
    }
  }

  const getStatusColor = (status: Unit["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "assessed":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription>
            {completedUnits} of {totalUnits} units completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={overallProgress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{completedUnits}</div>
                <div className="text-sm text-neutral-400">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{inProgressUnits}</div>
                <div className="text-sm text-neutral-400">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-400">{notStartedUnits}</div>
                <div className="text-sm text-neutral-400">Not Started</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Unit Progress</h3>
        {units.map((unit) => (
          <Card key={unit.id} className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">
                    {unit.code}: {unit.title}
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    Level {unit.level} • {unit.credits} credits • {unit.qualificationType}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(unit.status)}
                  <Badge className={getStatusColor(unit.status)}>
                    {unit.status.replace("_", " ").charAt(0).toUpperCase() + unit.status.replace("_", " ").slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Progress</span>
                  <span className="font-medium">{Math.round(unit.overallProgress)}%</span>
                </div>
                <Progress value={unit.overallProgress} className="h-2" />

                <div className="grid grid-cols-2 gap-4 text-sm text-neutral-400">
                  <div>
                    <span className="font-medium">Learning Outcomes:</span> {unit.learningOutcomes.length}
                  </div>
                  <div>
                    <span className="font-medium">Estimated Hours:</span> {unit.estimatedHours}
                  </div>
                </div>

                {unit.mandatory && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Mandatory Unit
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
