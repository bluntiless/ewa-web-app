"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronRight, Search, BookOpen, Award, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react'
import { getUnitsByQualification, searchUnits, getQualificationStats } from "../../data/units"
import BottomNavigation from "../../components/BottomNavigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

export default function UnitsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set())
  const [selectedQualification, setSelectedQualification] = useState<"EWA" | "NVQ">("EWA")
  const [searchTerm, setSearchTerm] = useState("")

  // Get filtered units based on search and qualification
  const filteredUnits = useMemo(() => {
    const units = searchQuery ? searchUnits(searchQuery) : getUnitsByQualification(selectedQualification)

    return units.filter((unit) => unit.qualification === selectedQualification)
  }, [searchQuery, selectedQualification])

  // Get qualification statistics
  const ewaStats = getQualificationStats("EWA")
  const nvqStats = getQualificationStats("NVQ")
  const currentStats = selectedQualification === "EWA" ? ewaStats : nvqStats

  const toggleUnitExpansion = (unitId: string) => {
    const newExpanded = new Set(expandedUnits)
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId)
    } else {
      newExpanded.add(unitId)
    }
    setExpandedUnits(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in_progress":
        return <Play className="w-4 h-4 text-blue-500" />
      case "not_started":
        return <Clock className="w-4 h-4 text-gray-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "not_started":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "core":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "specialist":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "project":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "knowledge":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "performance":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Units & Qualifications</h1>
          <p className="text-gray-400">
            Explore the units for EWA and NVQ Level 3 Electrical Installation qualifications
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search units by title, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-neutral-900 border-neutral-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Qualification Tabs */}
        <Tabs value={selectedQualification} onValueChange={(value) => setSelectedQualification(value as "EWA" | "NVQ")}>
          <TabsList className="grid w-full grid-cols-2 bg-neutral-900 border-neutral-700">
            <TabsTrigger value="EWA" className="data-[state=active]:bg-blue-600">
              EWA Level 3
            </TabsTrigger>
            <TabsTrigger value="NVQ" className="data-[state=active]:bg-blue-600">
              NVQ Level 3
            </TabsTrigger>
          </TabsList>

          <TabsContent value="EWA" className="space-y-6">
            {/* EWA Overview */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  Electrical Installation Work (EWA) - Level 3
                </CardTitle>
                <CardDescription>
                  The EWA qualification provides the knowledge and skills required for electrical installation work in
                  building services engineering.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{ewaStats.totalUnits}</div>
                    <div className="text-sm text-gray-400">Total Units</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{ewaStats.completedUnits}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{ewaStats.inProgressUnits}</div>
                    <div className="text-sm text-gray-400">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-500">{ewaStats.totalCredits}</div>
                    <div className="text-sm text-gray-400">Total Credits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="NVQ" className="space-y-6">
            {/* NVQ Overview */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  NVQ Level 3 Electrical Installation
                </CardTitle>
                <CardDescription>
                  The NVQ Level 3 qualification demonstrates competence in electrical installation work across a range
                  of contexts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{nvqStats.totalUnits}</div>
                    <div className="text-sm text-gray-400">Total Units</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{nvqStats.completedUnits}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{nvqStats.inProgressUnits}</div>
                    <div className="text-sm text-gray-400">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-500">{nvqStats.totalCredits}</div>
                    <div className="text-sm text-gray-400">Total Credits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Units List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {selectedQualification} Units ({filteredUnits.length})
            </h2>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              >
                Clear Search
              </Button>
            )}
          </div>

          {filteredUnits.length === 0 ? (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  {searchQuery ? "No units found matching your search." : "No units available."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUnits.map((unit) => (
              <Card key={unit.id} className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{unit.code}</CardTitle>
                        <Badge className={getCategoryColor(unit.category)}>{unit.category}</Badge>
                        <Badge className={getStatusColor(unit.status || "not_started")}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(unit.status || "not_started")}
                            {(unit.status || "not_started").replace("_", " ")}
                          </div>
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{unit.title}</CardTitle>
                      <CardDescription className="text-gray-400">{unit.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>Level {unit.level}</span>
                        <span>{unit.credits} Credits</span>
                        <span>{unit.qualification}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleUnitExpansion(unit.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {expandedUnits.has(unit.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      View Details
                    </Button>
                  </div>
                </CardHeader>

                {expandedUnits.has(unit.id) && (
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-800 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-500">{unit.learningOutcomes?.length || 0}</div>
                          <div className="text-sm text-gray-400">Learning Outcomes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {unit.learningOutcomes?.reduce(
                              (total, lo) => total + (lo.performanceCriteria?.length || 0),
                              0,
                            ) || 0}
                          </div>
                          <div className="text-sm text-gray-400">Performance Criteria</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">
                            {Math.round(unit.overallProgress || 0)}%
                          </div>
                          <div className="text-sm text-gray-400">Progress</div>
                        </div>
                      </div>

                      {/* Learning Outcomes */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Learning Outcomes</h4>
                        <div className="space-y-4">
                          {unit.learningOutcomes?.map((outcome) => (
                            <div key={outcome.id} className="border border-neutral-700 rounded-lg p-4">
                              <h5 className="font-semibold text-blue-400 mb-2">
                                {outcome.id}: {outcome.title}
                              </h5>
                              <p className="text-gray-300 mb-3">{outcome.description}</p>

                              {/* Performance Criteria */}
                              <div>
                                <h6 className="text-sm font-medium text-gray-400 mb-2">Performance Criteria:</h6>
                                <div className="space-y-2">
                                  {(outcome.performanceCriteria || outcome.assessmentCriteria)?.map((criteria) => (
                                    <div key={criteria.id} className="flex items-start gap-3 text-sm">
                                      <div className="flex items-center gap-2 min-w-0">
                                        {getStatusIcon(criteria.status || "not_started")}
                                        <span className="font-mono text-xs text-gray-500 min-w-fit">{criteria.id}</span>
                                      </div>
                                      <span className="text-gray-300 flex-1">{criteria.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* All Units Search Bar */}
        <div className="relative mb-6 mt-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search units by ID or title..."
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* All Units List */}
        <div className="space-y-4">
          {filteredUnits.length === 0 && (
            <p className="text-center text-gray-500">No units found matching your search.</p>
          )}

          <Accordion type="multiple" className="w-full">
            {filteredUnits.map((unit) => (
              <Card key={unit.id} className="mb-4">
                <AccordionItem value={unit.id}>
                  <AccordionTrigger className="p-4 text-left hover:no-underline">
                    <div className="flex flex-col items-start">
                      <h3 className="text-lg font-semibold">
                        {unit.id}: {unit.title}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        {unit.qualification}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <div className="space-y-4">
                      {unit.learningOutcomes.map((lo) => (
                        <div key={lo.id} className="border rounded-md p-3 bg-gray-50">
                          <h4 className="font-medium text-md mb-2">
                            {lo.id}. {lo.description}
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {lo.performanceCriteria.map((pc) => (
                              <li key={pc.id}>
                                <strong>{pc.id}:</strong> {pc.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <Link href={`/criteria?unitId=${unit.id}`} passHref>
                        <Button variant="outline" size="sm">
                          View All Criteria for Unit
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
