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
  Briefcase,
  Shield,
  PlusCircle,
  Receipt,
  Coins,
  Settings,
  UserCheck,
  Package,
  CheckCircle2,
  XCircle,
  ArrowRight
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

interface AddOnProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'Active' | 'Discontinued';
  description: string;
}

export default function AdminPanel({ 
  onClose, 
  listings, 
  bookings, 
  onUpdateListings, 
  onUpdateBookings,
  currentUser 
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'listings' | 'products' | 'users'>('dashboard');
  const [userSearch, setUserSearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States to facilitate modifications or creation
  const [editingListingId, setEditingListingId] = useState<number | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedLocation, setEditedLocation] = useState<string>('');
  const [editedCategory, setEditedCategory] = useState<string>('');

  // Form states for creating a new Stay Listing (Product)
  const [showAddListingForm, setShowAddListingForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newCategory, setNewCategory] = useState('beachfront');
  const [newPrice, setNewPrice] = useState(150);
  const [newHostName, setNewHostName] = useState(currentUser?.name || 'Administrator');

  // Form states for adding standard Add-on products (Experiences/Services)
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(50);
  const [newProdCat, setNewProdCat] = useState('Wellness');
  const [newProdDesc, setNewProdDesc] = useState('');

  // User management state
  const [systemUsers, setSystemUsers] = useState([
    { id: 'usr-1', name: 'Ahad', email: 'ahad90194@gmail.com', role: 'Admin', joins: 'Jun 2026', totalBookings: 3, verified: true, isHost: true },
    { id: 'usr-2', name: 'Katelyn', email: 'katelyn@superhost.org', role: 'Host', joins: 'Jan 2025', totalBookings: 12, verified: true, isHost: true },
    { id: 'usr-3', name: 'Jean-Pierre Alpine', email: 'jp.chamonix@laposte.fr', role: 'Moderator', joins: 'Mar 2024', totalBookings: 8, verified: true, isHost: true },
    { id: 'usr-4', name: 'Jessica Miller', email: 'jess.mill@outlook.com', role: 'Guest', joins: 'Feb 2026', totalBookings: 4, verified: true, isHost: false },
    { id: 'usr-5', name: 'Marcus Krüger', email: 'marcus.k@techmail.de', role: 'Guest', joins: 'May 2026', totalBookings: 2, verified: false, isHost: false }
  ]);

  // Add-on products (Standard Experiences or Amenities) state
  const [addOnProducts, setAddOnProducts] = useState<AddOnProduct[]>([
    { id: 'prod-1', name: 'Luxury Airport Transport Service', price: 95, category: 'Transportation', status: 'Active', description: 'Chauffeur-driven electric sedan transfer directly from airport gates.' },
    { id: 'prod-2', name: 'Certified Local Mountain Guide Day Trip', price: 180, category: 'Adventure', status: 'Active', description: 'Professional expert-led premium trail hiking and photography tours.' },
    { id: 'prod-3', name: 'Private Gourmet Chef Suite Dinner', price: 290, category: 'Dining', status: 'Active', description: 'Three-course artisanal culinary menu prepared live inside stay kitchens.' },
    { id: 'prod-4', name: 'Premium Room Massage & Wellness Session', price: 125, category: 'Wellness', status: 'Active', description: 'Sixty minute professional essential oils deep tissue treatment.' },
    { id: 'prod-5', name: 'High-Performance Mountain Bike Hire', price: 45, category: 'Rental', status: 'Active', description: 'Full day equipment rental including protective gear and trailing guide apps.' }
  ]);

  // Form states to register a new User/Host Account
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Moderator' | 'Host' | 'Guest'>('Guest');
  const [newUserVerified, setNewUserVerified] = useState(true);

  // Trigger feedback messages
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. STATS METRICS ENGINE (Platform statistics)
  const systemStats = useMemo(() => {
    // Basic sums
    const totalSalesVolume = bookings.reduce((sum, b) => {
      if (b.status !== 'cancelled' && b.status !== 'refunded') {
        return sum + b.totalPaid;
      }
      return sum;
    }, 0);

    const refundLosses = bookings.reduce((sum, b) => b.status === 'refunded' ? sum + b.totalPaid : sum, 0);
    const platformRevenueCommission = totalSalesVolume * 0.11; // 11% fee
    const hostSettlementsNet = totalSalesVolume * 0.89; // 89% payout

    const activeBookingsCount = bookings.filter(b => b.status === 'active').length;
    const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;
    const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;
    const refundedBookingsCount = bookings.filter(b => b.status === 'refunded').length;
    const cancelledBookingsCount = bookings.filter(b => b.status === 'cancelled').length;

    // Category distribution counts
    const categoryCounts: { [key: string]: number } = {};
    listings.forEach(l => {
      categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
    });

    return {
      totalVolume: totalSalesVolume,
      platformRevenue: platformRevenueCommission,
      hostSettlements: hostSettlementsNet,
      refundLoss: refundLosses,
      activeCount: activeBookingsCount,
      completedCount: completedBookingsCount,
      pendingCount: pendingBookingsCount,
      refundedCount: refundedBookingsCount,
      cancelledCount: cancelledBookingsCount,
      categoryCounts,
      listingsCount: listings.length,
      unapprovedListingsCount: listings.filter(l => l.approved === false).length
    };
  }, [listings, bookings]);

  // Toggle listing approval state
  const handleToggleListingApproval = (listingId: number) => {
    const updated = listings.map(l => {
      if (l.id === listingId) {
        // Toggle from approved (default/undefined/true) to suspended (false)
        const currentApproved = l.approved !== false;
        return { ...l, approved: !currentApproved };
      }
      return l;
    });
    onUpdateListings(updated);
    const item = listings.find(l => l.id === listingId);
    showToast(`Listing "${item?.title}" approval state updated.`);
  };

  // Create a new property listing (stay product)
  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim() || !newCountry.trim()) {
      showToast("Please fill in the required property fields!");
      return;
    }

    const randomId = Math.floor(100000 + Math.random() * 900000);
    const createdListing: Listing = {
      id: randomId,
      title: newTitle,
      description: newDescription || "An elite high-contrast property managed and verified by platform administrators.",
      location: newLocation,
      country: newCountry,
      distance: `${(Math.random() * 80 + 10).toFixed(0)} miles away`,
      dateRange: "Jun 20 - 25",
      pricePerNight: newPrice,
      rating: 5.0,
      reviewsCount: 1,
      category: newCategory,
      images: [
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
      ],
      hostName: newHostName,
      hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=AdminHost",
      maxGuests: 4,
      beds: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["High-speed Wifi", "Air Conditioning", "Ocean Vista", "Private Pool"],
      coordinates: { lat: 34.0522 + (Math.random() - 0.5) * 5, lng: -118.2437 + (Math.random() - 0.5) * 5 },
      approved: true // Default newly created admin listing to approved
    };

    onUpdateListings([createdListing, ...listings]);
    showToast(`Stay product "${newTitle}" registered and approved!`);
    
    // Reset fields
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewCountry('');
    setNewPrice(150);
    setShowAddListingForm(false);
  };

  // Modify stay listing details (Listing management)
  const startEditingProperties = (listing: Listing) => {
    setEditingListingId(listing.id);
    setEditedPrice(listing.pricePerNight);
    setEditedTitle(listing.title);
    setEditedLocation(listing.location);
    setEditedCategory(listing.category);
  };

  const saveEditedProperties = (listingId: number) => {
    const updated = listings.map(l => {
      if (l.id === listingId) {
        return {
          ...l,
          pricePerNight: editedPrice,
          title: editedTitle,
          location: editedLocation,
          category: editedCategory
        };
      }
      return l;
    });
    onUpdateListings(updated);
    setEditingListingId(null);
    showToast("Stay product parameters modified successfully.");
  };

  const handleRemoveListing = (listingId: number) => {
    const updated = listings.filter(l => l.id !== listingId);
    onUpdateListings(updated);
    showToast("Listed property unlinked permanently from platform.");
  };

  // Orders Management updates
  const handleChangeOrderStatus = (bookingId: string, targetStatus: 'pending' | 'active' | 'completed' | 'cancelled' | 'refunded') => {
    const nextList = bookings.map(b => {
      if (b.id === bookingId) {
        let update: Partial<Booking> = { status: targetStatus };
        if (targetStatus === 'refunded' || targetStatus === 'cancelled') {
          update.payoutStatus = 'Refunded';
        } else if (targetStatus === 'completed') {
          update.payoutStatus = 'Unpaid';
        }
        return { ...b, ...update };
      }
      return b;
    });
    onUpdateBookings(nextList);
    showToast(`Order status updated to ${targetStatus.toUpperCase()}.`);
  };

  const handleDisbursePayout = (bookingId: string, payoutState: 'Unpaid' | 'Processing' | 'Paid') => {
    const nextList = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, payoutStatus: payoutState };
      }
      return b;
    });
    onUpdateBookings(nextList);
    showToast(`Payout lifecycle status updated to ${payoutState}.`);
  };

  const handleDeleteBooking = (bookingId: string) => {
    const nextList = bookings.filter(b => b.id !== bookingId);
    onUpdateBookings(nextList);
    showToast("Booking transaction deleted from active registers.");
  };

  // Actions for Add-on products (Experiences/Services) management
  const handleToggleProductStatus = (prodId: string) => {
    setAddOnProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        return { ...p, status: p.status === 'Active' ? 'Discontinued' : 'Active' };
      }
      return p;
    }));
    showToast("Product availability state modified.");
  };

  const handleRemoveProduct = (prodId: string) => {
    setAddOnProducts(prev => prev.filter(p => p.id !== prodId));
    showToast("Upsell service item removed successfully.");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdDesc.trim()) {
      showToast("Please fill in description and service name!");
      return;
    }
    const created: AddOnProduct = {
      id: 'prod_' + Math.random().toString(36).substr(2, 6),
      name: newProdName,
      price: newProdPrice,
      category: newProdCat,
      status: 'Active',
      description: newProdDesc
    };
    setAddOnProducts([created, ...addOnProducts]);
    showToast(`Service option "${newProdName}" added successfully.`);
    setNewProdName('');
    setNewProdPrice(50);
    setNewProdDesc('');
    setShowAddProductForm(false);
  };

  // User & Roles management actions
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast("Please complete user nickname and email info!");
      return;
    }
    const created = {
      id: 'usr-' + Math.floor(10 + Math.random() * 90),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      joins: 'Jun 2026',
      totalBookings: 0,
      verified: newUserVerified,
      isHost: newUserRole === 'Host' || newUserRole === 'Admin'
    };
    setSystemUsers([...systemUsers, created]);
    showToast(`New ${newUserRole} account "${newUserName}" registered!`);
    
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserForm(false);
  };

  const handleToggleUserVerification = (userId: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, verified: !u.verified };
      }
      return u;
    }));
    showToast("User credential verification badge toggled.");
  };

  const handleChangeUserRole = (userId: string, selectedRole: 'Admin' | 'Moderator' | 'Host' | 'Guest') => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { 
          ...u, 
          role: selectedRole,
          isHost: selectedRole === 'Host' || selectedRole === 'Admin'
        };
      }
      return u;
    }));
    showToast(`User security credentials set to ${selectedRole}.`);
  };

  const handleDeleteUser = (userId: string) => {
    setSystemUsers(prev => prev.filter(u => u.id !== userId));
    showToast("User account database profile destroyed successfully.");
  };

  // Traffic Simulator Quick Order injects
  const handleSimulateBooking = () => {
    if (listings.length === 0) {
      showToast("Create properties before generating simulated sales!");
      return;
    }
    const randomListing = listings[Math.floor(Math.random() * listings.length)];
    const randomNights = Math.floor(Math.random() * 4) + 2;
    const rawCost = randomListing.pricePerNight * randomNights;
    const checkoutTotal = Math.ceil(rawCost * 1.15); // adding taxes/platform services

    const dStart = new Date();
    dStart.setDate(dStart.getDate() + Math.floor(Math.random() * 8) + 1);
    const dEnd = new Date(dStart);
    dEnd.setDate(dEnd.getDate() + randomNights);

    const states: ('pending' | 'active' | 'completed')[] = ['pending', 'active', 'completed'];
    const chosenState = states[Math.floor(Math.random() * states.length)];

    const generatedSim: Booking = {
      id: 'bk_ord_' + Math.random().toString(36).substr(2, 6),
      listingId: randomListing.id,
      listingTitle: randomListing.title,
      listingLocation: randomListing.location + ', ' + randomListing.country,
      listingImage: randomListing.images[0],
      startDate: dStart.toISOString().split('T')[0],
      endDate: dEnd.toISOString().split('T')[0],
      guestsCount: Math.floor(Math.random() * 2) + 2,
      totalPaid: checkoutTotal,
      checkInCode: Math.floor(100000 + Math.random() * 900000).toString(),
      wifiPassword: 'system-live-' + Math.floor(1000 + Math.random() * 9000),
      status: chosenState,
      payoutStatus: chosenState === 'completed' ? 'Unpaid' : undefined,
      bookedAt: new Date().toISOString()
    };

    onUpdateBookings([generatedSim, ...bookings]);
    showToast(`Sales order #${generatedSim.id.toUpperCase()} ($${checkoutTotal}) injected successfully!`);
  };

  // Search filter computations
  const searchedListings = useMemo(() => {
    return listings.filter(l => 
      l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.location.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.category.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.hostName.toLowerCase().includes(listingSearch.toLowerCase())
    );
  }, [listings, listingSearch]);

  const searchedBookings = useMemo(() => {
    return bookings.filter(b => 
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.listingTitle.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.status.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      (b.payoutStatus && b.payoutStatus.toLowerCase().includes(bookingSearch.toLowerCase()))
    );
  }, [bookings, bookingSearch]);

  const searchedProducts = useMemo(() => {
    return addOnProducts.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [addOnProducts, productSearch]);

  const searchedUsers = useMemo(() => {
    return systemUsers.filter(u => 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [systemUsers, userSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-gray-100 text-left select-none">
      
      {/* Toast Overlay Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-55 bg-slate-900 border border-rose-500/40 text-rose-400 font-extrabold text-xs px-5 py-3.5 rounded-2xl flex items-center gap-3.5 shadow-2xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#FF385C] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header operations row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-[#FF385C] block">Platform Control Core</span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-3">
            <span>Enterprise Admin Portal</span>
            <span className="bg-[#FF385C] text-white text-[9px] px-2.5 py-0.5 rounded font-black tracking-widest uppercase h-fit">
              Secure Cloud
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateBooking}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4.5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/20 flex items-center gap-1.5 cursor-pointer"
            title="Inject simulated organic guest booking live"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Traffic</span>
          </button>
          
          <button 
            onClick={onClose}
            className="bg-slate-850 hover:bg-slate-800 text-white border border-slate-700/60 font-black text-xs px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            ← Exit Operations View
          </button>
        </div>
      </div>

      {/* Primary Sub-Tabs Swapper menu selection */}
      <div className="flex border-b border-slate-800 pb-px mb-8 text-xs font-black select-none gap-6 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
        >
          <Activity className="w-4 h-4" />
          <span>Sales & Analytics</span>
        </button>

        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'orders' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & Checkout ({bookings.length})</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('listings')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'listings' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
        >
          <Building className="w-4 h-4" />
          <span>Listing Management ({listings.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'products' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
        >
          <Package className="w-4 h-4" />
          <span>Products & Services ({addOnProducts.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'users' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
        >
          <Users className="w-4 h-4" />
          <span>User Profiles & Roles ({systemUsers.length})</span>
        </button>
      </div>

      {/* RENDER DYNAMIC COMPONENT PANEL VIEWS */}
      
      {/* 1. DASHBOARD OVERVIEW VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in text-left">
          
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Gross checkout value */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between h-36">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-450 block">Gross Booking Volume</span>
                  <span className="text-3xl font-black font-mono mt-1 block">${systemStats.totalVolume.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-2xl text-emerald-400 border border-slate-700/30">
                  <Coins className="w-5.5 h-5.5" />
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Total approved and pending payments</span>
            </div>

            {/* Platform cut (11% fee) */}
            <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between h-36 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#FF385C] block">Platform Comm. (11%)</span>
                  <span className="text-3xl font-black font-mono mt-1 block text-white">${Math.ceil(systemStats.platformRevenue).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-[#FF385C]/10 rounded-2xl text-[#FF385C] border border-[#FF385C]/20">
                  <TrendingUp className="w-5.5 h-5.5 animate-pulse" />
                </div>
              </div>
              <span className="text-[10px] text-rose-400 font-bold">Earned platform commission on checkouts</span>
            </div>

            {/* Host Settlements (89%) */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between h-36">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-450 block">Host Net Pay Settled</span>
                  <span className="text-3xl font-black font-mono mt-1 block">${Math.ceil(systemStats.hostSettlements).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-2xl text-blue-400 border border-slate-700/30">
                  <Receipt className="w-5.5 h-5.5" />
                </div>
              </div>
              <span className="text-[10px] text-blue-400 font-bold">Transfers outstanding or fully cleared</span>
            </div>

            {/* Void / Dispute losses */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between h-36">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-450 block">Refund & Void Losses</span>
                  <span className="text-3xl font-black font-mono mt-1 block text-rose-500">${systemStats.refundLoss.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-2xl text-rose-500 border border-slate-700/30">
                  <XCircle className="w-5.5 h-5.5" />
                </div>
              </div>
              <span className="text-[10px] text-rose-400 font-bold">{systemStats.refundedCount} refund files processed</span>
            </div>

          </div>

          {/* Graphical Trends Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sales performance graph */}
            <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Checkout Revenue Index</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Visualization of real-time cumulative sales curves</p>
                </div>
                <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[10px] font-black px-2.5 py-1 rounded">
                  Status: Optimized
                </span>
              </div>

              {/* Graphical Path Plotting */}
              <div className="h-52 w-full bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800/60 flex items-center justify-center">
                {bookings.length === 0 ? (
                  <div className="text-center p-6 space-y-2">
                    <p className="text-xs text-gray-400 font-bold">No booking order data inside platform ledger.</p>
                    <button 
                      onClick={handleSimulateBooking}
                      className="text-[10px] font-black underline text-[#FF385C] hover:text-white"
                    >
                      Click here to inject simulated checkout traffic
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 px-2 py-4 flex flex-col justify-between">
                    <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF385C" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#FF385C" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 10 130 C 150 110, 250 50, 400 60 T 590 20 L 590 145 L 10 145 Z" fill="url(#chartGrad)" />
                      <path d="M 10 130 C 150 110, 250 50, 400 60 T 590 20" fill="none" stroke="#FF385C" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="10" cy="130" r="4" fill="#FF385C" />
                      <circle cx="400" cy="60" r="4" fill="#FF385C" />
                      <circle cx="590" cy="20" r="5" fill="#FF385C" stroke="#fff" strokeWidth="1.5" />
                    </svg>
                    <div className="flex justify-between text-[9px] text-gray-500 font-bold px-3">
                      <span>Ledger Start</span>
                      <span>Vol: ${Math.ceil(systemStats.totalVolume * 0.45)}</span>
                      <span className="text-[#FF385C]">Apex Peak cleared: ${systemStats.totalVolume}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub parameters metrics */}
              <div className="grid grid-cols-3 gap-4 pt-2 divide-x divide-slate-800/50 text-xs">
                <div className="pl-3">
                  <span className="text-[9px] uppercase font-black text-gray-550 block">Operational Stays</span>
                  <span className="font-extrabold text-white mt-1 block">{systemStats.listingsCount} Listed properties</span>
                </div>
                <div className="pl-3">
                  <span className="text-[9px] uppercase font-black text-gray-550 block">Pending Approvals</span>
                  <span className="font-extrabold text-[#FF385C] mt-1 block">
                    {systemStats.unapprovedListingsCount} Pending Properties
                  </span>
                </div>
                <div className="pl-3">
                  <span className="text-[9px] uppercase font-black text-gray-550 block">Active Bookings Queue</span>
                  <span className="font-extrabold text-emerald-400 mt-1 block">
                    {systemStats.activeCount} In Residence
                  </span>
                </div>
              </div>

            </div>

            {/* Platform allocations share */}
            <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between">
              
              <div className="pb-3 border-b border-slate-800/60">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Stay Categories Distribution</h3>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">System classification ratio analysis</p>
              </div>

              {/* Graphical categories indicators */}
              <div className="space-y-3.5 my-5">
                {Object.entries(systemStats.categoryCounts).length === 0 ? (
                  <p className="text-xs text-gray-455 font-bold text-center py-6">No properties preseeded under categories view.</p>
                ) : (
                  Object.entries(systemStats.categoryCounts).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 4).map(([catId, value], i) => {
                    const percentage = Math.round(((value as number) / systemStats.listingsCount) * 105) || 5;
                    return (
                      <div key={i} className="text-xs font-semibold text-left space-y-1">
                        <div className="flex justify-between text-xs font-semibold font-sans">
                          <span className="capitalize text-gray-300">{catId}</span>
                          <span className="font-black font-mono text-gray-100">{value as number} stays ({percentage}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-gray-400 font-bold">
                <span className="text-[#FF385C] block uppercase text-[9px] font-black mb-0.5">Strategy Notice</span>
                Ensure a diversified collection of unique product stays (such as domes, beachfront beachfront, beachfront villas, beachfront ski treehouses) are authorized to increase guest retention averages!
              </div>

            </div>

          </div>

          {/* Secure Audit Console logs lines */}
          <div className="bg-slate-950 text-slate-300 p-5 rounded-3xl border border-slate-850 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 select-none">
              <span className="text-[#FF385C] font-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                <span>Enterprise Core Activity Logs</span>
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-black">Cluster Context Online</span>
            </div>

            <div className="space-y-1 text-[11px] text-gray-300">
              <p><span className="text-gray-500">[2026-06-15 14:12]</span> <span className="text-emerald-400">SUCCESS:</span> Database synchronization completed cleanly inside local storage blocks.</p>
              <p><span className="text-gray-500">[2026-06-15 14:15]</span> <span className="text-[#FF385C]">SECURITY:</span> Automated checks matched credentials with system roles hierarchy controls.</p>
              <p><span className="text-gray-500">[2026-06-16 08:24]</span> <span className="text-blue-400">BILLING:</span> platform fees ledger recorded commission cut totaling <b className="text-[#FF385C] font-black">${Math.ceil(systemStats.platformRevenue)} Base USD</b>.</p>
            </div>
          </div>

        </div>
      )}

      {/* 2. ORDERS & CHECKOUT MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Filters header and search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
            <div className="relative bg-slate-950 border border-slate-800 flex items-center pr-3 py-1 rounded-xl w-full md:max-w-md">
              <Search className="w-4 h-4 text-gray-450 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search orders, booking IDs, status or keys..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-white placeholder-gray-500 outline-none"
              />
              {bookingSearch && (
                <button onClick={() => setBookingSearch('')} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="text-xs font-black text-rose-450">
              Accumulated Platform Service Comm. Value: <span className="underline font-mono">${Math.ceil(systemStats.platformRevenue)}</span>
            </div>
          </div>

          {/* Checkout Table of bookings */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/10 shadow-lg">
            <table className="w-full min-w-[900px] border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-gray-400 uppercase font-black tracking-widest text-[9.5px]">
                  <th className="p-4 text-left">Booking Reference</th>
                  <th className="p-4 text-left">Stay Destination Details</th>
                  <th className="p-4 text-left">Travel Window</th>
                  <th className="p-4 text-center">Travelers</th>
                  <th className="p-4 text-right">Checkout Value</th>
                  <th className="p-4 text-center">Comm. Split</th>
                  <th className="p-4 text-center">Access Code</th>
                  <th className="p-4 text-center">Transaction Status</th>
                  <th className="p-4 text-right">Govern Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 select-text">
                {searchedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-gray-500 font-bold select-none">
                      No matching checkout orders or logs found inside platform buffers.
                    </td>
                  </tr>
                ) : (
                  searchedBookings.map((b) => {
                    const commissionCut = Math.ceil(b.totalPaid * 0.11);
                    const hostPayout = b.totalPaid - commissionCut;

                    // Colored pills configurations
                    const statusConfig = {
                      pending: 'bg-amber-950/40 text-amber-400 border border-amber-900/30',
                      active: 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30',
                      completed: 'bg-blue-950/40 text-blue-400 border border-blue-900/30',
                      cancelled: 'bg-rose-950/35 text-rose-500 border border-rose-900/20',
                      refunded: 'bg-[#FF385C]/15 text-[#FF385C] border border-rose-950/40'
                    };

                    const payoutConfig = {
                      Unpaid: 'bg-slate-800 text-slate-400 border border-slate-700/40',
                      Processing: 'bg-teal-950/30 text-teal-400 border-teal-900/20 animate-pulse',
                      Paid: 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30',
                      Refunded: 'bg-rose-955/20 text-rose-400 border border-rose-950/40'
                    };

                    return (
                      <tr key={b.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="p-4 font-mono font-black text-rose-400">
                          #{b.id.toUpperCase()}
                        </td>

                        <td className="p-4 text-left">
                          <div className="flex items-center gap-3 select-none">
                            <img src={b.listingImage} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                            <div className="min-w-0 max-w-[170px]">
                              <span className="block font-black text-white truncate">{b.listingTitle}</span>
                              <span className="block text-[9.5px] text-gray-400 truncate">{b.listingLocation}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-bold text-gray-300">
                          {b.startDate} <br/>
                          <span className="text-[10px] text-gray-550">to {b.endDate}</span>
                        </td>

                        <td className="p-4 text-center font-extrabold text-gray-300">
                          {b.guestsCount} stays
                        </td>

                        <td className="p-4 text-right font-mono font-extrabold text-[#FF385C]">
                          ${b.totalPaid}
                        </td>

                        <td className="p-4 text-center font-semibold text-gray-400 select-none">
                          <span className="text-xs font-bold text-white">${commissionCut}</span> <span className="text-[10px] text-gray-650 font-medium">(11%)</span> <br/>
                          <span className="text-[10px] text-teal-400">${hostPayout} host</span>
                        </td>

                        <td className="p-4 text-center font-mono select-none">
                          <code className="bg-slate-950 px-2 py-1 rounded text-gray-300 text-[10px] border border-slate-850">
                            {b.checkInCode}
                          </code>
                        </td>

                        <td className="p-4 text-center space-y-1.5 select-none">
                          {/* Order State Pill */}
                          <span className={`inline-block px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${statusConfig[b.status]}`}>
                            {b.status}
                          </span>
                          
                          {/* Payout State Pill */}
                          {b.payoutStatus && (
                            <div className="text-[9.5px]">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold ${payoutConfig[b.payoutStatus]}`}>
                                host: {b.payoutStatus}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex flex-col items-end gap-1.5 select-none">
                            
                            {/* Workflow decisions triggers */}
                            <div className="flex items-center gap-1.5">
                              {/* Pending Approvals workflow */}
                              {b.status === 'pending' && (
                                <button
                                  onClick={() => handleChangeOrderStatus(b.id, 'active')}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] px-2 py-1 rounded transition h-fit cursor-pointer"
                                >
                                  Approve Order
                                </button>
                              )}

                              {/* Active to Done checkouts */}
                              {b.status === 'active' && (
                                <button
                                  onClick={() => handleChangeOrderStatus(b.id, 'completed')}
                                  className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[9px] px-2 py-1 rounded transition h-fit cursor-pointer"
                                >
                                  Mark Done
                                </button>
                              )}

                              {/* Dispute Refunds / Cancellation */}
                              {(b.status === 'active' || b.status === 'pending') && (
                                <button
                                  onClick={() => handleChangeOrderStatus(b.id, 'cancelled')}
                                  className="bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-gray-400 text-[9px] font-semibold px-2 py-1 rounded transition h-fit cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}

                              {b.status === 'completed' && (
                                <button
                                  onClick={() => handleChangeOrderStatus(b.id, 'refunded')}
                                  className="bg-rose-950/40 hover:bg-rose-900 border border-rose-900/30 text-rose-450 text-[9px] font-black px-2 py-1 rounded transition h-fit cursor-pointer"
                                >
                                  Issue Refund
                                </button>
                              )}
                            </div>

                            {/* HOST PAYOUT Lifecycle processes */}
                            {b.status === 'completed' && b.payoutStatus === 'Unpaid' && (
                              <button
                                onClick={() => handleDisbursePayout(b.id, 'Processing')}
                                className="bg-teal-900 hover:bg-teal-800 text-teal-200 border border-teal-800 font-extrabold text-[8.5px] px-2 py-0.5 rounded transition cursor-pointer"
                              >
                                Process Host Payout
                              </button>
                            )}

                            {b.payoutStatus === 'Processing' && (
                              <button
                                onClick={() => handleDisbursePayout(b.id, 'Paid')}
                                className="bg-emerald-950 text-emerald-400 border border-emerald-900 font-black text-[8.5px] px-2 py-0.5 rounded hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                              >
                                Disburse Funds
                              </button>
                            )}

                            {/* Permanently delete logs */}
                            {b.status === 'cancelled' || b.status === 'refunded' ? (
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="text-gray-500 hover:text-rose-500 p-1 flex items-center gap-1 cursor-pointer"
                                title="Purge void transaction"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="text-[9px]">Purge Log</span>
                              </button>
                            ) : null}

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

      {/* 3. PRODUCT & LISTING APPROVAL MANAGEMENT */}
      {activeTab === 'listings' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
            <div className="relative bg-slate-950 border border-slate-850 flex items-center pr-3 py-1 rounded-xl w-full md:max-w-md">
              <Search className="w-4 h-4 text-gray-450 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search stays properties, region, host name..."
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-white placeholder-gray-500 outline-none"
              />
              {listingSearch && (
                <button onClick={() => setListingSearch('')} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowAddListingForm(!showAddListingForm)}
              className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              {showAddListingForm ? <X className="w-4.5 h-4.5" /> : <PlusCircle className="w-4.5 h-4.5" />}
              <span>{showAddListingForm ? "Dismiss Form" : "Register Approved Property"}</span>
            </button>
          </div>

          {/* Collapsible Listing Registration Form */}
          {showAddListingForm && (
            <form onSubmit={handleAddListing} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-850 space-y-5 animate-slide-up select-none">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Building className="w-4.5 h-4.5" />
                  <span>Register Stay Product</span>
                </h3>
                <p className="text-[10px] text-gray-450 mt-0.5 font-bold">Instantly publish an approved premium property listing to the public index</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400 block">Property Title Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimalist Architectural Cliff Cabin"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400 block">Location (State/Region) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Geirangerfjord, Møre og Romsdal"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400 block">Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Norway"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400 block">Price Per Night (USD) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={10000}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-black text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400 block">Category board *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  >
                    <option value="beachfront">Beachfront beachfront</option>
                    <option value="cabins">Cabins</option>
                    <option value="mansions">Mansions</option>
                    <option value="sking">Ski Cabin</option>
                    <option value="domes">Domes</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400 block">Assigned Host Hostname</label>
                  <input
                    type="text"
                    placeholder="Host Name"
                    value={newHostName}
                    onChange={(e) => setNewHostName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-gray-400 block">Property Description</label>
                <textarea
                  placeholder="Summarize architectural elements, spectacular views, premium utilities."
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddListingForm(false)}
                  className="bg-slate-800 hover:bg-slate-750 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs px-6 py-2.5 rounded-xl text-white cursor-pointer"
                >
                  Broadcasting Stays Property
                </button>
              </div>

            </form>
          )}

          {/* Properties lists Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/10 shadow-lg">
            <table className="w-full min-w-[750px] border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-gray-400 uppercase font-black tracking-widest text-[9.5px]">
                  <th className="p-4 text-left">Property stay information</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Host Account</th>
                  <th className="p-4 text-center">Score rating</th>
                  <th className="p-4 text-center">Price per Night</th>
                  <th className="p-4 text-center">Governance State</th>
                  <th className="p-4 text-right">Emergency operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {searchedListings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-gray-550 font-extrabold select-none">
                      No matching registered accommodations stays database profiles matches query.
                    </td>
                  </tr>
                ) : (
                  searchedListings.map((listing) => {
                    const isEditing = editingListingId === listing.id;
                    const approvedFlag = listing.approved !== false;

                    return (
                      <tr key={listing.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="p-4 text-left">
                          <div className="flex items-center gap-3">
                            <img src={listing.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-950" />
                            <div className="min-w-0 max-w-sm">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editedTitle}
                                  onChange={(e) => setEditedTitle(e.target.value)}
                                  className="p-1 bg-slate-950 border border-rose-500/40 rounded text-xs font-black text-white w-full outline-none focus:border-[#FF385C]"
                                />
                              ) : (
                                <h4 className="font-extrabold text-[#FF385C] text-sm truncate">{listing.title}</h4>
                              )}

                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editedLocation}
                                  onChange={(e) => setEditedLocation(e.target.value)}
                                  className="p-1 mt-1 bg-slate-950 border border-rose-500/40 rounded text-[10px] text-gray-300 w-full outline-none focus:border-[#FF385C]"
                                />
                              ) : (
                                <span className="block text-[10.5px] text-gray-400 font-bold">{listing.location}, {listing.country}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-left font-bold capitalize">
                          {isEditing ? (
                            <select
                              value={editedCategory}
                              onChange={(e) => setEditedCategory(e.target.value)}
                              className="bg-slate-950 border border-rose-500/40 rounded p-1 text-[11px] font-bold text-white outline-none focus:border-[#FF385C]"
                            >
                              <option value="beachfront">beachfront</option>
                              <option value="cabins">cabins</option>
                              <option value="mansions">mansions</option>
                              <option value="sking">sking</option>
                              <option value="domes">domes</option>
                              <option value="trending">trending</option>
                            </select>
                          ) : (
                            <span className="bg-slate-800 border border-slate-700/50 text-[10px] text-gray-300 px-2.5 py-1 rounded font-black uppercase tracking-wider">
                              {listing.category}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-left">
                          <div className="flex items-center gap-2 select-none">
                            <img src={listing.hostAvatar} alt="" className="w-5.5 h-5.5 rounded-full shrink-0" />
                            <span className="font-extrabold text-gray-300">{listing.hostName}</span>
                          </div>
                        </td>

                        <td className="p-4 text-center font-black">
                          <div className="flex items-center justify-center gap-1 select-none">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                            <span>{listing.rating.toFixed(2)}</span>
                          </div>
                        </td>

                        <td className="p-4 text-center font-mono font-black">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-0.5">
                              <span className="text-gray-400">$</span>
                              <input
                                type="number"
                                min={10}
                                max={10000}
                                value={editedPrice}
                                onChange={(e) => setEditedPrice(Number(e.target.value))}
                                className="w-16 p-1 text-center bg-slate-950 border border-rose-500/40 rounded text-xs font-black text-rose-500"
                              />
                            </div>
                          ) : (
                            <span className="text-teal-400 text-sm font-black">${listing.pricePerNight}</span>
                          )}
                        </td>

                        {/* Approval State indicators */}
                        <td className="p-4 text-center select-none">
                          <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${approvedFlag ? 'bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/20' : 'bg-slate-800 text-gray-500'}`}>
                            {approvedFlag ? "Approved" : "Suspended"}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2.5 select-none">
                            {isEditing ? (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => saveEditedProperties(listing.id)}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                                  title="Approve changes"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingListingId(null)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-755 text-gray-300 rounded cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                {/* Suspend or Approve switch button */}
                                <button
                                  onClick={() => handleToggleListingApproval(listing.id)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[9.5px] font-black transition cursor-pointer border ${approvedFlag ? 'bg-slate-800 hover:bg-slate-750 text-gray-300 border-slate-700/60' : 'bg-[#FF385C] hover:bg-[#E61E4D] text-white border-transparent'}`}
                                >
                                  {approvedFlag ? "Suspend" : "Authorize"}
                                </button>

                                <button
                                  onClick={() => startEditingProperties(listing)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
                                  title="Edit properties config"
                                >
                                  <Settings className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleRemoveListing(listing.id)}
                                  className="p-1.5 hover:bg-rose-950 text-gray-500 hover:text-rose-500 transition-colors cursor-pointer"
                                  title="Purge listings completely"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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

      {/* 4. PRODUCTS & ADD-ONS SERVICES CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl select-none">
            <div className="relative bg-slate-950 border border-slate-850 flex items-center pr-3 py-1 rounded-xl w-full md:max-w-md">
              <Search className="w-4 h-4 text-gray-450 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search premium service products, tours, rentals..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-white placeholder-gray-500 outline-none"
              />
              {productSearch && (
                <button onClick={() => setProductSearch('')} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowAddProductForm(!showAddProductForm)}
              className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              {showAddProductForm ? <X className="w-4.5 h-4.5" /> : <PlusCircle className="w-4.5 h-4.5" />}
              <span>{showAddProductForm ? "Dismiss Form" : "Register Upsell Product"}</span>
            </button>
          </div>

          {/* Add Product form */}
          {showAddProductForm && (
            <form onSubmit={handleAddProduct} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-850 space-y-4 animate-slide-up select-none">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Package className="w-4.5 h-4.5" />
                  <span>Register Service Product</span>
                </h3>
                <p className="text-[10px] text-gray-450 mt-0.5 font-bold">Standardize exclusive travel packages, rentals or amenities checkable by travelers</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400">Exclusive Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Private Volcanic Spa Session"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400">Fixed Package Price (USD) *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={10000}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-black text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400">Add-on Classification Category</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  >
                    <option value="Wellness">Wellness</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Dining">Dining</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Rental">Rental</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-gray-400 block">Product Package offering Description</label>
                <textarea
                  required
                  placeholder="Detail transport logistics, duration of activities or catered benefits..."
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductForm(false)}
                  className="bg-slate-800 hover:bg-slate-750 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 font-black text-xs px-6 py-2.5 rounded-xl text-white cursor-pointer"
                >
                  Publish Upsell Service
                </button>
              </div>
            </form>
          )}

          {/* Catalog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedProducts.map((p) => {
              const isActive = p.status === 'Active';
              return (
                <div key={p.id} className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="bg-slate-800 border border-slate-700/50 text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md text-gray-300">
                        {p.category}
                      </span>
                      <span className={`text-[10.5px] font-black uppercase tracking-wider ${isActive ? 'text-emerald-400' : 'text-gray-500'}`}>
                        ● {p.status}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white mt-3 leading-tight truncate">{p.name}</h4>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1.5 leading-relaxed line-clamp-3 min-h-[50px]">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div className="text-left select-none">
                      <span className="text-[9px] uppercase text-gray-400 font-black tracking-wider block">Package pricing</span>
                      <span className="text-[#FF385C] font-mono text-base font-black block">${p.price} <span className="text-[10px] text-gray-500">/ session</span></span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleProductStatus(p.id)}
                        className={`text-[9.5px] font-black px-2.5 py-1.5 rounded-lg border cursor-pointer ${isActive ? 'bg-slate-900 border-slate-850 text-gray-400 hover:bg-slate-800' : 'bg-emerald-950 text-emerald-400 border-emerald-900'}`}
                      >
                        {isActive ? "Disable" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(p.id)}
                        className="p-1.5 text-gray-500 hover:text-[#FF385C] transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 5. USER ACCOUNTS & PRIVILEGE ROLES MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl select-none">
            <div className="relative bg-slate-950 border border-slate-850 flex items-center pr-3 py-1 rounded-xl w-full md:max-w-md">
              <Search className="w-4 h-4 text-gray-455 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search registered user databases by realname, email address..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-white placeholder-gray-500 outline-none"
              />
              {userSearch && (
                <button onClick={() => setUserSearch('')} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowAddUserForm(!showAddUserForm)}
              className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              {showAddUserForm ? <X className="w-4.5 h-4.5" /> : <PlusCircle className="w-4.5 h-4.5" />}
              <span>{showAddUserForm ? "Dismiss Form" : "Add New Account profile"}</span>
            </button>
          </div>

          {/* Add user profile forms */}
          {showAddUserForm && (
            <form onSubmit={handleAddUser} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-850 space-y-4 animate-slide-up select-none">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Plus className="w-4.5 h-4.5" />
                  <span>Register User Account</span>
                </h3>
                <p className="text-[10px] text-gray-450 mt-0.5 font-bold">Declare certified credentials, access codes and user security hierarchies manually</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400">User Nickname/Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400">Contact Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. johndoe@hostnet.net"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400">Role Privilege assignment</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#FF385C]"
                  >
                    <option value="Guest">Guest Account</option>
                    <option value="Host">Host Account</option>
                    <option value="Moderator">Moderator Privileges</option>
                    <option value="Admin">Full Root Admin</option>
                  </select>
                </div>

              </div>

              <div className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  id="user-verified-chk"
                  checked={newUserVerified}
                  onChange={(e) => setNewUserVerified(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-805 text-rose-500 accent-[#FF385C] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="user-verified-chk" className="text-xs text-gray-300 font-bold cursor-pointer">Verify identity automatically (Apply Approved Identity Badge)</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="bg-slate-800 hover:bg-slate-750 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 font-black text-xs px-6 py-2.5 rounded-xl text-white cursor-pointer"
                >
                  Create verified profile
                </button>
              </div>
            </form>
          )}

          {/* User List grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedUsers.map((user) => {
              const isAdmin = user.role === 'Admin';
              const isMod = user.role === 'Moderator';
              const isHostSec = user.role === 'Host';

              return (
                <div key={user.id} className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3 select-none">
                        <img 
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
                          className="w-12 h-12 bg-slate-950 rounded-full object-cover ring-2 ring-slate-800" 
                          alt="" 
                        />
                        <div className="text-left">
                          <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.verified && <UserCheck className="w-4 h-4 text-emerald-400" title="Identity Checked & Approved" />}
                          </h4>
                          <span className="text-[10px] text-gray-450 font-bold block">{user.email}</span>
                        </div>
                      </div>

                      <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        user.verified ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-slate-800 text-gray-500 border border-slate-700/30'
                      }`}>
                        {user.verified ? 'Verified ID' : 'Unchecked ID'}
                      </span>
                    </div>

                    {/* Quick stats and details */}
                    <div className="grid grid-cols-2 gap-2.5 mt-4 p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs font-semibold select-none">
                      <div>
                        <span className="text-gray-500 text-[9px] uppercase font-black block">Authority Role</span>
                        <span className="text-white mt-0.5 block font-bold">
                          {user.role}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[9px] uppercase font-black block">Registry</span>
                        <span className="text-gray-450 mt-0.5 block font-bold">
                          {user.joins}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions segment dropdown */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div className="w-1/2 select-none">
                      <span className="text-[8.5px] font-black uppercase text-gray-500 block mb-1">Set Account Role</span>
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 text-[10.5px] font-extrabold text-gray-300 rounded p-1 outline-none focus:border-[#FF385C] cursor-pointer"
                      >
                        <option value="Guest">Guest</option>
                        <option value="Host">Host</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 select-none leading-none">
                      <button
                        onClick={() => handleToggleUserVerification(user.id)}
                        className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg border cursor-pointer ${user.verified ? 'bg-slate-900 border-slate-800 text-gray-400' : 'bg-emerald-950 text-emerald-400 border-emerald-900'}`}
                      >
                        {user.verified ? "Revoke ID" : "Approve ID"}
                      </button>

                      {user.email !== 'ahad90194@gmail.com' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 px-1.5 bg-slate-900 border border-slate-800 hover:border-rose-500/30 text-gray-500 hover:text-[#FF385C] rounded-lg transition"
                          title="Purge user database profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
