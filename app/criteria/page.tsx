"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useState, useMemo } from "react"
import { allUnits } from "@/data/units"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function CriteriaPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUnits = useMemo(() => {
    if (!searchTerm) {
      return allUnits
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return allUnits
      .map((unit) => {
        const filteredLearningOutcomes = unit.learningOutcomes
          .map((lo) => {
            const filteredPerformanceCriteria = lo.performanceCriteria.filter(
              (pc) =>
                pc.id.toLowerCase().includes(lowerCaseSearchTerm) ||
                pc.description.toLowerCase().includes(lowerCaseSearchTerm),
            )
            return { ...lo, performanceCriteria: filteredPerformanceCriteria }
          })
          .filter((lo) => lo.performanceCriteria.length > 0)

        if (
          unit.id.toLowerCase().includes(lowerCaseSearchTerm) ||
          unit.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          filteredLearningOutcomes.length > 0
        ) {
          return { ...unit, learningOutcomes: filteredLearningOutcomes }
        }
        return null
      })
      .filter(Boolean)
  }, [searchTerm])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">All Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search criteria by ID or description..."
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredUnits.length === 0 && (
            <p className="text-center text-gray-500">No criteria found matching your search.</p>
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
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
