import { useState, useRef, useEffect, FormEvent } from 'react';
import { Search, BookOpen, Heart, Shield, HelpCircle, ArrowRight, MessageSquare, Plus, Minus, User, Send, Check, AlertCircle } from 'lucide-react';

interface HelpCenterProps {
  onClose: () => void;
}

// Help Articles database
const helpArticles = [
  { id: 'refund', title: 'How to cancel my reservation & request a refund', category: 'guests', content: 'You can easily cancel any active reservation from your profile trips tab. Standard full refunds are subject to individual listing parameters. Free cancellations can be done up to 48 hours beforehand.' },
  { id: 'checkin', title: 'Finding your direct check-in coordinates & code keys', category: 'guests', content: 'Secure check-in code keys are automatically dispatched directly to your booking confirmation dashboard 24 hours before arrival. For smart-locks, enter the 6-digit pin code precisely.' },
  { id: 'damaged', title: 'Reporting damaged spaces under Host AirCover protection', category: 'hosts', content: 'Hosts are fully integrated with up to $3M in total damage protection. Simply access your host dashboard list, pick your listing, and file a photo claim report within 14 days of checkout.' },
  { id: 'payments', title: 'Why is my billing payment currency declining?', category: 'payments', content: 'Please ensure international travel transactions are permitted by your primary banking institution. Our platform secure system validates address details immediately.' },
  { id: 'listing', title: 'How can I list my home as a registered Host?', category: 'hosts', content: 'To list your space, switch over to our "Airbnb your home" guide. Set custom categories, upload 1 to 4 beautiful listing images, define prices, and instantly activate stay pins on the live map.' },
  { id: 'verification', title: 'The Guest Identity Verification safety policy guide', category: 'safety', content: 'To keep host properties secure, travelers undergo automated credential screening. Approved profiles receive an emerald verified badge next to their hosted names.' }
];

const faqs = [
  { q: "Is cancellation free on all listed properties?", a: "Most unique properties on our Travel Deck support free cancellations up to 48 hours in advance. Always review individual listings booking cards before confirming stay dates." },
  { q: "How do I become a Superhost guide?", a: "Superhost guides are selected based on sustained professional feedback. Maintain a 4.85+ global rating, zero cancellations, and an active response rate above 90%." },
  { q: "What should I do if a space is unclean upon arrival?", a: "Take clear photos immediately and contact your host. If they do not respond within 1 hour, file a support dispute ticket. AirCover will relocate you to an equivalent stay at no cost." },
  { q: "How are security payouts dispatched?", a: "Payouts are dispatched exactly 24 hours after a guest completes verified check-in. This safety buffer helps protect both clients and hosts." }
];

