import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Evidence } from "@/models/Evidence"

interface PendingEvidenceViewProps {
  evidence: Evidence[]
  onViewDetails: (evidenceId: string) => void
}

export function PendingEvidenceView({ evidence, onViewDetails }: PendingEvidenceViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Pending Evidence</CardTitle>
      </CardHeader>
      <CardContent>
        {evidence.length === 0 ? (
          <p className="text-center text-gray-500">No pending evidence to review.</p>
        ) : (
          <div className="grid gap-4">
            {evidence.map((item) => (
              <Card key={item.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-grow space-y-1 mb-3 md:mb-0">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    Unit: {item.unitId} - Criterion: {item.criterionId}
                  </p>
                  <p className="text-sm text-gray-600">Uploaded by: {item.uploadedBy}</p>
                  <p className="text-sm text-gray-600">On: {item.uploadDate}</p>
                </div>
                <div className="flex flex-col items-start md:items-end space-y-2 md:space-y-0 md:space-x-4 md:flex-row">
                  <Badge variant="secondary" className="px-3 py-1 text-md">
                    {item.status}
                  </Badge>
                  <Button onClick={() => onViewDetails(item.id)} size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
