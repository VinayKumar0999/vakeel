"use client"
import React, { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MessageCircle, FileText, Upload, Settings, Maximize, Volume2, VolumeX, MoreVertical, Download, X, Send, Minimize } from 'lucide-react';

export default function VideoConsultationRoom() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showDocuments, setShowDocuments] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const consultation = {
    lawyer: {
      name: "Adv. Rajesh Kumar",
      photo: "👨‍⚖️",
      expertise: "Corporate & Property Law"
    },
    client: {
      name: "Amit Sharma",
      photo: "👤"
    },
    duration: 30,
    timeElapsed: 12,
    scheduledEnd: "04:30 PM"
  };

  const chatMessages = [
    { id: 1, sender: 'client', name: 'You', message: 'Hello, thank you for joining!', time: '04:01 PM' },
    { id: 2, sender: 'lawyer', name: 'Adv. Rajesh Kumar', message: 'Good afternoon! How can I help you today?', time: '04:01 PM' },
    { id: 3, sender: 'client', name: 'You', message: 'I need advice on a property purchase agreement.', time: '04:02 PM' },
    { id: 4, sender: 'lawyer', name: 'Adv. Rajesh Kumar', message: 'Sure, please share the document and I\'ll review it with you.', time: '04:03 PM' }
  ];

  const documents = [
    { id: 1, name: 'Property_Agreement.pdf', size: '2.4 MB', uploadedBy: 'client' },
    { id: 2, name: 'Legal_Checklist.pdf', size: '890 KB', uploadedBy: 'lawyer' }
  ];

  const formatTime = (minutes:any) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = consultation.duration - consultation.timeElapsed;

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xl">
                {consultation.lawyer.photo}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{consultation.lawyer.name}</div>
                <div className="text-slate-400 text-xs">{consultation.lawyer.expertise}</div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Live Consultation</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-slate-400 text-xs">Time Elapsed</div>
                <div className="text-white font-mono font-semibold">{formatTime(consultation.timeElapsed)}</div>
              </div>
              <div className="h-8 w-px bg-slate-700"></div>
              <div className="text-right">
                <div className="text-slate-400 text-xs">Time Remaining</div>
                <div className={`font-mono font-semibold ${timeRemaining < 5 ? 'text-red-400' : 'text-green-400'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Lawyer Video (Main) */}
          <div className="absolute inset-0 bg-slate-800">
            <div className="w-full h-full flex items-center justify-center">
              {isVideoOn ? (
                <div className="relative w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <div className="text-9xl">{consultation.lawyer.photo}</div>
                  <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="text-white font-medium">{consultation.lawyer.name}</div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center">
                  <VideoOff className="w-20 h-20 mx-auto mb-4" />
                  <div className="text-lg">Video is turned off</div>
                </div>
              )}
            </div>
          </div>

          {/* Client Video (PIP) */}
          <div className="absolute top-6 right-6 w-64 h-48 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="text-6xl">{consultation.client.photo}</div>
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                <div className="text-white text-sm font-medium">You</div>
              </div>
              {!isVideoOn && (
                <div className="absolute top-2 right-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <VideoOff className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Screen Share Indicator */}
          {isScreenSharing && (
            <div className="absolute top-6 left-6 bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
              <Monitor className="w-5 h-5 text-white" />
              <span className="text-white font-medium text-sm">Screen Sharing Active</span>
            </div>
          )}
        </div>

        {/* Right Sidebar - Chat & Documents */}
        {(showChat || showDocuments) && (
          <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => { setShowChat(true); setShowDocuments(false); }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  showChat ? 'text-white bg-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => { setShowChat(false); setShowDocuments(true); }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  showDocuments ? 'text-white bg-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Documents ({documents.length})
              </button>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${msg.sender === 'client' ? 'bg-blue-600' : 'bg-slate-700'} rounded-lg p-3`}>
                        <div className="text-xs text-slate-300 mb-1">{msg.name}</div>
                        <div className="text-white text-sm">{msg.message}</div>
                        <div className="text-xs text-slate-400 mt-1">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Documents Panel */}
            {showDocuments && (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">{doc.name}</div>
                            <div className="text-slate-400 text-xs mt-1">
                              {doc.size} • Uploaded by {doc.uploadedBy === 'client' ? 'You' : consultation.lawyer.name}
                            </div>
                          </div>
                          <button className="w-8 h-8 hover:bg-slate-500 rounded-lg flex items-center justify-center transition-colors">
                            <Download className="w-4 h-4 text-slate-300" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="p-4 border-t border-slate-700">
                  <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-medium">
                    <Upload className="w-5 h-5" />
                    Upload Document
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-slate-800 border-t border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isVideoOn
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isAudioOn
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors text-white"
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <div className="w-px h-8 bg-slate-700"></div>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`px-4 h-12 rounded-xl flex items-center gap-2 transition-all ${
                isScreenSharing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
              </span>
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors relative ${
                showChat ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-semibold">
                2
              </span>
            </button>

            {/* Documents Toggle */}
            <button
              onClick={() => setShowDocuments(!showDocuments)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                showDocuments ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>

          {/* Center - End Call */}
          <button className="px-8 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 transition-colors font-semibold shadow-lg">
            <PhoneOff className="w-5 h-5" />
            End Consultation
          </button>

          {/* Right - More Options */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors text-white"
            >
              {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            <button className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors text-white">
              <Settings className="w-5 h-5" />
            </button>

            <button className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Connection Quality Indicator */}
      <div className="absolute top-20 left-6">
        <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-green-500 rounded-full"></div>
            <div className="w-1 h-4 bg-green-500 rounded-full"></div>
            <div className="w-1 h-5 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-white text-xs font-medium">Excellent Connection</span>
        </div>
      </div>
    </div>
  );
}