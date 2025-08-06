"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useMsalAuth } from "@/hooks/useMsalAuth"
import { getQualificationStats } from "@/data/units"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { account, loading, login, logout } = useMsalAuth()

  const ewaStats = getQualificationStats("EWA")
  const nvqStats = getQualificationStats("NVQ")

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to EWA Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="text-gray-600">Checking authentication status...</p>
              </div>
            ) : account ? (
              <>
                <p className="text-lg font-semibold">Hello, {account.name || account.username}!</p>
                <Button onClick={logout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">Please log in to get started.</p>
                <Button onClick={login}>Login with Microsoft</Button>
              </>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Your Qualifications Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold text-lg mb-2">EWA Qualification</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {ewaStats.completedUnits} of {ewaStats.totalUnits} units completed
                </p>
                <Progress value={ewaStats.progressPercentage} className="w-full" />
                <p className="text-right text-sm text-gray-500 mt-1">
                  {ewaStats.progressPercentage.toFixed(0)}% Complete
                </p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold text-lg mb-2">NVQ Qualification</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {nvqStats.completedUnits} of {nvqStats.totalUnits} units completed
                </p>
                <Progress value={nvqStats.progressPercentage} className="w-full" />
                <p className="text-right text-sm text-gray-500 mt-1">
                  {nvqStats.progressPercentage.toFixed(0)}% Complete
                </p>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/portfolio" passHref>
                <Button className="w-full" variant="outline">
                  View My Portfolio
                </Button>
              </Link>
              <Link href="/units" passHref>
                <Button className="w-full" variant="outline">
                  Browse Units
                </Button>
              </Link>
              <Link href="/assessments" passHref>
                <Button className="w-full" variant="outline">
                  Check Assessments
                </Button>
              </Link>
              <Link href="/assessor-review" passHref>
                <Button className="w-full" variant="outline">
                  Assessor Review
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
