"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SkillRatingGroupProps {
  category: {
    id: string
    name: string
    skills: { id: string; name: string; rating: string | null }[]
  }
  onRatingChange: (categoryId: string, skillId: string, value: string) => void
}

export function SkillRatingGroup({ category, onRatingChange }: SkillRatingGroupProps) {
  const options = [
    { value: "limited", label: "Limited" },
    { value: "adequate", label: "Adequate" },
    { value: "extensive", label: "Extensive" },
    { value: "unsure", label: "Unsure" },
    { value: "highly-skilled", label: "Highly Skilled" },
  ]

  return (
    <div className="border-b pb-4 last:border-b-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{category.name}</h3>
      <div className="space-y-4">
        {category.skills.map((skill) => (
          <div key={skill.id}>
            <p className="text-gray-700 mb-2">{skill.name}</p>
            <RadioGroup
              onValueChange={(value) => onRatingChange(category.id, skill.id, value)}
              value={skill.rating || ""}
              className="flex flex-wrap gap-4"
            >
              {options.map((option) => (
                <div key={`${skill.id}-${option.value}`} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${skill.id}-${option.value}`} />
                  <Label htmlFor={`${skill.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  )
}
