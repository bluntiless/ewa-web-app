import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface QualificationProgress {
  name: string
  completedUnits: number
  totalUnits: number
  progress: number
}

interface ProgressViewProps {
  qualifications: QualificationProgress[]
}

export function ProgressView({ qualifications }: ProgressViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">My Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {qualifications.length === 0 ? (
          <p className="text-center text-gray-500">No qualifications to display progress for.</p>
        ) : (
          qualifications.map((q, index) => (
            <div key={q.name}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">{q.name}</h3>
                <span className="text-sm text-gray-600">
                  {q.completedUnits}/{q.totalUnits} Units
                </span>
              </div>
              <Progress value={q.progress} className="w-full" />
              <p className="text-right text-sm text-gray-500 mt-1">{q.progress.toFixed(0)}% Complete</p>
              {index < qualifications.length - 1 && <Separator className="my-4" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
