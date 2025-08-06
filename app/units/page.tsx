'use client'

import { useState, useMemo } from "react"
import { allUnits, getUnitsByQualification, searchUnits } from "@/data/units"
import { Unit, LearningOutcome, PerformanceCriteria } from "@/models/Unit"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Circle, Search, XCircle } from 'lucide-react'
import Link from "next/link"

export default function UnitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "ewa" | "nvq">("all")

  const filteredUnits = useMemo(() => {
    let unitsToFilter: Unit[] = []
    if (activeTab === "all") {
      unitsToFilter = allUnits
    } else if (activeTab === "ewa") {
      unitsToFilter = getUnitsByQualification("EWA")
    } else {
      unitsToFilter = getUnitsByQualification("NVQ")
    }

    if (searchTerm) {
      return searchUnits(searchTerm)
    }
    return unitsToFilter
  }, [searchTerm, activeTab])

  const getStatusIcon = (status: "completed" | "in-progress" | "not-started") => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Circle className="h-4 w-4 text-yellow-500" />
      case "not-started":
      default:
        return <XCircle className="h-4 w-4 text-neutral-500" />
    }
  }

  // Mock function for progress - replace with actual logic later
  const getUnitProgress = (unitCode: string) => {
    // In a real app, this would fetch actual progress from a backend/context
    const totalCriteria = allUnits.find(u => u.code === unitCode)?.learningOutcomes.flatMap(lo => lo.performanceCriteria).length || 0
    const completedCriteria = Math.floor(Math.random() * (totalCriteria + 1)); // Random for demo
    
    if (totalCriteria === 0) return { status: "not-started", progress: 0 };
    if (completedCriteria === totalCriteria) return { status: "completed", progress: 100 };
    if (completedCriteria > 0) return { status: "in-progress", progress: (completedCriteria / totalCriteria) * 100 };
    return { status: "not-started", progress: 0 };
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Units</h1>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search units by code, title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "ewa" | "nvq")} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 bg-neutral-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ewa">EWA</TabsTrigger>
              <TabsTrigger value="nvq">NVQ</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredUnits.length === 0 && (
          <div className="text-center text-neutral-400 py-10">
            <p>No units found matching your criteria.</p>
          </div>
        )}

        <div className="space-y-4">
          {filteredUnits.map((unit) => {
            const { status, progress } = getUnitProgress(unit.code);
            return (
              <Card key={unit.code} className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        {unit.qualification}
                      </Badge>
                      <CardTitle className="text-xl">{unit.code}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-sm text-neutral-400">{progress.toFixed(0)}%</span>
                    </div>
                  </div>
                  <CardDescription className="text-neutral-300">{unit.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-400 mb-4">{unit.description}</p>
                  <Accordion type="single" collapsible className="w-full">
                    {unit.learningOutcomes.map((lo) => (
                      <AccordionItem key={lo.code} value={lo.code} className="border-neutral-700">
                        <AccordionTrigger className="text-neutral-200 hover:no-underline">
                          <span className="font-medium">{lo.code}:</span> {lo.description}
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 pt-2 text-neutral-400">
                          <ul className="list-disc list-inside space-y-1">
                            {lo.performanceCriteria.map((pc) => (
                              <li key={pc.code}>
                                <Link href={`/criteria?unit=${unit.code}&criteria=${pc.code}`} className="hover:underline">
                                  <span className="font-mono text-neutral-300">{pc.code}:</span> {pc.description}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