export default function HelpCenter({ onClose }: HelpCenterProps) {
  // Navigation & Search State
  const [activeCategory, setActiveCategory] = useState<'all' | 'guests' | 'hosts' | 'payments' | 'safety'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Accordion faq tracker
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Ticketing form
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketType, setTicketType] = useState('Booking Cancellation');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [ticketError, setTicketError] = useState('');

  // Live support assistant console state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    { sender: 'assistant', text: 'Hello! I am your Airbnb Travel Deck Assistant. How can I guide you today? Ask me about refunds, hosting setup, check-in keys, or security policies!', time: 'Live' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollChat = () => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollChat();
  }, [messages, botTyping]);

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTicketSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTicketError('');
    setTicketSuccess('');

    if (!ticketName || !ticketEmail || !ticketDescription) {
      setTicketError('Please provide all details for your support ticket.');
      return;
    }

    const verificationId = `TKT-${Math.floor(Math.random() * 80000) + 10000}`;
    setTicketSuccess(`Support Ticket filed successfully! Case reference: ${verificationId}. Our team has dispatched a secure copy to ${ticketEmail}.`);
    
    // Clear fields
    setTicketName('');
    setTicketEmail('');
    setTicketDescription('');
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
    setBotTyping(true);

    // AI bot simulated responses logic
    setTimeout(() => {
      let botResponse = "I have recorded your question. Our support team is checking the parameters. Feel free to draft a formal Support Ticket below to get an official agent assigned.";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('refund') || lower.includes('cancel')) {
        botResponse = "To cancel your booking: Open your details, locate the stay card, and choose 'Cancel Stay'. If within 48 hours, a refund will automatically write back to your account.";
      } else if (lower.includes('host') || lower.includes('home') || lower.includes('list')) {
        botResponse = "Becoming a Host is simple! Click the 'Airbnb your home' button in the head actions. You can use our monthly income calculator, compile your specifications, and publish instantly!";
      } else if (lower.includes('check') || lower.includes('key') || lower.includes('code')) {
        botResponse = "Your 6-digit secure check-in code is unlocked 24 hours prior to travel. Go to stay details to check smart-lock guides of active stays.";
      } else if (lower.includes('payment') || lower.includes('price') || lower.includes('card')) {
        botResponse = "Payment processing declines occur if regional travel triggers block online charges. Complete secure checkout inside our Booking Side-card panel.";
      } else if (lower.isPrototypeOf || lower.includes('unclean') || lower.includes('dirty') || lower.includes('problem')) {
        botResponse = "Take photo evidence and submit a Support Ticket right away using the form next to this screen. We will contact your host or activate full AirCover relocating.";
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setBotTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Back button and page Title */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6 mb-10 select-none">
        <div className="text-left">
          <span className="text-xs uppercase font-black tracking-widest text-[#FF385C] block">Safety & Knowledge first</span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">Help & Support Center</h1>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer select-none"
        >
          ← Return to stays
        </button>
      </div>

      {/* Hero Welcome banner with big Search Bar */}
      <div className="bg-gradient-to-r from-rose-50 to-[#FF385C]/10 dark:from-slate-950 dark:to-[#FF385C]/10 border border-rose-100/30 dark:border-slate-800 p-8 rounded-3xl text-center flex flex-col items-center justify-center space-y-5 mb-10 select-none">
        <h2 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white">Hello, how can we help you today?</h2>
        
        {/* Help Search bar */}
        <div className="relative w-full max-w-xl shadow-md rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-1 flex items-center">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles on cancellations, pricing, host setups..."
            className="w-full bg-transparent pl-3 pr-4 py-3 text-slate-950 dark:text-white font-bold placeholder-gray-400 dark:placeholder-gray-600 text-xs outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs bg-gray-100 dark:bg-slate-800 text-slate-950 dark:text-white px-2.5 py-1.5 rounded-lg mr-2 font-black transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid of contents & live support console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Articles list categorized */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-black tracking-tight select-none">Knowledge Articles Base</h2>
            
            {/* Horizontal Filter Categories */}
            <div className="flex flex-wrap gap-2 text-xs font-black select-none">
              {(['all', 'guests', 'hosts', 'payments', 'safety'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer capitalize ${activeCategory === cat ? 'bg-slate-950 border-slate-950 text-white dark:bg-white dark:border-white dark:text-slate-950' : 'bg-slate-50 border-gray-200 dark:bg-slate-900 dark:border-slate-800 text-gray-650 hover:bg-white'}`}
                >
                  {cat === 'all' ? 'All Guides' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Render knowledge list details */}
          <div className="space-y-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div 
                  key={article.id}
                  className="bg-slate-50/50 dark:bg-slate-900 border border-gray-200/85 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md transition-all space-y-2 text-left"
                >
                  <span className="text-[9px] font-black uppercase text-[#FF385C] tracking-widest bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-md border border-rose-100/10 inline-block">{article.category}</span>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">{article.title}</h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed">{article.content}</p>
                </div>
              ))
            ) : (
              <div className="bg-slate-100 dark:bg-slate-950 border border-dashed border-gray-250 p-10 rounded-2xl text-center select-none">
                <p className="text-xs font-extrabold text-gray-500">No matching search query found. Please try simple words (e.g., refund, key, verification).</p>
              </div>
            )}
          </div>

          {/* Frequently Asked Questions Accordion list */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-black tracking-tight select-none">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all bg-white dark:bg-slate-900"
                  >
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/40 dark:bg-slate-900 text-left font-black text-xs text-slate-950 dark:text-white cursor-pointer select-none"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <Minus className="w-4 h-4 shrink-0 text-slate-900 dark:text-slate-200 stroke-[2.5]" /> : <Plus className="w-4 h-4 shrink-0 text-slate-900 dark:text-slate-200 stroke-[2.5]" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900/60 text-xs font-bold text-gray-650 dark:text-gray-300 leading-relaxed text-left animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Interactive AI Assistant support bot & Ticket generator */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Interactive Live Support Chat Console widget */}
          <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl flex flex-col h-[420px] overflow-hidden">
            
            {/* Header info bar */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-2 text-left">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <div>
                  <h3 className="text-xs font-black">Travel Deck Assistant</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Automated client service live</p>
                </div>
              </div>
              <HelpCircle className="w-4.5 h-4.5 text-gray-300" />
            </div>

            {/* Chat message bubbles list */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4.5 bg-slate-50 dark:bg-slate-900/40 text-left">
              {messages.map((msg, i) => {
                const isBot = msg.sender === 'assistant';
                return (
                  <div key={i} className={`flex gap-2 max-w-[85%] ${isBot ? 'mr-auto text-left' : 'ml-auto text-right flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-slate-950 text-white dark:bg-slate-800' : 'bg-[#FF385C] text-white'}`}>
                      {isBot ? <HelpCircle className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={`p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-line ${isBot ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white border border-gray-200 dark:border-transparent' : 'bg-[#FF385C] text-white rounded-tr-sm'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-gray-400 font-semibold px-1 block mt-1">{msg.time}</span>
                    </div>
                  </div>
                );
              })}

              {botTyping && (
                <div className="flex gap-2 mr-auto max-w-[85%] text-left">
                  <div className="w-7 h-7 rounded-full bg-slate-950 text-white dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-slate-850 p-2.5 px-4 rounded-2xl border border-gray-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Send interface */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900/80 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about refunds or hosting..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-1 focus:ring-[#FF385C]/35 focus:border-[#FF385C] outline-none"
              />
              <button 
                type="submit"
                className="p-2.5 rounded-xl bg-[#FF385C] hover:bg-[#e62e50] text-white font-bold transition-all shrink-0 cursor-pointer active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Submission support ticket Form */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="text-left">
              <h2 className="text-base font-black text-slate-950 dark:text-white">Draft Support Ticket</h2>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Need human agent verification? Compile detailed support coordinates.</p>
            </div>

            {ticketSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 p-3 rounded-xl text-xs text-emerald-800 dark:text-emerald-400 font-bold text-left animate-fade-in flex gap-2">
                <Check className="w-5.5 h-5.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                <span>{ticketSuccess}</span>
              </div>
            )}

            {ticketError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 p-3 rounded-xl text-xs text-rose-600 dark:text-rose-450 font-bold text-left animate-fade-in flex gap-2">
                <AlertCircle className="w-5.5 h-5.5 shrink-0 text-rose-500 stroke-[2.5]" />
                <span>{ticketError}</span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-3 text-left">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    placeholder="e.g. Ahad"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-[#FF385C]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    placeholder="ahad90194@gmail.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-[#FF385C]/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1">Issue Category</label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-[#FF385C]/20 outline-none cursor-pointer"
                >
                  <option>Booking Cancellation</option>
                  <option>Payment & Refund disputes</option>
                  <option>Unclean stay spaces</option>
                  <option>Host coordinate mismatch</option>
                  <option>Feedback & suggestions</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1">Tell us more</label>
                <textarea
                  required
                  rows={2}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Summarize the issue so we can locate reservation codes..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-[#FF385C]/20 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs py-3 rounded-xl transition-all shadow-sm cursor-pointer text-center"
              >
                Submit Dispute Ticket Code
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
