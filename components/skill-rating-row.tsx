"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SkillRatingRowProps {
  idPrefix: string
  skillId: string
  skillText: string
  knowledgeValue: "limited" | "adequate" | "extensive" | "unsure" | ""
  experienceValue: "limited" | "adequate" | "extensive" | "unsure" | ""
  onKnowledgeChange: (v: "limited" | "adequate" | "extensive" | "unsure") => void
  onExperienceChange: (v: "limited" | "adequate" | "extensive" | "unsure") => void
}

export default function SkillRatingRow({
  idPrefix,
  skillId,
  skillText,
  knowledgeValue,
  experienceValue,
  onKnowledgeChange,
  onExperienceChange,
}: SkillRatingRowProps) {
  const opts = [
    { value: "limited", label: "Limited" },
    { value: "adequate", label: "Adequate" },
    { value: "extensive", label: "Extensive" },
    { value: "unsure", label: "Unsure" },
  ]

  return (
    <tr className="border-b border-gray-200 last:border-b-0">
      {/* Description */}
      <td className="w-[40%] py-3 pr-4 text-sm font-medium text-gray-800 align-top">{skillText}</td>

      {/* KNOWLEDGE */}
      <td className="w-[30%] py-3 px-2 align-top">
        <RadioGroup
          value={knowledgeValue}
          onValueChange={onKnowledgeChange}
          className="grid grid-cols-4 gap-y-1 justify-items-center"
        >
          {opts.map((o) => (
            <div key={`${idPrefix}-${skillId}-k-${o.value}`} className="flex flex-col items-center">
              <RadioGroupItem id={`${idPrefix}-${skillId}-k-${o.value}`} value={o.value} />
              <Label
                htmlFor={`${idPrefix}-${skillId}-k-${o.value}`}
                className="mt-1 text-[11px] leading-snug text-gray-700" // Changed leading-none to leading-snug for more vertical space
              >
                {o.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </td>

      {/* EXPERIENCE */}
      <td className="w-[30%] py-3 px-2 align-top">
        <RadioGroup
          value={experienceValue}
          onValueChange={onExperienceChange}
          className="grid grid-cols-4 gap-y-1 justify-items-center"
        >
          {opts.map((o) => (
            <div key={`${idPrefix}-${skillId}-e-${o.value}`} className="flex flex-col items-center">
              <RadioGroupItem id={`${idPrefix}-${skillId}-e-${o.value}`} value={o.value} />
              <Label
                htmlFor={`${idPrefix}-${skillId}-e-${o.value}`}
                className="mt-1 text-[11px] leading-snug text-gray-700" // Changed leading-none to leading-snug for more vertical space
              >
                {o.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </td>
    </tr>
  )
}
