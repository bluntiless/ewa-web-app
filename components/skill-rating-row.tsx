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
    <>
      {/* Mobile Layout */}
      <tr className="md:hidden border-b border-gray-200 last:border-b-0">
        <td colSpan={3} className="py-4 px-2">
          <div className="space-y-4">
            {/* Skill Description */}
            <div className="text-sm font-medium text-gray-800">{skillText}</div>

            {/* Knowledge Section */}
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Knowledge</div>
              <RadioGroup value={knowledgeValue} onValueChange={onKnowledgeChange} className="grid grid-cols-2 gap-2">
                {opts.map((o) => (
                  <div key={`${idPrefix}-${skillId}-k-${o.value}`} className="flex items-center space-x-2">
                    <RadioGroupItem
                      id={`${idPrefix}-${skillId}-k-${o.value}`}
                      value={o.value}
                      className="flex-shrink-0"
                    />
                    <Label
                      htmlFor={`${idPrefix}-${skillId}-k-${o.value}`}
                      className="text-xs text-gray-700 leading-tight"
                    >
                      {o.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Experience Section */}
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Experience</div>
              <RadioGroup value={experienceValue} onValueChange={onExperienceChange} className="grid grid-cols-2 gap-2">
                {opts.map((o) => (
                  <div key={`${idPrefix}-${skillId}-e-${o.value}`} className="flex items-center space-x-2">
                    <RadioGroupItem
                      id={`${idPrefix}-${skillId}-e-${o.value}`}
                      value={o.value}
                      className="flex-shrink-0"
                    />
                    <Label
                      htmlFor={`${idPrefix}-${skillId}-e-${o.value}`}
                      className="text-xs text-gray-700 leading-tight"
                    >
                      {o.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </td>
      </tr>

      {/* Desktop Layout */}
      <tr className="hidden md:table-row border-b border-gray-200 last:border-b-0">
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
                  className="mt-1 text-[11px] leading-none text-gray-700 text-center"
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
                  className="mt-1 text-[11px] leading-none text-gray-700 text-center"
                >
                  {o.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </td>
      </tr>
    </>
  )
}
