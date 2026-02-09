"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SkillRatingGroupProps {
  idPrefix: string
  skillId: string
  skillText: string
  knowledgeValue: "limited" | "adequate" | "extensive" | "unsure" | ""
  experienceValue: "limited" | "adequate" | "extensive" | "unsure" | ""
  onKnowledgeChange: (value: "limited" | "adequate" | "extensive" | "unsure") => void
  onExperienceChange: (value: "limited" | "adequate" | "extensive" | "unsure") => void
}

export default function SkillRatingGroup({
  idPrefix,
  skillId,
  skillText,
  knowledgeValue,
  experienceValue,
  onKnowledgeChange,
  onExperienceChange,
}: SkillRatingGroupProps) {
  const options = [
    { value: "limited", label: "Limited" },
    { value: "adequate", label: "Adequate" },
    { value: "extensive", label: "Extensive" },
    { value: "unsure", label: "Unsure" },
  ]

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <p className="font-medium text-gray-800 mb-3">{skillText}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-sm font-semibold text-gray-700">Knowledge</Label>
          <RadioGroup
            value={knowledgeValue}
            onValueChange={onKnowledgeChange}
            className="flex flex-wrap gap-x-4 gap-y-2"
          >
            {options.map((option) => (
              <div key={`${idPrefix}-${skillId}-knowledge-${option.value}`} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${idPrefix}-${skillId}-knowledge-${option.value}`} />
                <Label htmlFor={`${idPrefix}-${skillId}-knowledge-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label className="mb-2 block text-sm font-semibold text-gray-700">Experience</Label>
          <RadioGroup
            value={experienceValue}
            onValueChange={onExperienceChange}
            className="flex flex-wrap gap-x-4 gap-y-2"
          >
            {options.map((option) => (
              <div key={`${idPrefix}-${skillId}-experience-${option.value}`} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${idPrefix}-${skillId}-experience-${option.value}`} />
                <Label htmlFor={`${idPrefix}-${skillId}-experience-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
