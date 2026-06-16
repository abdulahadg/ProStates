import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  CheckCheck, 
  Info, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft,
  Filter
} from 'lucide-react';
import { Booking, Listing } from '../types';

interface HostInboxProps {
  onClose: () => void;
  bookings: Booking[];
  allListings: Listing[];
}

interface ChatThread {
  id: string;
  hostName: string;
  hostAvatar: string;
  listingTitle: string;
  listingLocation: string;
  bookingStatus: 'active' | 'completed' | 'cancelled' | 'none';
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Array<{
    id: string;
    sender: 'user' | 'host';
    text: string;
    time: string;
  }>;
}

export default function HostInbox({ onClose, bookings, allListings }: HostInboxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThreadId, setActiveThreadId] = useState<string>('t-1');
  const [messageInput, setMessageInput] = useState('');
  const [typingHostId, setTypingHostId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize simulated conversations based on listings or active bookings
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const list: ChatThread[] = [];

    // Thread 1: Always include a dynamic thread linked to active bookings if there is one
    const activeBooking = bookings.find(b => b.status === 'active');
    if (activeBooking) {
      list.push({
        id: 't-booking',
        hostName: "Your Host (" + activeBooking.listingTitle.split(' ')[0] + ")",
        hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=" + activeBooking.id,
        listingTitle: activeBooking.listingTitle,
        listingLocation: activeBooking.listingLocation,
        bookingStatus: 'active',
        lastMessage: "Hi there! I am excited to receive you. Your check-in gate code is generated.",
        lastMessageTime: "10:12 AM",
        unread: true,
        messages: [
          { id: 'm1', sender: 'host', text: "Hello traveler! Thank you for booking with us. I want to confirm your arrival plans.", time: "Yesterday" },
          { id: 'm2', sender: 'user', text: "Thank you! I will arrive around 3 PM on my check-in date.", time: "Yesterday" },
          { id: 'm3', sender: 'host', text: "Hi there! I am excited to receive you. Your check-in gate code is generated.", time: "10:12 AM" }
        ]
      });
    }

    // Thread 2: Malibu beachfront host Katelyn
    list.push({
      id: 't-1',
      hostName: "Katelyn (Superhost)",
      hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Katelyn",
      listingTitle: "Malibu Oceanfront Glasshouse",
      listingLocation: "Malibu, California",
      bookingStatus: 'none',
      lastMessage: "The sunset is stunning tonight. Let me know if you would like me to lock down dates for next month!",
      lastMessageTime: "Yesterday",
      unread: false,
      messages: [
        { id: 'mk1', sender: 'user', text: "Hi Katelyn, is the master deck pool heated during winter months?", time: "Monday" },
        { id: 'mk2', sender: 'host', text: "Yes! We maintain the glasshouse infinity pool at a cozy 82°F year-round for guests.", time: "Monday" },
        { id: 'mk3', sender: 'host', text: "The sunset is stunning tonight. Let me know if you would like me to lock down dates for next month!", time: "Yesterday" }
      ]
    });

    // Thread 3: Alpine host Jean-Pierre
    list.push({
      id: 't-2',
      hostName: "Jean-Pierre",
      hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=JeanPierre",
      listingTitle: "Chamonix Alpine A-Frame",
      listingLocation: "Chamonix, France",
      bookingStatus: 'none',
      lastMessage: "Je vous en prie! The ski resort pass coordinates have been updated.",
      lastMessageTime: "Jun 11",
      unread: false,
      messages: [
        { id: 'mj1', sender: 'user', text: "Bonjour Jean-Pierre, can we rent ski equipment on site?", time: "Jun 10" },
        { id: 'mj2', sender: 'host', text: "Absolutely! There is a certified pro-shop right next to our cedar chalet cabin entrance.", time: "Jun 11" },
        { id: 'mj3', sender: 'host', text: "Je vous en prie! The ski resort pass coordinates have been updated.", time: "Jun 11" }
      ]
    });

    // Thread 4: Bali host Wayan
    list.push({
      id: 't-3',
      hostName: "Wayan",
      hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Wayan",
      listingTitle: "Bali Canopy Bamboo Nest",
      listingLocation: "Ubud, Bali",
      bookingStatus: 'none',
      lastMessage: "I would love to arrange a traditional organic dinner for you on arrival.",
      lastMessageTime: "May 28",
      unread: false,
      messages: [
        { id: 'mw1', sender: 'host', text: "Om Swastyastu! Welcome to our sacred bamboo forest sanctuary.", time: "May 27" },
        { id: 'mw2', sender: 'user', text: "Wow, it looks breathtaking. Do you supply scooter rentals?", time: "May 28" },
        { id: 'mw3', sender: 'host', text: "I would love to arrange a traditional organic dinner for you on arrival.", time: "May 28" }
      ]
    });

    return list;
  });

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages, typingHostId]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const userText = messageInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to active thread
    setThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastMessage: userText,
          lastMessageTime: timeNow,
          unread: false,
          messages: [
            ...t.messages,
            { id: 'mu' + Math.random(), sender: 'user', text: userText, time: timeNow }
          ]
        };
      }
      return t;
    }));

    setMessageInput('');
    setTypingHostId(activeThread.id);

    // Simulate smart, contextual host response
    setTimeout(() => {
      let hostReply = "Thanks for your note! I have taken down your travel coordinates. I am fully committed to delivering a green, pristine premium stay.";
      const lower = userText.toLowerCase();

      if (lower.includes('price') || lower.includes('discount') || lower.includes('cheap')) {
        hostReply = "I maintain high-grade linen, deep organic cleanings, and premium support, but let me check if we have off-season stay promos unlocked for those dates.";
      } else if (lower.includes('key') || lower.includes('code') || lower.includes('gate') || lower.includes('checkin')) {
        hostReply = "Standard lockbox directions and keypad check-in PIN keys are unlocked automatically inside the My Trips guest dashboard 24 hours prior to travel!";
      } else if (lower.includes('wifi') || lower.includes('internet') || lower.includes('work')) {
        hostReply = "Yes! High-speed 5G internet is installed. Average speeds run at 150+ Mbps down, suitable for video calls and remote workspace tasks.";
      } else if (lower.includes('pet') || lower.includes('dog') || lower.includes('cat')) {
        hostReply = "We strictly check individual allergy listings, but please send details about your service companion, and we can make custom exceptions!";
      }

      setThreads(prev => prev.map(t => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            lastMessage: hostReply,
            lastMessageTime: timeNow,
            messages: [
              ...t.messages,
              { id: 'mh' + Math.random(), sender: 'host', text: hostReply, time: timeNow }
            ]
          };
        }
        return t;
      }));
      setTypingHostId(null);
    }, 1800);
  };

  const filteredThreads = threads.filter(t => 
    t.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-900 dark:text-white text-left">
      
      {/* Return Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 select-none">
        <div className="text-left">
          <span className="text-xs uppercase font-black tracking-widest text-[#FF385C] block">Host Communication Hub</span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">Guest Messages Inbox</h1>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          ← Return to stays
        </button>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-0 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-slate-950 h-[640px] md:h-[640px]">
        
        {/* Left column - Threads list */}
        <div className="h-[200px] md:h-full md:col-span-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col bg-slate-50/50 dark:bg-slate-950">
          
          {/* Threads search */}
          <div className="p-4 border-b border-gray-250/60 dark:border-gray-800 space-y-3 select-none">
            <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-1 flex items-center rounded-xl">
              <Search className="w-4 h-4 text-gray-400 ml-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search inbox..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-2.5 pr-2 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Threads Roster */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 font-bold select-none">
                No messaging threads located.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isActive = thread.id === activeThread.id;
                return (
                  <div 
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      // Clear unread mark
                      setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: false } : t));
                    }}
                    className={`p-4 transition-all cursor-pointer border-b border-gray-100 dark:border-gray-900 flex gap-3 text-left relative ${isActive ? 'bg-white dark:bg-slate-900 border-l-4 border-l-[#FF385C]' : 'hover:bg-gray-100/50 dark:hover:bg-slate-900/30'}`}
                  >
                    <div className="relative shrink-0 select-none">
                      <img 
                        src={thread.hostAvatar} 
                        alt={thread.hostName} 
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 bg-rose-50" 
                      />
                      {thread.unread && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-[#FF385C] border-2 border-slate-50 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-extrabold text-xs text-slate-950 dark:text-white truncate">{thread.hostName}</h4>
                        <span className="text-[9px] text-gray-400 font-bold">{thread.lastMessageTime}</span>
                      </div>
                      
                      <p className="text-[10px] uppercase font-bold text-[#FF385C] truncate mt-0.5">{thread.listingTitle}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 truncate line-clamp-1 font-medium">{thread.unread ? <b>{thread.lastMessage}</b> : thread.lastMessage}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column - Message dialogue viewport */}
        <div className="flex-1 md:h-full md:col-span-8 flex flex-col bg-white dark:bg-slate-900 text-left">
          
          {/* Active Thread metadata header */}
          <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <img 
                src={activeThread.hostAvatar} 
                alt={activeThread.hostName} 
                className="w-10 h-10 rounded-full bg-rose-50 object-cover" 
              />
              <div className="text-left">
                <h3 className="font-extrabold text-sm text-slate-950 dark:text-white flex items-center gap-1.5 leading-none">
                  <span>{activeThread.hostName}</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF385C]" />
                  <span>{activeThread.listingLocation}</span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 px-3.5 py-2 rounded-xl text-right text-[10px] max-w-xs border border-gray-200 dark:border-slate-800">
              <span className="block font-black text-rose-500 font-mono uppercase">Stay Coordination details</span>
              <span className="block font-bold mt-0.5 text-slate-700 dark:text-gray-300 truncate">{activeThread.listingTitle}</span>
            </div>
          </div>

          {/* Dialogue list view area */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4.5 bg-slate-50/50 dark:bg-slate-950/30">
            {activeThread.messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex gap-3 max-w-[80%] ${isUser ? 'ml-auto text-right flex-row-reverse' : 'mr-auto text-left'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs select-none shrink-0 ${isUser ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-rose-50 text-[#FF385C] border border-rose-100'}`}>
                    {isUser ? <User className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className={`p-3.5 rounded-2.5xl text-xs font-bold leading-relaxed whitespace-pre-line ${isUser ? 'bg-[#FF385C] text-white rounded-tr-sm' : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-slate-950 dark:text-white rounded-tl-sm shadow-sm'}`}>
                      {m.text}
                    </div>
                    <span className="text-[8px] text-gray-400 font-semibold px-1 block mt-1">{m.time}</span>
                  </div>
                </div>
              );
            })}

            {typingHostId === activeThread.id && (
              <div className="flex gap-3 mr-auto max-w-[80%] text-left">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-3 rounded-2xl flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#FF385C] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#FF385C] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#FF385C] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Type dialogue box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900/80 flex items-center gap-2.5">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type message directly to your Superhost..."
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-950 dark:text-white outline-none focus:ring-1 focus:ring-[#FF385C]/30 focus:border-[#FF385C] transition-all"
            />
            <button
              type="submit"
              className="p-3 bg-[#FF385C] hover:bg-[#e62e50] text-white rounded-xl font-bold hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
