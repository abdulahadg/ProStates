import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Wifi, 
  CreditCard, 
  Lock, 
  Trash2, 
  ExternalLink, 
  MessageSquare, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { Booking } from '../types';

interface MyTripsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onClose: () => void;
}

export default function MyTrips({ bookings, onCancelBooking, onClose }: MyTripsProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelConfirmId, setShowCancelConfirmId] = useState<string | null>(null);
  const [userMessages, setUserMessages] = useState<{ [id: string]: string[] }>({});
  const [messageInput, setMessageInput] = useState('');

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'active';
    if (activeTab === 'past') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  const handleSendMessage = (bookingId: string) => {
    if (!messageInput.trim()) return;
    setUserMessages(prev => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), messageInput.trim()]
    }));
    setMessageInput('');

    // Trigger synthetic friendly response from host
    setTimeout(() => {
      setUserMessages(prev => ({
        ...prev,
        [bookingId]: [
          ...(prev[bookingId] || []),
          "Hi! Thank you for the message. I have updated your special guest requests on our itinerary list. Let me know if you need anything else before check-in!"
        ]
      }));
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-900 dark:text-white text-left">
      
      {/* Return Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 select-none">
        <div className="text-left">
          <span className="text-xs uppercase font-black tracking-widest text-[#FF385C] block">Guest Center Dashboard</span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">My Booked Trips</h1>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          ← Explore homes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Selector & list of trips */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          {/* Internal subtab navigation with gorgeous styling */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 pb-px gap-6 text-sm font-black select-none">
            <button 
              onClick={() => { setActiveTab('upcoming'); setSelectedBooking(null); }}
              className={`pb-4 border-b-2 transition-all cursor-pointer ${activeTab === 'upcoming' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Upcoming Trips
              {bookings.filter(b => b.status === 'active').length > 0 && (
                <span className="ml-2 bg-[#FF385C] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {bookings.filter(b => b.status === 'active').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => { setActiveTab('past'); setSelectedBooking(null); }}
              className={`pb-4 border-b-2 transition-all cursor-pointer ${activeTab === 'past' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Past stays
            </button>
            <button 
              onClick={() => { setActiveTab('cancelled'); setSelectedBooking(null); }}
              className={`pb-4 border-b-2 transition-all cursor-pointer ${activeTab === 'cancelled' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Cancelled
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Compass className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                No bookings located on this category tab. Go explore listing pages to reserve your dream stay!
              </p>
              <button
                onClick={onClose}
                className="bg-[#FF385C] text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-[#e62e50] transition-colors"
              >
                Start searching listings
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div 
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row gap-5 hover:border-slate-350 dark:hover:border-slate-750 ${selectedBooking?.id === b.id ? 'ring-2 ring-[#FF385C] border-transparent' : 'border-gray-200 dark:border-gray-800'}`}
                >
                  <img 
                    src={b.listingImage} 
                    alt={b.listingTitle} 
                    className="w-full md:w-32 h-24 object-cover rounded-xl shrink-0" 
                  />
                  <div className="flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-black text-rose-500 tracking-wider">CODE: {b.id.substring(0, 8).toUpperCase()}</span>
                        {b.status === 'active' && (
                          <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-black border border-emerald-200/50 uppercase tracking-widest flex items-center gap-1">
                            ● Confirmed Stay
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[9px] px-2 py-0.5 rounded-full font-black border border-rose-200/50 uppercase tracking-widest">
                            Refund Completed
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm md:text-base text-slate-950 dark:text-white mt-1 leading-snug line-clamp-1">{b.listingTitle}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{b.listingLocation}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/60 mt-2 gap-2">
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#FF385C]" />
                          <span>Stay period: 4 nights</span>
                        </div>
                        <div>
                          <span>Guests: <b className="text-slate-900 dark:text-white">{b.guestsCount}</b></span>
                        </div>
                      </div>
                      
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        Paid <span className="text-[#FF385C]">${b.totalPaid}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Detailed trip card & Action dashboard */}
        <div className="lg:col-span-12 xl:col-span-5">
          {selectedBooking ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6 text-left animate-slide-up">
              
              <div className="text-left select-none relative pb-4 border-b border-gray-100 dark:border-gray-800">
                <span className="text-[10px] uppercase font-black text-[#FF385C] tracking-widest block">Detailed Itinerary Receipt</span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white tracking-tight mt-1">Your reservation coordinates</h3>
              </div>

              {/* Secure Lock & Gate Access */}
              {selectedBooking.status === 'active' && (
                <div className="bg-gradient-to-tr from-slate-950 to-slate-900 p-4.5 rounded-2xl border border-slate-800 shadow-lg text-white space-y-3.5 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF385C]/10 rounded-full blur-xl" />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-black tracking-widest text-[#FF385C]">Security Gate Access code</span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Unlocks 24h prior</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400">Numeric PIN gate trigger</span>
                      <span className="text-2xl font-black text-[#FF385C] font-mono tracking-widest">{selectedBooking.checkInCode}</span>
                    </div>
                    <Lock className="w-6 h-6 text-emerald-400 animate-pulse shrink-0" />
                  </div>

                  <div className="border-t border-slate-800/80 pt-2.5 text-[10.5px] text-gray-300 font-medium leading-relaxed">
                    <p className="flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-rose-500" />
                      <span>Wifi SSID: <b className="text-white">StayPremium-5G</b></span>
                    </p>
                    <p className="mt-1">Password: <b className="text-white">prostates-relax-2026</b></p>
                  </div>
                </div>
              )}

              {/* Booking Cost Breakdown */}
              <div className="space-y-3.5">
                <h4 className="text-xs uppercase font-black text-slate-950 dark:text-white tracking-wider">Transaction Summary</h4>
                <div className="text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 border border-gray-200 dark:border-slate-800 font-medium">
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Accommodations ticket price:</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">${selectedBooking.totalPaid - 85 - 45}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Cleaning & sanitizing:</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">$45</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>AirCover protection premium:</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">$85</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-2.5 flex justify-between items-center text-sm font-black text-slate-950 dark:text-white">
                    <span>Grand Total Invoice Paid:</span>
                    <span className="text-[#FF385C] font-extrabold">${selectedBooking.totalPaid}</span>
                  </div>
                </div>
              </div>

              {/* Message to Host Console */}
              {selectedBooking.status === 'active' && (
                <div className="space-y-3.5 border-t border-gray-100 dark:border-gray-800 pt-5">
                  <h4 className="text-xs uppercase font-black text-slate-950 dark:text-white tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                    <span>Host Assistance Console</span>
                  </h4>
                  
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl max-h-40 overflow-y-auto space-y-2 text-xs border border-gray-200 dark:border-slate-800">
                    <div className="text-left bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-gray-100 dark:border-slate-800 font-medium">
                      <span className="text-[9px] uppercase font-black text-[#FF385C] block">Host Greetings</span>
                      Welcome aboard! Standard check-in instructions are ready. Tap below if you have custom requests.
                    </div>

                    {(userMessages[selectedBooking.id] || []).map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-lg font-medium text-left ${idx % 2 === 0 ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 self-end ml-4' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800'}`}
                      >
                        {msg}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Message host for special assistance..."
                      className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white text-xs font-bold p-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:border-[#FF385C] outline-none"
                    />
                    <button 
                      onClick={() => handleSendMessage(selectedBooking.id)}
                      className="bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Operations: Cancel Booking */}
              {selectedBooking.status === 'active' && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  {showCancelConfirmId === selectedBooking.id ? (
                    <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 rounded-xl space-y-3">
                      <p className="text-xs font-black text-rose-600 dark:text-rose-400">
                        Confirm cancellation? The trip will be cancelled and a full refund will be processed back to your payment method automatically.
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            onCancelBooking(selectedBooking.id);
                            setSelectedBooking(null);
                            setShowCancelConfirmId(null);
                          }}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all flex-1 cursor-pointer"
                        >
                          Confirm cancel stay
                        </button>
                        <button 
                          onClick={() => setShowCancelConfirmId(null)}
                          className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowCancelConfirmId(selectedBooking.id)}
                      className="w-full bg-slate-50 hover:bg-rose-50 dark:bg-slate-950 dark:hover:bg-rose-950/20 text-rose-500 font-extrabold text-xs py-3.5 border border-dashed border-rose-200 dark:border-rose-900/40 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Cancel Stay & Request Refund</span>
                    </button>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3.5 h-[500px] flex flex-col items-center justify-center">
              <Compass className="w-10 h-10 text-gray-400 stroke-[1.5]" />
              <div className="text-center font-bold">
                <span className="block text-xs uppercase font-black text-[#FF385C] tracking-widest">Live Itinerary Terminal</span>
                <span className="text-sm font-black text-slate-950 dark:text-white block mt-1">Select a booked stay to verify details</span>
              </div>
              <p className="text-xs text-gray-400 font-medium max-w-xs leading-relaxed">
                Click any of your stays in the upcoming or history listing on the left to verify door gate-codes, Wi-Fi keys, print invoices, and update host messages.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
