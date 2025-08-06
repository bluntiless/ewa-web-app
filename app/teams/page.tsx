"use client"

import React from 'react';
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users, MessageCircle, Video, Settings, Search, Send, Phone, Mail, MapPin, Clock, LogOut, LogIn } from 'lucide-react'
import BottomNavigation from "../../components/BottomNavigation"
import { useMsalAuth } from "../../hooks/useMsalAuth"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  status: "online" | "offline" | "away"
  email: string
  phone?: string
  location?: string
  lastSeen?: string
}

interface StudyGroup {
  id: string
  name: string
  description: string
  members: number
  lastActivity: string
  subject: string
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar?: string
}

const TeamsPage: React.FC = () => {
  const { account, loading, error: msalError, login, logout } = useMsalAuth()
  const [activeTab, setActiveTab] = useState<"teams" | "groups" | "messages">("teams")
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")

  // Mock data for teams and groups
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Lead Assessor",
      status: "online",
      email: "sarah.johnson@company.com",
      phone: "+44 123 456 7890",
      location: "London, UK",
      lastSeen: "Active now",
    },
    {
      id: "2",
      name: "Mike Chen",
      role: "Senior Assessor",
      status: "away",
      email: "mike.chen@company.com",
      phone: "+44 123 456 7891",
      location: "Manchester, UK",
      lastSeen: "5 minutes ago",
    },
    {
      id: "3",
      name: "Emma Wilson",
      role: "Assessor",
      status: "offline",
      email: "emma.wilson@company.com",
      location: "Birmingham, UK",
      lastSeen: "2 hours ago",
    },
    {
      id: "4",
      name: "David Brown",
      role: "Training Coordinator",
      status: "online",
      email: "david.brown@company.com",
      phone: "+44 123 456 7892",
      location: "Leeds, UK",
      lastSeen: "Active now",
    },
  ])

  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: "1",
      name: "EWA Level 3 Study Group",
      description: "Collaborative learning for EWA Level 3 qualification",
      members: 12,
      lastActivity: "2 hours ago",
      subject: "Electrical Installation",
    },
    {
      id: "2",
      name: "NVQ 1605 Discussion",
      description: "Q&A and support for NVQ 1605 candidates",
      members: 8,
      lastActivity: "1 day ago",
      subject: "Electrical Maintenance",
    },
    {
      id: "3",
      name: "Assessment Preparation",
      description: "Tips and resources for upcoming assessments",
      members: 15,
      lastActivity: "3 hours ago",
      subject: "General",
    },
  ])

  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "Sarah Johnson",
      content: "Good morning everyone! Don't forget about the assessment review meeting at 2 PM today.",
      timestamp: "09:30 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      sender: "Mike Chen",
      content: "I've uploaded the new assessment criteria documents to the shared folder.",
      timestamp: "10:15 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      sender: "Emma Wilson",
      content: "Can someone help me with the NETP3-04 unit assessment? I have a few questions.",
      timestamp: "11:20 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredGroups = studyGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading Teams...</p>
        </div>
      </div>
    )
  }

  if (msalError) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-red-500 text-xl mb-4">Authentication Error</div>
          <p className="text-gray-400 mb-4">{String(msalError)}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <Users className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Welcome to Teams</h1>
          <p className="text-gray-400 mb-8">
            Connect with your assessors, join study groups, and collaborate with fellow candidates.
          </p>
          <Button onClick={login} className="bg-blue-600 hover:bg-blue-700">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In with Microsoft
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teams</h1>
            <p className="text-gray-400">Connect and collaborate with your learning community</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Signed in as {account.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search teams, groups, or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-neutral-900 border-neutral-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === "teams" ? "default" : "outline"}
            onClick={() => setActiveTab("teams")}
            className={
              activeTab === "teams"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }
          >
            <Users className="w-4 h-4 mr-2" />
            Team Members ({filteredMembers.length})
          </Button>
          <Button
            variant={activeTab === "groups" ? "default" : "outline"}
            onClick={() => setActiveTab("groups")}
            className={
              activeTab === "groups"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Study Groups ({filteredGroups.length})
          </Button>
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            onClick={() => setActiveTab("messages")}
            className={
              activeTab === "messages"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages ({messages.length})
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "teams" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900 ${getStatusColor(member.status)}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{member.name}</h3>
                      <p className="text-sm text-gray-400">{member.role}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {member.lastSeen}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center text-sm text-gray-400">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.location && (
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{member.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent"
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "groups" && (
          <div className="space-y-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{group.name}</CardTitle>
                      <p className="text-gray-400 mt-1">{group.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {group.subject}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {group.members} members
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {group.lastActivity}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Join Group
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Team Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-white text-sm">{message.sender}</span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-neutral-800 border-neutral-700 text-white placeholder-gray-400 resize-none"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}

export default TeamsPage;
