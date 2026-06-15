import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Search, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Compass, 
  Users, 
  Trash2, 
  Check, 
  X, 
  ChevronRight, 
  SlidersHorizontal, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  AlertCircle, 
  Plus, 
  RefreshCw, 
  Award, 
  Star, 
  PieChart, 
  Briefcase 
} from 'lucide-react';
import { Listing, Booking } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  listings: Listing[];
  bookings: Booking[];
  onUpdateListings: (updated: Listing[]) => void;
  onUpdateBookings: (updated: Booking[]) => void;
  currentUser: { name: string; email: string; avatar?: string } | null;
}

export default function AdminPanel({ 
  onClose, 
  listings, 
  bookings, 
  onUpdateListings, 
  onUpdateBookings,
  currentUser 
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'bookings' | 'users'>('dashboard');
  const [listingSearch, setListingSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States to facilitate on-the-spot price or rating modifications
  const [editingListingId, setEditingListingId] = useState<number | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedLocation, setEditedLocation] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. STATS METRICS ENGINE (Platform statistics)
  const systemStats = useMemo(() => {
    // Basic sums
    const totalTransactionsVolume = bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.totalPaid : sum, 0);
    // Airbnb platform takes typical fees: 11% service fee from calculated pricing receipts
    const averageCommissionRate = 0.11;
    const platformRevenueCommission = totalTransactionsVolume * averageCommissionRate;
    
    const activeBookingsCount = bookings.filter(b => b.status === 'active').length;
    const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookingsCount = bookings.filter(b => b.status === 'cancelled').length;

    // Category distribution counts
    const categoryCounts: { [key: string]: number } = {};
    listings.forEach(l => {
      categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
    });

    return {
      totalVolume: totalTransactionsVolume,
      platformRevenue: platformRevenueCommission,
      activeBookingsCount,
      completedBookingsCount,
      cancelledBookingsCount,
      categoryCounts,
      listingsCount: listings.length
    };
  }, [listings, bookings]);

  // Combined system users list (Pre-seeded and live profiles)
  const [systemUsers, setSystemUsers] = useState([
    { id: 'usr-1', name: 'Ahad', email: 'ahad90194@gmail.com', role: 'System Admin', joins: 'Jun 2026', totalBookings: 3, verified: true, isHost: true },
    { id: 'usr-2', name: 'Katelyn', email: 'katelyn@superhost.org', role: 'Superhost Designer', joins: 'Jan 2025', totalBookings: 12, verified: true, isHost: true },
    { id: 'usr-3', name: 'Jean-Pierre Alpine', email: 'jp.chamonix@laposte.fr', role: 'Verified Host', joins: 'Mar 2024', totalBookings: 8, verified: true, isHost: true },
    { id: 'usr-4', name: 'Jessica Miller', email: 'jess.mill@outlook.com', role: 'Elite Guest', joins: 'Feb 2026', totalBookings: 4, verified: true, isHost: false },
    { id: 'usr-5', name: 'Marcus Krüger', email: 'marcus.k@techmail.de', role: 'Verified Guest', joins: 'May 2026', totalBookings: 2, verified: false, isHost: false }
  ]);

  // Inject a simulated booking for quick live volume verification
  const handleSimulateBooking = () => {
    if (listings.length === 0) {
      showToast("Cannot simulate bookings without active listings on the system!");
      return;
    }
    const randomListing = listings[Math.floor(Math.random() * listings.length)];
    const randomNights = Math.floor(Math.random() * 5) + 2;
    const rawCost = randomListing.pricePerNight * randomNights;
    const calculatedTotal = Math.ceil(rawCost * 1.25); // including simulated processing/cleaning

    const dateOffsetStart = Math.floor(Math.random() * 10) + 1;
    const dStart = new Date();
    dStart.setDate(dStart.getDate() + dateOffsetStart);
    const dEnd = new Date(dStart);
    dEnd.setDate(dEnd.getDate() + randomNights);

    const generatedSim: Booking = {
      id: 'bk_sim_' + Math.random().toString(36).substr(2, 6),
      listingId: randomListing.id,
      listingTitle: randomListing.title,
      listingLocation: randomListing.location + ', ' + randomListing.country,
      listingImage: randomListing.images[0],
      startDate: dStart.toISOString().split('T')[0],
      endDate: dEnd.toISOString().split('T')[0],
      guestsCount: Math.floor(Math.random() * 2) + 2,
      totalPaid: calculatedTotal,
      checkInCode: Math.floor(100000 + Math.random() * 900000).toString(),
      wifiPassword: 'system-live-' + Math.floor(1000 + Math.random() * 9000),
      status: 'active',
      bookedAt: new Date().toISOString()
    };

    onUpdateBookings([generatedSim, ...bookings]);
    showToast(`Injected simulated sales order #${generatedSim.id.toUpperCase()} ($${calculatedTotal}) successfully!`);
  };

  // Modify Booking Order state (Active -> Completed -> Cancelled)
  const handleChangeBookingStatus = (bookingId: string, targetStatus: 'active' | 'completed' | 'cancelled') => {
    const nextList = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: targetStatus };
      }
      return b;
    });
    onUpdateBookings(nextList);
    showToast(`Updated booking index status to ${targetStatus.toUpperCase()}.`);
  };

  // Delete live bookings from active registers
  const handleDeleteBooking = (bookingId: string) => {
    const nextList = bookings.filter(b => b.id !== bookingId);
    onUpdateBookings(nextList);
    showToast(`Booking record deleted permanently.`);
  };

  // Permanent Unlist / Deletion of Property
  const handleRemoveListing = (listingId: number) => {
    const nextList = listings.filter(l => l.id !== listingId);
    onUpdateListings(nextList);
    showToast("Property listing unlisted permanently from feed records!");
  };

  // Edit action setups
  const startEditingProperties = (listing: Listing) => {
    setEditingListingId(listing.id);
    setEditedPrice(listing.pricePerNight);
    setEditedTitle(listing.title);
    setEditedLocation(listing.location);
  };

  const saveEditedProperties = (listingId: number) => {
    const updated = listings.map(l => {
      if (l.id === listingId) {
        return {
          ...l,
          pricePerNight: editedPrice,
          title: editedTitle,
          location: editedLocation
        };
      }
      return l;
    });
    onUpdateListings(updated);
    setEditingListingId(null);
    showToast("Listing information saved and re-broadcasted.");
  };

  // User management updates
  const handleToggleUserVerification = (userId: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, verified: !u.verified };
      }
      return u;
    }));
    showToast("User account security integrity status updated.");
  };

  const handleDemotePromoteUser = (userId: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const flag = u.role.includes('Superhost') || u.role.includes('Admin');
        return { 
          ...u, 
          role: flag ? 'Verified Guest' : 'Superhost Guide',
          isHost: !flag
        };
      }
      return u;
    }));
    showToast("User privileges synced successfully.");
  };

  // Search filter computations
  const searchedListings = useMemo(() => {
    return listings.filter(l => 
      l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.location.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.category.toLowerCase().includes(listingSearch.toLowerCase())
    );
  }, [listings, listingSearch]);

  const searchedBookings = useMemo(() => {
    return bookings.filter(b => 
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.listingTitle.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.status.toLowerCase().includes(bookingSearch.toLowerCase())
    );
  }, [bookings, bookingSearch]);

  const searchedUsers = useMemo(() => {
    return systemUsers.filter(u => 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [systemUsers, userSearch]);

  // Category counts collection helper for UI
  const parsedCategories = useMemo(() => {
    return Object.entries(systemStats.categoryCounts).map(([catId, value]) => ({
      name: catId,
      value
    }));
  }, [systemStats.categoryCounts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-900 dark:text-white text-left selection:bg-rose-500 selection:text-white">
      
      {/* Toast Alert Feedback Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-55 bg-gradient-to-tr from-slate-950 to-slate-900 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl border border-rose-500/30 flex items-center gap-2 shadow-2xl animate-slide-up">
          <Sparkles className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 gap-4 select-none">
        <div className="text-left">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF385C] block">Platform Governance Control</span>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Enterprise Admin Command</span>
            <span className="bg-[#FF385C] text-white text-[10px] px-2 py-0.5 rounded-md font-bold tracking-normal uppercase h-fit">
              Vite Cloud Run
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Simulation fast check buttons */}
          <button
            onClick={handleSimulateBooking}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Inject Mock Transaction Booking into feed and ledger live"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Traffic</span>
          </button>
          
          <button 
            onClick={onClose}
            className="bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            ← Back to Guest Hub
          </button>
        </div>
      </div>

      {/* Navigational Sub-Tabs segment sliders */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 pb-px mb-8 text-sm font-black select-none gap-6 text-left overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'dashboard' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Activity className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Analytical Dashboard</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('listings')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'listings' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Building className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Properties Inventory ({listings.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'bookings' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <ShoppingBag className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Purchases & Bookings Ledger ({bookings.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'users' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Users className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Accounts & Privilege Managers</span>
        </button>
      </div>

      {toastMessage === null && bookings.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/30 text-xs font-bold mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>No live bookings registered yet. Tip: Click "Simulate Traffic" at the top right to instantly generate active orders and analyze the admin revenue charts dynamically!</span>
        </div>
      )}

      {/* RENDER CURRENT TAB VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Main Key Stats Counters Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total platform volume */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-40">
              <div className="flex items-start justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-gray-400">Total Gross Volume (TGV)</span>
                  <span className="text-3.5xl font-black font-mono block mt-1 text-slate-950 dark:text-white">${systemStats.totalVolume.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/35 rounded-2xl text-emerald-600">
                  <DollarSign className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold">Accumulated purchases volume generated across sites.</p>
            </div>

            {/* Platform admin commission earned */}
            <div className="bg-gradient-to-tr from-slate-950 to-slate-900 p-6 rounded-3xl border border-slate-800 text-white flex flex-col justify-between h-40 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-rose-400">Plat Commission (11% fee)</span>
                  <span className="text-3.5xl font-black font-mono block mt-1 text-white">${Math.ceil(systemStats.platformRevenue).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-[#FF385C]/15 rounded-2xl text-[#FF385C] border border-[#FF385C]/10">
                  <TrendingUp className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Net platform revenue collected directly from bookings.</p>
            </div>

            {/* Total active listed stays */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-40">
              <div className="flex items-start justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-gray-400">Monitored Stays Inventory</span>
                  <span className="text-3.5xl font-black block mt-1 text-slate-950 dark:text-white">{systemStats.listingsCount} Properties</span>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/35 rounded-2xl text-blue-600">
                  <Building className="w-6 h-6 stroke-[2]" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold">Active housing choices rendered on guest search boards.</p>
            </div>

            {/* Total bookings count indicator */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-40">
              <div className="flex items-start justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-gray-400">Bookings Count Index</span>
                  <span className="text-3.5xl font-black block mt-1 text-slate-950 dark:text-white">{bookings.length} Orders</span>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/35 rounded-2xl text-amber-500">
                  <ShoppingBag className="w-6 h-6 stroke-[2]" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-gray-500">
                <span className="text-emerald-500">{systemStats.activeBookingsCount} Active</span>
                <span>•</span>
                <span className="text-blue-500">{systemStats.completedBookingsCount} Done</span>
                <span>•</span>
                <span className="text-rose-500">{systemStats.cancelledBookingsCount} Void</span>
              </div>
            </div>

          </div>

          {/* Core Analytics Graph & Category charts split row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Platform Volume growth projection (SVG graphic plotting) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">Gross Transaction Curves</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Daily and monthly sales tracking curve</p>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-100 dark:border-emerald-900/10">
                  Live Vector Rendering
                </span>
              </div>

              {/* Graphic Plotting Space */}
              <div className="my-6 relative h-56 w-full bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-slate-800">
                
                {/* Simulated vertical grid line rules */}
                <div className="absolute inset-0 grid grid-cols-6 divide-x divide-gray-200 dark:divide-gray-800 pointer-events-none opacity-40" />
                <div className="absolute inset-0 flex flex-col justify-between divide-y divide-gray-200 dark:divide-gray-800 pointer-events-none opacity-40">
                  <div /><div /><div /><div />
                </div>

                {bookings.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-gray-400 font-bold select-none">
                    Generate mock booking traffic to display sales volume growth curve.
                  </div>
                ) : (
                  <svg className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" preserveAspectRatio="none">
                    {/* SVG Gradient fill under growth path */}
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF385C" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#FF385C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient area */}
                    <path 
                      d="M 20 180 Q 150 140 280 110 T 450 60 T 580 30 L 580 200 L 20 200 Z" 
                      fill="url(#areaGrad)" 
                    />

                    {/* Path plotting curve */}
                    <path 
                      d="M 20 180 Q 150 140 280 110 T 450 60 T 580 30" 
                      fill="none" 
                      stroke="#FF385C" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />

                    {/* Dynamic Plot nodes and highlights */}
                    <circle cx="20" cy="180" r="5" fill="#FF385C" stroke="#fff" strokeWidth="2" />
                    <circle cx="280" cy="110" r="5.5" fill="#FF385C" stroke="#fff" strokeWidth="2" />
                    <circle cx="580" cy="30" r="6" fill="#FF385C" stroke="#fff" strokeWidth="2.5" />

                    {/* Node Price labels text indicators */}
                    <g fill="#94a3b8" className="text-[9px] font-semibold">
                      <text x="30" y="175">Start $0</text>
                      <text x="290" y="105">${Math.ceil(systemStats.totalVolume * 0.45)}</text>
                      <text x="500" y="25" className="fill-[#FF385C] font-black">Peaked Global Volume: ${systemStats.totalVolume}</text>
                    </g>
                  </svg>
                )}
              </div>

              {/* Bottom indicators */}
              <div className="grid grid-cols-3 gap-4 text-xs select-none">
                <div>
                  <span className="text-gray-400 uppercase font-black text-[9px] block">Average Ticket Size</span>
                  <span className="font-extrabold text-slate-800 dark:text-white mt-0.5 block font-mono">
                    ${bookings.length > 0 ? Math.ceil(systemStats.totalVolume / bookings.length) : 0} / checkout
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-black text-[9px] block">Peak Performance</span>
                  <span className="font-extrabold mt-0.5 block text-rose-500 font-mono">
                    Superhost Class (Kyoto, Malibu)
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-black text-[9px] block">Target Fee Margin</span>
                  <span className="font-extrabold text-slate-800 dark:text-white mt-0.5 block font-mono">
                    11.0% Flat
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Categories Pie breakdown */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-full">
              
              <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">Property Distribution</h3>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">System category market allocation shares</p>
              </div>

              {/* Graphical counts list */}
              <div className="space-y-4 my-6">
                {parsedCategories.length === 0 ? (
                  <p className="text-xs text-gray-400 font-semibold text-center py-10">No categories distributed.</p>
                ) : (
                  parsedCategories.sort((a,b)=>b.value - a.value).map((cat, idx) => {
                    const percentageValue = Math.round((cat.value / systemStats.listingsCount) * 100) || 10;
                    return (
                      <div key={idx} className="space-y-1.5 text-xs text-left">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="capitalize text-slate-700 dark:text-gray-200">{cat.name} stays</span>
                          <span className="font-black text-slate-950 dark:text-white font-mono">{cat.value} ({percentageValue}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden border border-gray-100 dark:border-slate-800">
                          <div 
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${percentageValue}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total Summary indicators */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1 text-[11px] border border-gray-200 dark:border-slate-800">
                <span className="text-gray-400 block font-bold uppercase text-[9px]">Inventory Strategy</span>
                <p className="text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                  Focusing listings on premium treehouses, mountain cabins, and beachside infinity villas to secure top average ticket sizes.
                </p>
              </div>

            </div>

          </div>

          {/* System Audit Console Logs log lines */}
          <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 text-left font-mono text-xs space-y-3.5 select-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl" />
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <span className="text-rose-500 font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                <span>Enterprise Core Activity Logs</span>
              </span>
              <span className="text-gray-500 text-[10px] uppercase font-bold text-slate-400">Node Cluster: ONLINE</span>
            </div>

            <div className="my-2 select-text space-y-2 text-slate-300">
              <p className="leading-relaxed"><span className="text-gray-500">[2026-06-15 14:12:05]</span> <b className="text-emerald-400">INFO: </b> System synchronized database indexes with localStorage memory buckets.</p>
              <p className="leading-relaxed"><span className="text-gray-500">[2026-06-15 14:15:32]</span> <b className="text-[#FF385C]">API: </b> Received verified check-in webhook credential for guests security.</p>
              <p className="leading-relaxed"><span className="text-gray-500">[2026-06-15 14:18:18]</span> <b className="text-emerald-400">SECURE: </b> Checked passport verification credentials dynamically via guest profile command triggers.</p>
              <p className="leading-relaxed"><span className="text-gray-500">[2026-06-15 14:24:50]</span> <b className="text-blue-400">SYS: </b> Platform fee dispatch: Successfully estimated service fees index totaling <b className="text-white">${Math.ceil(systemStats.platformRevenue)} Net</b> into platform command bank.</p>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'listings' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Properties lists Search filters header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="relative bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 flex items-center pr-3 py-1 rounded-xl w-full sm:max-w-md">
              <Search className="w-4.5 h-4.5 text-gray-400 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search properties by title, state, country or category..."
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-gray-400 outline-none"
              />
              {listingSearch && (
                <button onClick={() => setListingSearch('')} className="text-gray-400 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="text-xs font-bold text-gray-400 whitespace-nowrap">
              Sorted by: <span className="text-slate-900 dark:text-white underline">Creation Date</span>
            </div>
          </div>

          {/* Properties live Table/Grid inventory controls */}
          <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 shadow-lg">
            <table className="w-full min-w-[700px] border-collapse text-xs text-left">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-900 text-gray-400 uppercase font-black tracking-wider text-[10px] select-none border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4">Property Stay Details</th>
                  <th className="p-4">Region Class</th>
                  <th className="p-4">Assigned Host Name</th>
                  <th className="p-4">Star Rating</th>
                  <th className="p-4 text-center">Price per Night</th>
                  <th className="p-4 text-right">Governing Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {searchedListings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-400 font-bold">
                      No matching listed properties found on platform registers.
                    </td>
                  </tr>
                ) : (
                  searchedListings.map((listing) => {
                    const isEditing = editingListingId === listing.id;

                    return (
                      <tr key={listing.id} className="hover:bg-gray-100/30 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={listing.images[0]} 
                              alt={listing.title} 
                              className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 dark:border-gray-800" 
                            />
                            <div className="text-left min-w-0 max-w-sm">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editedTitle}
                                  onChange={(e) => setEditedTitle(e.target.value)}
                                  className="p-1 px-2 mb-1 bg-slate-50 dark:bg-slate-900 text-xs font-black text-slate-950 dark:text-white border border-rose-500/40 rounded focus:outline-none"
                                />
                              ) : (
                                <h4 className="font-extrabold text-sm text-slate-950 dark:text-white truncate">{listing.title}</h4>
                              )}

                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editedLocation}
                                  onChange={(e) => setEditedLocation(e.target.value)}
                                  className="p-1 px-2 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-500 border border-rose-500/40 rounded focus:outline-none"
                                />
                              ) : (
                                <p className="text-[10px] text-gray-400 font-semibold">{listing.location}, {listing.country}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 capitalize">
                          <span className="bg-slate-50 dark:bg-slate-900 text-gray-500 dark:text-gray-300 font-bold px-2 py-1 rounded border border-gray-100 dark:border-slate-800">
                            {listing.category}
                          </span>
                        </td>

                        <td className="p-4 font-extrabold flex items-center gap-2 mt-2">
                          <img src={listing.hostAvatar} alt={listing.hostName} className="w-5.5 h-5.5 rounded-full" />
                          <span className="truncate max-w-[120px]">{listing.hostName}</span>
                        </td>

                        <td className="p-4 font-black">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                            <span>{listing.rating.toFixed(2)}</span>
                          </div>
                        </td>

                        <td className="p-4 text-center font-mono font-black">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-gray-400">$</span>
                              <input
                                type="number"
                                min="10"
                                max="10000"
                                value={editedPrice}
                                onChange={(e) => setEditedPrice(Number(e.target.value))}
                                className="w-20 p-1 text-center bg-slate-50 dark:bg-slate-900 text-xs font-black text-rose-500 border border-rose-500/45 rounded focus:outline"
                              />
                            </div>
                          ) : (
                            <span className="text-rose-500 text-sm font-black">${listing.pricePerNight}</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 shrink-0 select-none">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEditedProperties(listing.id)}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                                  title="Save alterations"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingListingId(null)}
                                  className="p-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-650 rounded cursor-pointer"
                                  title="Cancel edits"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditingProperties(listing)}
                                  className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-gray-200 px-2.5 py-1.5 rounded-lg font-bold hover:bg-[#FF385C] hover:text-white transition-all cursor-pointer"
                                >
                                  Modify Stay
                                </button>
                                <button
                                  onClick={() => handleRemoveListing(listing.id)}
                                  className="text-gray-400 hover:text-rose-500 p-2 transition-colors cursor-pointer"
                                  title="Delete listings"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Booking / Purchases Search filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="relative bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 flex items-center pr-3 py-1 rounded-xl w-full sm:max-w-md">
              <Search className="w-4.5 h-4.5 text-gray-400 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search orders by Booking ID, stay title or checkin PIN codes..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-gray-400 outline-none"
              />
              {bookingSearch && (
                <button onClick={() => setBookingSearch('')} className="text-gray-400 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="text-xs font-bold text-rose-500">
              Platform Service Commissions Collected (Average 11% checkout cut): <b>${Math.ceil(systemStats.platformRevenue)}</b>
            </div>
          </div>

          {/* Bookings Table lists grid block */}
          <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 shadow-lg">
            <table className="w-full min-w-[800px] border-collapse text-xs text-left">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-900 text-gray-400 uppercase font-black tracking-wider text-[10px] select-none border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4">Transaction Booking ID</th>
                  <th className="p-4">Accomodation Destination stays</th>
                  <th className="p-4">Staying Dates Interval</th>
                  <th className="p-4 text-center">Travelers Count</th>
                  <th className="p-4 text-center">Total paid checkout</th>
                  <th className="p-4">Check-in Access PIN Code</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-right">Emergency Action Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {searchedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-gray-400 font-bold">
                      No matching user bookings or checkouts found. Try simulated traffic inject tools!
                    </td>
                  </tr>
                ) : (
                  searchedBookings.map((booking) => {
                    const statusColors = {
                      active: 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/10',
                      completed: 'bg-blue-50 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border border-blue-101 dark:border-blue-950/10',
                      cancelled: 'bg-rose-50 dark:bg-rose-950/25 text-rose-600 dark:text-rose-400 border border-rose-101 dark:border-rose-950/10'
                    };

                    return (
                      <tr key={booking.id} className="hover:bg-gray-100/30 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-mono font-extrabold text-[#FF385C]">
                          #{booking.id.toUpperCase()}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={booking.listingImage} 
                              alt={booking.listingTitle} 
                              className="w-8 h-8 rounded object-cover shrink-0" 
                            />
                            <div className="text-left truncate max-w-[200px]">
                              <span className="font-extrabold text-slate-950 dark:text-white block truncate">{booking.listingTitle}</span>
                              <span className="text-[9px] text-gray-400 block truncate">{booking.listingLocation}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                          {booking.startDate} to {booking.endDate}
                        </td>

                        <td className="p-4 text-center font-extrabold">
                          {booking.guestsCount} travelers
                        </td>

                        <td className="p-4 text-center font-mono font-black text-rose-500 text-sm">
                          ${booking.totalPaid}
                        </td>

                        <td className="p-4 font-mono">
                          <code className="bg-slate-50 dark:bg-slate-900 p-1 px-2.5 rounded border border-gray-100 dark:border-slate-800 text-slate-800 dark:text-gray-200 text-[10.5px]">
                            PIN: {booking.checkInCode}
                          </code>
                        </td>

                        <td className="p-4 capitalize">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2.5 pr-2.5 select-none text-[10px]">
                            {booking.status === 'active' && (
                              <button
                                onClick={() => handleChangeBookingStatus(booking.id, 'completed')}
                                className="bg-emerald-50 text-emerald-600 border border-emerald-120 dark:bg-emerald-950/20 px-2 py-1 rounded hover:bg-emerald-500 hover:text-white transition cursor-pointer"
                              >
                                Done
                              </button>
                            )}
                            
                            {booking.status !== 'cancelled' ? (
                              <button
                                onClick={() => handleChangeBookingStatus(booking.id, 'cancelled')}
                                className="bg-rose-50 text-rose-500 border border-rose-120 dark:bg-rose-950/20 px-2 py-1 rounded hover:bg-rose-500 hover:text-white transition cursor-pointer"
                              >
                                Cancel
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="text-gray-400 hover:text-rose-500"
                                title="Delete Log record permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Users search header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="relative bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 flex items-center pr-3 py-1 rounded-xl w-full sm:max-w-md">
              <Search className="w-4.5 h-4.5 text-gray-400 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search registered host / guest accounts by name or email domains..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-gray-400 outline-none"
              />
              {userSearch && (
                <button onClick={() => setUserSearch('')} className="text-gray-400 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="text-xs font-medium text-gray-400 select-none">
              Live Verified accounts badge rate: <span className="text-slate-900 dark:text-white font-black underline">80% Checked</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedUsers.map((user) => (
              <div 
                key={user.id} 
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  
                  {/* Avatar name role banner */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover bg-rose-50 ring-2 ring-gray-100" 
                      />
                      <div className="text-left">
                        <h4 className="font-extrabold text-[#FF385C] text-sm">{user.name}</h4>
                        <span className="text-[10px] text-gray-400 font-bold block">{user.email}</span>
                      </div>
                    </div>

                    <span className="bg-slate-50 dark:bg-slate-950 text-gray-500 font-black px-2 py-1 rounded text-[9px] uppercase tracking-wider border border-gray-100 dark:border-slate-800">
                      {user.role}
                    </span>
                  </div>

                  {/* Account properties stats */}
                  <div className="grid grid-cols-2 gap-2 mt-4.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 select-none text-xs font-semibold">
                    <div>
                      <span className="text-gray-400 text-[9px] uppercase font-black block">Registered stays</span>
                      <span className="text-slate-900 dark:text-white font-mono mt-0.5 block font-bold">
                        {user.isHost ? listings.filter(l=>l.hostName.includes(user.name)).length : 0} Properties
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[9px] uppercase font-black block">Account Tier</span>
                      <span className="text-slate-900 dark:text-white mt-0.5 block font-mono font-bold">
                        {user.verified ? "Premium verified" : "Regular"}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Operations button row */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 select-none">
                  <button
                    onClick={() => handleToggleUserVerification(user.id)}
                    className={`text-[10px] font-black px-3 py-1.5 rounded transition ${user.verified ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 hover:text-white hover:bg-emerald-600' : 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 hover:text-white hover:bg-rose-500'}`}
                  >
                    {user.verified ? '✓ Verified Badge' : '✗ Uncheck ID Badge'}
                  </button>

                  <button
                    onClick={() => handleDemotePromoteUser(user.id)}
                    className="text-[10px] font-black text-gray-500 hover:text-[#FF385C] underline cursor-pointer"
                  >
                    Set Host Status
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
