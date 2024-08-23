'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, MapPin, Calendar, MessageCircle, Send, Menu, X, Coffee, BookOpen } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Bot } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })

export default function Component() {
  const [chatMessages, setChatMessages] = useState([
    { text: "Welcome to TravelJournal! How can I assist you with your travel plans today?", isUser: false },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const sendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const newUserMessage = { text: inputMessage, isUser: true };
      setChatMessages(prev => [...prev, newUserMessage]);
      setInputMessage("");

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              { role: 'user', content: 'Hello, I need help with travel planning.' },
              ...chatMessages.map(msg => ({
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.text
              })),
              { role: 'user', content: inputMessage }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setChatMessages(prev => [...prev, { text: data.reply, isUser: false }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setChatMessages(prev => [...prev, { text: "Sorry, there was an error processing your request.", isUser: false }]);
      }
    }
  }

  return (
    <div className={`min-h-screen bg-[#f5e6d3] flex flex-col ${playfair.className}`}>
      <nav className="p-4 flex justify-between items-center border-b border-[#d2b48c]">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-2">
            {isSidebarOpen ? <X className="h-6 w-6 text-[#4a3728]" /> : <Menu className="h-6 w-6 text-[#4a3728]" />}
          </Button>
          <h1 className="text-2xl font-bold text-[#4a3728] flex items-center">
            <BookOpen className="h-6 w-6 mr-2" /> TravelJournal
          </h1>
        </div>
        <div className="flex space-x-4">
          <Button variant="ghost" className="text-[#4a3728]">Memories</Button>
          <Button variant="ghost" className="text-[#4a3728]">Itineraries</Button>
          <Button variant="ghost" className="text-[#4a3728]">Profile</Button>
        </div>
      </nav>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Sidebar */}
        <div className={`bg-[#e6d2b5] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
          <Card className="h-full rounded-none border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#4a3728]">Travel Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Plane className="text-[#4a3728] flex-shrink-0" />
                  <Input placeholder="Dream destination" className="bg-[#f5e6d3] border-[#4a3728]" />
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-[#4a3728] flex-shrink-0" />
                  <Input placeholder="Starting point" className="bg-[#f5e6d3] border-[#4a3728]" />
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-[#4a3728] flex-shrink-0" />
                  <Input type="date" placeholder="Journey dates" className="bg-[#f5e6d3] border-[#4a3728]" />
                </div>
                <Button className="w-full bg-[#4a3728] text-[#f5e6d3] hover:bg-[#6b5a47]">Plan Adventure</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden flex flex-col bg-[#f5e6d3] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#4a3728] flex items-center">
                <Coffee className="h-6 w-6 mr-2" /> Travel Companion
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4" style={{ backgroundImage: "linear-gradient(to bottom, #f5e6d3 0%, #f5e6d3 100%), repeating-linear-gradient(#f5e6d3, #f5e6d3 28px, #e6d2b5 28px, #e6d2b5 29px)" }}>
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start ${message.isUser ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback className={message.isUser ? "bg-[#4a3728]" : "bg-[#d2b48c]"}>
                          {message.isUser ? (
                            <User className="h-4 w-4 text-[#f5e6d3]" />
                          ) : (
                            <Bot className="h-4 w-4 text-[#4a3728]" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-3 max-w-[80%] ${message.isUser ? 'bg-[#4a3728] text-[#f5e6d3]' : 'bg-[#d2b48c] text-[#4a3728]'}`}>
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Jot down your thoughts..." 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="bg-[#f5e6d3] border-[#4a3728]"
                />
                <Button onClick={sendMessage} className="bg-[#4a3728] text-[#f5e6d3] hover:bg-[#6b5a47]">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}