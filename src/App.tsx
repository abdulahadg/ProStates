/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Globe,
  Grid,
  Menu,
  User,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  Compass,
  Tent,
  Home,
  Trees,
  Building,
  Mountain,
  Waves,
  Sun,
  Moon,
  X,
  Plus,
  Minus,
  Check,
  MapPin,
  Calendar,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Award,
  Shield,
  Clock,
  ArrowUp,
  Map,
  BadgeDollarSign
} from 'lucide-react';
import { Category, Listing, SearchFilters, FilterOptions, Booking } from './types';
import { categories, listings, inspirationDestinations } from './data';
import LoginSignup from './components/LoginSignup';
import AirbnbYourHome from './components/AirbnbYourHome';
import HelpCenter from './components/HelpCenter';
import MyTrips from './components/MyTrips';
import HostInbox from './components/HostInbox';
import UserProfile from './components/UserProfile';
import AdminPanel from './components/AdminPanel';

const bannerSlides = [
  {
    id: 'treehouses',
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    badge: "Special Summer Launch",
    title: "Go wild.\nStay original.",
    text: "Step out of normal patterns. Explore luxury treehouses, isolated geodesic desert domes, and historical castles.",
    buttonText: "Explore Treehouses",
    category: "treehouses"
  },
  {
    id: 'beachfront',
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    badge: "Premium Coastal Living",
    title: "Sun-kissed days.\nCoastal dreams.",
    text: "Wake up to the sound of breaking waves. Experience pristine white sand beaches and beachfront luxury villas.",
    buttonText: "Explore Beachfront",
    category: "beachfront"
  },
  {
    id: 'cabins',
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=80",
    badge: "Mountain Cabin Retreats",
    title: "Elevated stays.\nSilent peaks.",
    text: "Nestle into luxury log cabins, peak chalets, and private high-altitude viewpoints with warm stone firepits.",
    buttonText: "Explore Cabins",
    category: "cabins"
  },
  {
    id: 'amazing-views',
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
    badge: "Limitless Vantage Collection",
    title: "Endless sightlines.\nLimitless skies.",
    text: "Bask in spectacular ocean cliffs, desert canyons, and sky-high penthouse vistas designed for ultimate wonders.",
    buttonText: "Explore Amazing Views",
    category: "amazing-views"
  }
];

export default function App() {
  // Global App States
  const [allListings, setAllListings] = useState<Listing[]>(listings);
  const [activeView, setActiveView] = useState<'home' | 'hosting' | 'help-center' | 'trips' | 'inbox' | 'profile' | 'admin'>('home');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar?: string } | null>(() => {
    const saved = localStorage.getItem('airbnb_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check localStorage or system theme defaults
    const saved = localStorage.getItem('airbnb_dark_mode');
    return saved ? saved === 'true' : false;
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('airbnb_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Search expanding panel states
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const [searchTab, setSearchTab] = useState<'where' | 'dates' | 'guests'>('where');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    destination: '',
    startDate: '',
    endDate: '',
    guests: { adults: 1, children: 0, infants: 0, pets: 0 }
  });

  // Filter Drawer State
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>({
    maxPrice: 1500,
    minRating: 4.8,
    propertyType: 'any',
    hasWifi: false,
    hasPool: false,
    hasAirConditioning: false
  });
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    maxPrice: 2500,
    minRating: 0,
    propertyType: 'any',
    hasWifi: false,
    hasPool: false,
    hasAirConditioning: false
  });

  // Selected Listing Detail Modal State
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bookingGuests, setBookingGuests] = useState<{adults: number, children: number}>({ adults: 2, children: 0 });
  const [bookingStartDate, setBookingStartDate] = useState<string>('2026-06-15');
  const [bookingEndDate, setBookingEndDate] = useState<string>('2026-06-20');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successConfetti, setSuccessConfetti] = useState<boolean>(false);

  // New persistent Bookings structure
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('airbnb_current_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const bookingNights = useMemo(() => {
    const start = new Date(bookingStartDate);
    const end = new Date(bookingEndDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
  }, [bookingStartDate, bookingEndDate]);

  // Active Profile Dropdown Menu
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Toggle state between default listings grid and interactive map view
  const [showMapView, setShowMapView] = useState<boolean>(false);
  const [selectedMapListing, setSelectedMapListing] = useState<Listing | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(1);

  // Carousel Indexes state (to maintain separate slide indexes per listing)
  const [carouselIndexes, setCarouselIndexes] = useState<{ [key: number]: number }>({});

  // Active Campaign Hero Slide State
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // UseEffect to automatically rotate through Hero Banner slides every 7 seconds
  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 7000);
    return () => clearInterval(sliderTimer);
  }, []);

  // Active Inspiration Sub-Tab State
  const [activeInspirationTab, setActiveInspirationTab] = useState<string>("Weekend Getaways");

  // Scroll visibility triggers for categories
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // DOM Refs
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Monitor category scrollbar boundaries for fading indicators and buttons
  useEffect(() => {
    const scroller = categoryScrollRef.current;
    if (!scroller) return;

    const handleScrollUpdate = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    };

    handleScrollUpdate();
    scroller.addEventListener('scroll', handleScrollUpdate);
    window.addEventListener('resize', handleScrollUpdate);

    // Initial check after everything finishes rendering
    const timer = setTimeout(handleScrollUpdate, 600);

    return () => {
      scroller.removeEventListener('scroll', handleScrollUpdate);
      window.removeEventListener('resize', handleScrollUpdate);
      clearTimeout(timer);
    };
  }, []);

  // Setup listeners for dark mode, scrolling, and clicks outside profile menu
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('airbnb_dark_mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
      // Collapse expanded search bar on scroll
      if (window.scrollY > 60) {
        setIsSearchExpanded(false);
      }
    };

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        // Only collapse if they didn't click inside an open dialog or calendar
        const target = e.target as HTMLElement;
        if (!target.closest('.search-expansion-panel')) {
          setIsSearchExpanded(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync wishlist elements to localStorage
  useEffect(() => {
    localStorage.setItem('airbnb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync user profile state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('airbnb_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('airbnb_current_user');
    }
  }, [currentUser]);

  // Sync bookings data state
  useEffect(() => {
    localStorage.setItem('airbnb_current_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Handle category changes with premium simulated loading animations
  const handleCategorySelect = (categoryId: string) => {
    if (activeCategory === categoryId && !showWishlistOnly) return;
    setIsLoading(true);
    setActiveCategory(categoryId);
    setShowWishlistOnly(false); // Default back to category
    setTimeout(() => {
      setIsLoading(false);
    }, 550); // Fluid loading transition
  };

  const handleWishlistToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Avoid triggering details modal
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Carousel navigation inside a listing card
  const navigateCarousel = (e: React.MouseEvent, listingId: number, direction: 'prev' | 'next', maxImages: number) => {
    e.stopPropagation(); // Avoid triggering details modal
    const currentIndex = carouselIndexes[listingId] || 0;
    let nextIndex = currentIndex;
    if (direction === 'prev') {
      nextIndex = currentIndex === 0 ? maxImages - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex === maxImages - 1 ? 0 : currentIndex + 1;
    }
    setCarouselIndexes(prev => ({ ...prev, [listingId]: nextIndex }));
  };

  // Category Bar Scrolling triggers
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Filters computed output
  const filteredListings = useMemo(() => {
    return allListings.filter(item => {
      // Wishlist selection
      if (showWishlistOnly && !wishlist.includes(item.id)) return false;

      // Category match
      if (!showWishlistOnly && activeCategory !== 'all' && item.category !== activeCategory) return false;

      // Search destination match (simple string search)
      if (searchFilters.destination) {
        const query = searchFilters.destination.toLowerCase();
        const matchesDest = item.location.toLowerCase().includes(query) || item.country.toLowerCase().includes(query);
        if (!matchesDest) return false;
      }

      // Guest requirements math
      const totalRequestedGuests = searchFilters.guests.adults + searchFilters.guests.children;
      if (totalRequestedGuests > item.maxGuests) return false;

      // Detailed filters modal limits
      if (item.pricePerNight > activeFilters.maxPrice) return false;
      if (activeFilters.minRating > 0 && item.rating < activeFilters.minRating) return false;
      if (activeFilters.propertyType !== 'any') {
        if (activeFilters.propertyType === 'cabin' && item.category !== 'cabins') return false;
        if (activeFilters.propertyType === 'mansion' && item.category !== 'mansions') return false;
        if (activeFilters.propertyType === 'beach' && item.category !== 'beachfront') return false;
      }
      if (activeFilters.hasWifi && !item.amenities.includes('High-speed Wifi')) return false;
      if (activeFilters.hasPool && !item.amenities.includes('Private Pool') && !item.amenities.includes('Infinity Pool Balcony') && !item.amenities.includes('Heated Pool & Lounges')) return false;
      if (activeFilters.hasAirConditioning && !item.amenities.includes('Air Conditioning') && !item.amenities.includes('A/C & Wifi')) return false;

      return true;
    });
  }, [allListings, activeCategory, wishlist, showWishlistOnly, searchFilters, activeFilters]);

  // Open Full Listing Modal Details
  const handleOpenDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setBookingGuests({ adults: 2, children: 0 });
    setBookingStartDate('2026-06-15');
    setBookingEndDate('2026-06-20');
  };

  // Booking calculations
  const priceCalculation = useMemo(() => {
    if (!selectedListing) return { raw: 0, cleaning: 0, service: 0, total: 0 };
    const raw = selectedListing.pricePerNight * bookingNights;
    const cleaning = Math.ceil(selectedListing.pricePerNight * 0.15);
    const service = Math.ceil(selectedListing.pricePerNight * 0.11 * bookingNights);
    return {
      raw,
      cleaning,
      service,
      total: raw + cleaning + service
    };
  }, [selectedListing, bookingNights]);

  const handleReserve = () => {
    if (!selectedListing) return;

    const newBooking: Booking = {
      id: 'bk_' + Math.random().toString(36).substr(2, 9),
      listingId: selectedListing.id,
      listingTitle: selectedListing.title,
      listingLocation: selectedListing.location + ', ' + selectedListing.country,
      listingImage: selectedListing.images[0],
      startDate: bookingStartDate,
      endDate: bookingEndDate,
      guestsCount: bookingGuests.adults + bookingGuests.children,
      totalPaid: priceCalculation.total,
      checkInCode: Math.floor(100000 + Math.random() * 900000).toString(),
      wifiPassword: 'stay-relax-' + Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'active',
      bookedAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    setShowSuccessModal(false);
    setShowSuccessModal(true);
    setSuccessConfetti(true);
    setTimeout(() => {
      setSuccessConfetti(false);
    }, 4000); // end confetti
  };

  // Helper mapping string icon names to Lucide elements
  const renderCategoryIcon = (iconName: string, active: boolean) => {
    const cls = `w-6 h-6 mb-2 transition-all duration-300 ease-out ${active ? 'text-black dark:text-white scale-110 -translate-y-0.5' : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:scale-110 group-hover:-translate-y-1'}`;
    switch (iconName) {
      case 'Waves': return <Waves className={cls} />;
      case 'Mountain': return <Mountain className={cls} />;
      case 'Building': return <Building className={cls} />;
      case 'Home': return <Home className={cls} />;
      case 'Sun': return <Sun className={cls} />;
      case 'Trees': return <Trees className={cls} />;
      case 'Globe': return <Globe className={cls} />;
      case 'Tent': return <Tent className={cls} />;
      case 'Sparkles': return <Sparkles className={cls} />;
      default: return <Compass className={cls} />;
    }
  };

  // Reset filters inside Modal
  const handleResetFilters = () => {
    setTempFilters({
      maxPrice: 1500,
      minRating: 0,
      propertyType: 'any',
      hasWifi: false,
      hasPool: false,
      hasAirConditioning: false
    });
  };

  // Apply filters from Modal
  const handleApplyFilters = () => {
    setActiveFilters({ ...tempFilters });
    setShowFilterModal(false);
    // Trigger quick loading effect as feedback
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 450);
  };

  // Increment/Decrement helper for guests
  const modifyGuestCount = (type: 'adults' | 'children' | 'infants' | 'pets', value: 'add' | 'sub') => {
    setSearchFilters(prev => {
      const current = prev.guests[type];
      let updated = current;
      if (value === 'add') updated = current + 1;
      else if (value === 'sub' && current > 0) {
        // Adult limit minimum of 1
        if (type === 'adults' && current === 1) updated = 1;
        else updated = current - 1;
      }
      return {
        ...prev,
        guests: { ...prev.guests, [type]: updated }
      };
    });
  };

  const activeInspirationItems = useMemo(() => {
    const found = inspirationDestinations.find(group => group.tab === activeInspirationTab);
    return found ? found.items : [];
  }, [activeInspirationTab]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-white text-gray-800'}`}>
      
      {/* 1. STICKY NAVIGATION BAR */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-slate-900/95 shadow-md py-3 border-b border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-slate-900 py-5 border-b border-gray-100 dark:border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer" onClick={() => {
            setActiveView('home');
            setActiveCategory('all');
            setShowWishlistOnly(false);
            setSearchFilters({ destination: '', startDate: '', endDate: '', guests: { adults: 1, children: 0, infants: 0, pets: 0 } });
          }}>
            {/* Custom SVG reflecting accurate classic Airbnb icon layout */}
            <svg viewBox="0 0 32 32" className="w-10 h-10 text-[#FF385C] fill-current animate-pulse-slow font-bold" aria-hidden="true" focusable="false">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533.982c.195.367.388.757.58 1.167L24 10.5c.343.767.652 1.559.92 2.378H23c-.34 0-.671.042-.988.12l-.4-.95c-.244-.575-.521-1.125-.826-1.645L19 7c-1.103-1.897-2.103-2.585-3-2.585s-1.897.688-3 2.585l-1.786 3.403c-.305.52-.582 1.07-.826 1.645l-.4.95c-.317-.078-.648-.12-.988-.12h-1.92c.268-.819.577-1.611.92-2.378l2.136-4.082c.192-.41.385-.8.58-1.167l.533-.982C12.537 1.963 13.992 1 16 1zm0 2c-1.397 0-2.353.646-3.411 2.535l-.545 1.008c-.168.32-.338.663-.508 1.026L10 11.5l1.096.002.433-.915c.29-.614.619-1.2.983-1.751L14.7 5c.421-.723.774-1 1.3-1s.879.277 1.3 1l2.188 3.836c.364.551.693 1.137.983 1.751l.433.915h1.096M16 28c-.801 0-1.574-.354-2.285-1.041a13.36 13.36 0 0 1-2.073-2.618L10 21.5l1.096.002c1.7 0 2.235-.494 2.898-1.558l1.451-2.42c.321-.532.656-.967 1.1-1c.444.033.779.468 1.1 1l1.451 2.42c.663 1.064 1.198 1.558 2.898 1.558H22l-1.642 2.841a13.36 13.36 0 0 1-2.073 2.618C17.574 27.646 16.801 28 16 28zm0 2c1.439 0 2.812-.588 3.991-1.74a15.353 15.353 0 0 0 2.495-3.351L24.5 21ac-.343 0-.671.042-.988.12l-.4.95c-.244.575-.521 1.125-.826 1.645L20.5 27c-1.103 1.897-2.103 2.585-3 2.585s-1.897-.688-3-2.585l-1.786-3.403a11.122 11.122 0 0 1-.826-1.645l-.4-.95c-.317-.078-.648-.12-.988-.12l2.014 3.759a15.35 15.35 0 0 0 2.495 3.351C13.188 29.412 14.561 30 16 30z"/>
            </svg>
            <span className="hidden md:inline-block ml-2 text-xl font-extrabold tracking-tight text-[#FF385C]">
              airbnb
            </span>
          </div>

          {/* Centered Search Bar */}
          <div ref={searchBarRef} className="relative max-w-lg w-full mx-4 hidden sm:block">
            <div 
              onClick={() => setIsSearchExpanded(true)}
              className={`flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-full py-2 pl-6 pr-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 ${isSearchExpanded ? 'scale-105 border-transparent ring-2 ring-[#FF385C]' : ''}`}
            >
              <div className="flex divide-x divide-gray-200 dark:divide-gray-700 text-xs font-semibold select-none flex-1 truncate">
                <span className="text-gray-800 dark:text-gray-100 pr-4 truncate">
                  {searchFilters.destination || 'Anywhere'}
                </span>
                <span className="text-gray-800 dark:text-gray-100 px-4 whitespace-nowrap">
                  {searchFilters.startDate ? `${searchFilters.startDate.substring(5)} – ${searchFilters.endDate.substring(5)}` : 'Any week'}
                </span>
                <span className="text-gray-500 dark:text-gray-400 px-4 whitespace-nowrap">
                  {searchFilters.guests.adults + searchFilters.guests.children > 1 
                    ? `${searchFilters.guests.adults + searchFilters.guests.children} guests` 
                    : 'Add guests'}
                </span>
              </div>
              <button className="bg-[#FF385C] text-white p-2.5 rounded-full hover:bg-[#e62e50] active:scale-95 transition-all duration-200">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* EXPANDED DETAILED CALENDAR & GUEST POPUP BOX */}
            {isSearchExpanded && (
              <div className="search-expansion-panel absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] sm:w-[560px] bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-slide-up z-50">
                
                {/* Search Menu Headers */}
                <div className="flex justify-around border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
                  <button 
                    onClick={() => setSearchTab('where')}
                    className={`pb-1 text-sm font-bold transition-all relative ${searchTab === 'where' ? 'text-[#FF385C] dark:text-[#FF385C]' : 'text-gray-500 dark:text-white hover:dark:text-[#FF385C]'}`}
                  >
                    Where to
                    {searchTab === 'where' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF385C] rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setSearchTab('dates')}
                    className={`pb-1 text-sm font-bold transition-all relative ${searchTab === 'dates' ? 'text-[#FF385C] dark:text-[#FF385C]' : 'text-gray-500 dark:text-white hover:dark:text-[#FF385C]'}`}
                  >
                    When / Dates
                    {searchTab === 'dates' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF385C] rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setSearchTab('guests')}
                    className={`pb-1 text-sm font-bold transition-all relative ${searchTab === 'guests' ? 'text-[#FF385C] dark:text-[#FF385C]' : 'text-gray-500 dark:text-white hover:dark:text-[#FF385C]'}`}
                  >
                    Who / Guests
                    {searchTab === 'guests' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF385C] rounded-full" />}
                  </button>
                </div>

                {/* Tab: WHERE TO */}
                {searchTab === 'where' && (
                  <div className="space-y-4 animate-fade-in">
                    <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-500 dark:text-gray-200">Search Destinations</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="Search country, state, or city (e.g., California, Kyoto)"
                        value={searchFilters.destination}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, destination: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-slate-700/55 border border-gray-200 dark:border-gray-650 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF385C] text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                      />
                    </div>
                    {/* Quick Regions Selector */}
                    <div className="pt-2">
                      <span className="block text-xs font-bold text-gray-500 dark:text-gray-200 mb-2">Popular regions</span>
                      <div className="grid grid-cols-3 gap-3">
                        {['California', 'France', 'Japan', 'Iceland', 'Italy', 'Bali'].map((region) => (
                          <button
                            key={region}
                            onClick={() => setSearchFilters(prev => ({ ...prev, destination: region }))}
                            className={`p-3 text-xs font-bold rounded-xl text-left border transition-all ${searchFilters.destination === region ? 'border-[#FF385C] bg-[#FF385C]/15 text-[#FF385C]' : 'border-gray-200 dark:border-gray-650 bg-white dark:bg-slate-700/40 text-black dark:text-gray-200 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-black dark:hover:text-white'}`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: DATES */}
                {searchTab === 'dates' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-gray-500 dark:text-gray-200 mb-1.5">Check-In</label>
                        <div className="relative">
                          <input 
                            type="date"
                            value={searchFilters.startDate}
                            onChange={(e) => setSearchFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full bg-gray-50 dark:bg-slate-700/55 border border-gray-200 dark:border-gray-650 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF385C] text-gray-800 dark:text-white dark:[color-scheme:dark]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-gray-500 dark:text-gray-200 mb-1.5">Check-Out</label>
                        <div className="relative">
                          <input 
                            type="date"
                            value={searchFilters.endDate}
                            onChange={(e) => setSearchFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full bg-gray-50 dark:bg-slate-700/55 border border-gray-200 dark:border-gray-650 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF385C] text-gray-800 dark:text-white dark:[color-scheme:dark]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/20 text-[#FF385C] p-3 rounded-xl text-xs font-medium mt-2">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Enjoy flexible dates with our top-tier curated cabins.</span>
                    </div>
                  </div>
                )}

                {/* Tab: GUESTS */}
                {searchTab === 'guests' && (
                  <div className="space-y-4 animate-fade-in divide-y divide-gray-100 dark:divide-gray-700">
                    
                    {/* Adults line */}
                    <div className="flex items-center justify-between py-1 pt-2">
                      <div>
                        <span className="block text-sm font-bold text-gray-800 dark:text-gray-100">Adults</span>
                        <span className="block text-xs text-gray-500">Age 13 or above</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => modifyGuestCount('adults', 'sub')}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition-all text-gray-600 dark:text-gray-300 active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">{searchFilters.guests.adults}</span>
                        <button
                          onClick={() => modifyGuestCount('adults', 'add')}
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition-all text-gray-600 dark:text-gray-300 active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Children line */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="block text-sm font-bold text-gray-800 dark:text-gray-100">Children</span>
                        <span className="block text-xs text-gray-500">Ages 2 – 12</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => modifyGuestCount('children', 'sub')}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition-all text-gray-600 dark:text-gray-300 active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">{searchFilters.guests.children}</span>
                        <button
                          onClick={() => modifyGuestCount('children', 'add')}
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition-all text-gray-600 dark:text-gray-300 active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pets line */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="block text-sm font-bold text-gray-800 dark:text-gray-100">Pets</span>
                        <span className="block text-xs text-gray-500">Bringing a service animal?</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => modifyGuestCount('pets', 'sub')}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition-all text-gray-600 dark:text-gray-300 active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">{searchFilters.guests.pets}</span>
                        <button
                          onClick={() => modifyGuestCount('pets', 'add')}
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition-all text-gray-600 dark:text-gray-300 active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* Quick Action Footer inside search panel */}
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                  <button 
                    onClick={() => {
                      setSearchFilters({
                        destination: '',
                        startDate: '',
                        endDate: '',
                        guests: { adults: 1, children: 0, infants: 0, pets: 0 }
                      });
                      setIsSearchExpanded(false);
                    }}
                    className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white underline"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => setIsSearchExpanded(false)}
                    className="flex items-center gap-1 bg-[#FF385C] hover:bg-[#e62e50] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search Properties
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Right Action Menu: Host, Language, User Dropdown */}
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => {
                setActiveView('hosting');
                setIsSearchExpanded(false);
              }}
              className="hidden lg:inline-block text-sm font-semibold px-4 py-2.5 rounded-full transition-all text-gray-800 hover:text-black dark:text-gray-100 dark:hover:text-black hover:bg-white dark:hover:bg-white border border-transparent hover:border-gray-200 dark:hover:border-transparent hover:shadow-sm cursor-pointer"
            >
              Airbnb your home
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 hover:bg-gray-150 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-gray-300 transition-all active:scale-90"
              aria-label="Toggle dark mode"
              id="theme-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile Menu Trigger */}
            <div ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all py-1.5 pl-3 pr-1.5 rounded-full bg-white dark:bg-slate-800 cursor-pointer"
                id="user-menu-button"
              >
                <Menu className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  {currentUser ? (
                    currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{currentUser.name.substring(0, 2)}</span>
                    )
                  ) : (
                    <User className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Profile Dropdown Box */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2.5 z-50 text-sm font-medium animate-slide-up">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 text-left">
                        <span className="block text-[10px] uppercase font-black text-rose-500 tracking-wider">Welcome Back</span>
                        <span className="text-xs font-black text-slate-950 dark:text-white truncate block mt-0.5">{currentUser.name}</span>
                        <span className="text-[10px] text-gray-400 truncate block font-medium">{currentUser.email}</span>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1.5" />
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setShowAuthModal(true);
                          setAuthModalTab('signup');
                          setShowProfileMenu(false);
                        }} 
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 font-bold text-[#FF385C]"
                      >
                        Sign up
                      </button>
                      <button 
                        onClick={() => {
                          setShowAuthModal(true);
                          setAuthModalTab('login');
                          setShowProfileMenu(false);
                        }} 
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
                      >
                        Log in
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1.5" />
                    </>
                  )}
                  
                  <button 
                    onClick={() => {
                      setActiveView('home');
                      setShowWishlistOnly(prev => !prev);
                      setShowProfileMenu(false);
                      setIsSearchExpanded(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-between font-semibold"
                  >
                    <span>{showWishlistOnly ? "Show All Listings" : "My Wishlist ❤️"}</span>
                    {wishlist.length > 0 && <span className="bg-[#FF385C] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{wishlist.length}</span>}
                  </button>

                  <button 
                    onClick={() => {
                      setActiveView('trips');
                      setShowProfileMenu(false);
                      setIsSearchExpanded(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-between font-semibold"
                  >
                    <span>My Booked Trips ✈️</span>
                    {bookings.length > 0 && <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{bookings.length}</span>}
                  </button>

                  <button 
                    onClick={() => {
                      setActiveView('inbox');
                      setShowProfileMenu(false);
                      setIsSearchExpanded(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-between font-semibold"
                  >
                    <span>Messages Inbox 💬</span>
                    <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">2</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveView('profile');
                      setShowProfileMenu(false);
                      setIsSearchExpanded(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold"
                  >
                    My Account Profile 👤
                  </button>
                  
                  <button 
                    onClick={() => {
                      setActiveView('hosting');
                      setShowProfileMenu(false);
                      setIsSearchExpanded(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold"
                  >
                    Airbnb your home
                  </button>
                  
                  <button 
                    onClick={() => {
                      setActiveView('help-center');
                      setShowProfileMenu(false);
                      setIsSearchExpanded(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold"
                  >
                    Help Center
                  </button>

                  <button 
                    onClick={() => {
                      setActiveView('admin');
                      setShowProfileMenu(false);
                      setIsSearchExpanded(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-rose-500 font-extrabold flex items-center justify-between border-t border-gray-100 dark:border-gray-700 mt-1.5 pt-2"
                  >
                    <span>Admin Control Panel ⚡</span>
                  </button>

                  {currentUser && (
                    <>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1.5" />
                      <button 
                        onClick={() => {
                          setCurrentUser(null);
                          setShowProfileMenu(false);
                        }} 
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-rose-500 font-bold"
                      >
                        Log out
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile search bar layout */}
        <div className="sm:hidden px-4 pt-3 flex items-center gap-3">
          <div 
            onClick={() => {
              setIsSearchExpanded(true);
              setSearchTab('where');
            }}
            className="flex-1 flex items-center gap-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-full py-2.5 px-4 shadow-sm"
          >
            <Search className="w-4.5 h-4.5 text-[#FF385C]" />
            <div className="flex flex-col text-xs text-left">
              <span className="font-bold text-gray-800 dark:text-gray-100">Where to?</span>
              <span className="text-gray-400">Anywhere • Any week • Add guests</span>
            </div>
          </div>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="group p-3 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white rounded-full bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-55 dark:hover:bg-slate-750 active:scale-90"
            id="mobile-filters-trigger"
            aria-label="Filters"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-[#FF385C] transition-colors duration-300"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <circle cx="8" cy="6" r="2" className="transition-all duration-500 ease-out group-hover:translate-x-[4px] group-hover:stroke-[#FF385C] group-hover:fill-[#FF385C]" />

              <line x1="4" y1="12" x2="20" y2="12" />
              <circle cx="16" cy="12" r="2" className="transition-all duration-500 ease-out group-hover:translate-x-[-6px] group-hover:stroke-[#FF385C] group-hover:fill-[#FF385C]" />

              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="10" cy="18" r="2" className="transition-all duration-500 ease-out group-hover:translate-x-[5px] group-hover:stroke-[#FF385C] group-hover:fill-[#FF385C]" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Header Space Spacer (Nav pushes normal page content down) */}
      <div className="h-24 sm:h-28" />

      {activeView === 'hosting' && (
        <div className="animate-fade-in">
          <AirbnbYourHome 
            onClose={() => setActiveView('home')} 
            categories={categories} 
            allListings={allListings}
            onDeleteListing={(listingId) => {
              setAllListings(prev => prev.filter(l => l.id !== listingId));
            }}
            onPublishListing={(newListing) => {
              setAllListings(prev => [newListing, ...prev]);
              setActiveCategory('all');
              setActiveView('home');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }} 
          />
        </div>
      )}

      {activeView === 'help-center' && (
        <div className="animate-fade-in">
          <HelpCenter onClose={() => setActiveView('home')} />
        </div>
      )}

      {activeView === 'trips' && (
        <div className="animate-fade-in">
          <MyTrips 
            bookings={bookings} 
            onCancelBooking={(id) => {
              setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
            }}
            onClose={() => setActiveView('home')} 
          />
        </div>
      )}

      {activeView === 'inbox' && (
        <div className="animate-fade-in">
          <HostInbox 
            onClose={() => setActiveView('home')} 
            bookings={bookings}
            allListings={allListings}
          />
        </div>
      )}

      {activeView === 'profile' && (
        <div className="animate-fade-in">
          <UserProfile 
            onClose={() => setActiveView('home')} 
            currentUser={currentUser}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              if (updated) {
                localStorage.setItem('airbnb_current_user', JSON.stringify(updated));
              } else {
                localStorage.removeItem('airbnb_current_user');
              }
            }}
          />
        </div>
      )}

      {activeView === 'admin' && (
        <div className="animate-fade-in">
          <AdminPanel 
            onClose={() => setActiveView('home')} 
            listings={allListings}
            bookings={bookings}
            onUpdateListings={(updatedListings) => setAllListings(updatedListings)}
            onUpdateBookings={(updatedBookings) => setBookings(updatedBookings)}
            currentUser={currentUser}
          />
        </div>
      )}

      {activeView === 'home' && (
        <>
          {/* 2. HERO SPLASH MARKETING BANNER (Classic campaigns with professional animations) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8" id="hero-marketing-campaigns">
        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] bg-slate-950 group">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Hero background image */}
              <img 
                src={bannerSlides[currentSlide].image}
                alt={bannerSlides[currentSlide].title}
                className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-1000 scale-102"
              />
              {/* Soft color overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex items-center" />
            </motion.div>
          </AnimatePresence>

          {/* Banner content */}
          <div className="absolute left-6 sm:left-12 inset-y-0 flex flex-col justify-center max-w-lg text-white pr-4 z-10 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-3 sm:space-y-4 pointer-events-auto"
              >
                <span className="inline-flex items-center gap-1.5 bg-[#FF385C] text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  {bannerSlides[currentSlide].badge}
                </span>
                
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight whitespace-pre-line">
                  {bannerSlides[currentSlide].title}
                </h1>
                
                <p className="text-xs sm:text-sm md:text-base text-gray-200 max-w-md line-clamp-2">
                  {bannerSlides[currentSlide].text}
                </p>
                
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      const catId = bannerSlides[currentSlide].category;
                      setActiveCategory(catId);
                      handleCategorySelect(catId);
                    }}
                    className="bg-white hover:bg-black hover:text-white dark:bg-white dark:hover:bg-slate-900 dark:hover:text-white text-black px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:scale-[1.03] transition-all cursor-pointer border border-transparent hover:border-white/20 active:scale-95"
                  >
                    {bannerSlides[currentSlide].buttonText}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Navigation indicators */}
          <div className="absolute bottom-4 right-6 sm:right-12 flex gap-2 z-20">
            {bannerSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-6 bg-[#FF385C]' : 'w-2.5 bg-white/40 hover:bg-white/70'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Left / Right chevron triggers */}
          <button 
            onClick={() => setCurrentSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center transition-all cursor-pointer z-20 text-white border border-white/10 backdrop-blur-xs opacity-0 group-hover:opacity-100 hidden sm:flex"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button 
            onClick={() => setCurrentSlide(prev => (prev + 1) % bannerSlides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center transition-all cursor-pointer z-20 text-white border border-white/10 backdrop-blur-xs opacity-0 group-hover:opacity-100 hidden sm:flex"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

        </div>
      </section>

      {/* 3. HORIZONTAL CATEGORIES SLIDER */}
      <section className="relative z-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 py-3 mb-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Slider Container with gradient bounds */}
          <div className="relative flex-1 flex items-center overflow-hidden">
            
            {/* Left Scroll Arrow and Gradient overlay */}
            <div className={`absolute left-0 top-0 bottom-0 flex items-center pr-12 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 z-10 transition-all duration-300 pointer-events-none ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={() => scrollCategories('left')}
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-105 active:scale-90 transition-all text-gray-800 dark:text-gray-200"
                id="category-slide-left"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Scroller Area */}
            <div 
              ref={categoryScrollRef}
              className="flex items-center gap-7 sm:gap-9 overflow-x-auto no-scrollbar pt-2 pb-3.5 scroll-smooth w-full px-2"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id && !showWishlistOnly;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="group flex flex-col items-center shrink-0 cursor-pointer relative pb-1 pt-0.5 select-none"
                    id={`category-item-${cat.id}`}
                  >
                    {renderCategoryIcon(cat.iconName, isActive)}
                    <span className={`text-[12px] font-semibold tracking-tight transition-colors duration-300 ${isActive ? 'text-black dark:text-white font-bold' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                      {cat.name}
                    </span>
                    {/* Active Bottom marker bar - precise and sleek */}
                    <div className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full transition-all duration-300 ${isActive ? 'bg-black dark:bg-white w-full' : 'bg-transparent w-0 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 group-hover:w-8/12 mx-auto'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow and Gradient overlay */}
            <div className={`absolute right-0 top-0 bottom-0 flex items-center pl-12 bg-gradient-to-l from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 z-10 transition-all duration-300 pointer-events-none ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={() => scrollCategories('right')}
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-105 active:scale-90 transition-all text-gray-800 dark:text-gray-200"
                id="category-slide-right"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>

          {/* Filters trigger button */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilterModal(true)}
              className="group flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-slate-800 px-4 py-3 rounded-xl text-xs font-bold transition-all bg-white dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow"
              id="filters-main-trigger"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <circle cx="8" cy="6" r="2" className="transition-all duration-500 ease-out group-hover:translate-x-[4px] group-hover:stroke-[#FF385C] group-hover:fill-[#FF385C]" />

                <line x1="4" y1="12" x2="20" y2="12" />
                <circle cx="16" cy="12" r="2" className="transition-all duration-500 ease-out group-hover:translate-x-[-6px] group-hover:stroke-[#FF385C] group-hover:fill-[#FF385C]" />

                <line x1="4" y1="18" x2="20" y2="18" />
                <circle cx="10" cy="18" r="2" className="transition-all duration-500 ease-out group-hover:translate-x-[5px] group-hover:stroke-[#FF385C] group-hover:fill-[#FF385C]" />
              </svg>
              <span className="hidden sm:inline-block text-gray-750 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">Filters</span>
            </button>

            {/* Show Map / Show List Button stuck next to filters */}
            <button 
              onClick={() => setShowMapView(!showMapView)}
              className={`group flex items-center gap-2 border px-4 py-3 rounded-xl text-xs font-bold transition-all bg-white dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow ${showMapView ? 'border-[#FF385C] text-[#FF385C] dark:border-[#FF385C]/80 ring-1 ring-[#FF385C]/20' : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white text-gray-750 dark:text-gray-200 hover:text-black dark:hover:text-white'}`}
              id="map-toggle-trigger"
            >
              <Map className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-12 ${showMapView ? 'text-[#FF385C]' : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`} />
              <span>{showMapView ? 'Show list' : 'Show map'}</span>
            </button>
            
            {wishlist.length > 0 && (
              <button 
                onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                className={`flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold border transition-all ${showWishlistOnly ? 'bg-rose-50 border-rose-200 text-[#FF385C] dark:bg-rose-950/20 dark:border-rose-900' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                <Heart className={`w-4 h-4 ${showWishlistOnly ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline-block">Wishlisted</span>
                <span className="bg-[#FF385C] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{wishlist.length}</span>
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 4. MAIN PROPERTY CARDS GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        
        {/* Wishlist Header Indicator Banner */}
        {showWishlistOnly && (
          <div className="mb-6 flex items-center justify-between bg-rose-50/50 dark:bg-slate-850 p-4 rounded-2xl border border-rose-100 dark:border-gray-800 animate-slide-up">
            <div className="flex items-center gap-2.5">
              <span className="bg-rose-500 text-white p-2 rounded-xl">
                <Heart className="w-5 h-5 fill-current" />
              </span>
              <div>
                <h2 className="font-extrabold text-sm text-gray-900 dark:text-white">Your curated dream wishlist</h2>
                <p className="text-xs text-gray-500">Only showing listings you marked as favorites.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowWishlistOnly(false)}
              className="text-xs font-bold text-rose-500 hover:underline px-3 py-1.5"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* LOADING SKELETON LAYER */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-[4/3] w-full rounded-2xl skeleton-pulse" />
                <div className="h-4 w-3/4 rounded skeleton-pulse" />
                <div className="h-3 w-1/2 rounded skeleton-pulse" />
                <div className="h-3 w-1/3 rounded skeleton-pulse" />
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          /* EMPTY FALLBACK CONTAINER */
          <div className="text-center py-20 px-4 bg-gray-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="max-w-md mx-auto space-y-4">
              <Compass className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-bold">No exact matches found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Try widening your price filters, selecting a different homes category, or exploring your entire listing catalogs.
              </p>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setActiveFilters({
                    maxPrice: 2500,
                    minRating: 0,
                    propertyType: 'any',
                    hasWifi: false,
                    hasPool: false,
                    hasAirConditioning: false
                  });
                  setSearchFilters({ destination: '', startDate: '', endDate: '', guests: { adults: 1, children: 0, infants: 0, pets: 0 } });
                  setShowWishlistOnly(false);
                }}
                className="bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all"
              >
                Clear all filters
              </button>
            </div>
          </div>
         ) : showMapView ? (
          /* HIGH-FIDELITY INTERACTIVE VECTOR MAP CONTAINER */
          <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden relative shadow-md select-none flex flex-col md:flex-row h-[550px] md:h-[650px] animate-fade-in mb-6">
            
            {/* Sidebar with Listings list for quick navigation */}
            <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 flex flex-col h-1/3 md:h-full">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Map Listings ({filteredListings.length})</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Live Pins</span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5">
                {filteredListings.map((listing) => (
                  <div 
                    key={listing.id}
                    onClick={() => {
                      setSelectedMapListing(listing);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 text-left ${selectedMapListing?.id === listing.id ? 'border-[#FF385C] bg-rose-50/20 dark:bg-rose-950/10' : 'border-gray-100 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-850'}`}
                  >
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title} 
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{listing.title}</h4>
                      <p className="text-[11px] text-gray-500 truncate">{listing.location}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-extrabold text-black dark:text-white">${listing.pricePerNight} <span className="font-normal text-gray-400 text-[10px]">/ night</span></span>
                        <span className="text-[11px] font-bold flex items-center gap-0.5 text-gray-800 dark:text-gray-200">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {listing.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Interactive Vector Map Canvas */}
            <div className="flex-1 relative bg-[#F7F6F3] dark:bg-[#111625] overflow-hidden group/canvas">
              {/* Dynamic Coordinate projector overlay map */}
              <div className="absolute inset-0 z-0">
                <svg className="w-full h-full text-slate-200 dark:text-slate-900 opacity-80" xmlns="http://www.w3.org/2000/svg">
                  {/* Styled Coastline and sea bodies */}
                  <path d="M 0 100 Q 150 120 300 80 T 600 200 T 900 150 L 1200 400 L 1200 650 L 0 650 Z" fill={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#14213d' : '#ebf5ff'} className="transition-colors duration-500" />
                  <path d="M 800 0 Q 950 50 1100 20 T 1200 80 L 1200 0 Z" fill={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#14213d' : '#ebf5ff'} className="transition-colors duration-500" />
                  
                  {/* Grid system lines representing highways & streets */}
                  <g stroke={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#1e293b' : '#e2e8f0'} strokeWidth="1" strokeDasharray="5,5">
                    <line x1="0" y1="100" x2="1200" y2="100" />
                    <line x1="0" y1="250" x2="1200" y2="250" />
                    <line x1="0" y1="400" x2="1200" y2="400" />
                    <line x1="0" y1="550" x2="1200" y2="550" />
                    <line x1="150" y1="0" x2="150" y2="650" />
                    <line x1="400" y1="0" x2="400" y2="650" />
                    <line x1="680" y1="0" x2="680" y2="650" />
                    <line x1="950" y1="0" x2="950" y2="650" />
                  </g>

                  {/* Primary Highway Arterials */}
                  <path d="M -50 200 Q 100 150 350 350 T 800 480 T 1300 450" fill="none" stroke={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#334155' : '#cbd5e1'} strokeWidth="4" />
                  <path d="M 250 -50 Q 300 200 450 400 T 900 700" fill="none" stroke={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#334155' : '#cbd5e1'} strokeWidth="3" />
                  
                  {/* Winding scenic river path */}
                  <path d="M 750 -50 Q 700 180 820 340 T 570 520 T -50 600" fill="none" stroke={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#1d4ed8' : '#60a5fa'} strokeWidth="8" strokeLinecap="round" className="opacity-40" />

                  {/* Curving topographical details contour rings */}
                  <circle cx="200" cy="450" r="160" fill="none" stroke={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#1e293b' : '#e2e8f0'} strokeWidth="1" className="opacity-40" />
                  <circle cx="200" cy="450" r="110" fill="none" stroke={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#1e293b' : '#e2e8f0'} strokeWidth="1" className="opacity-40" />
                  <circle cx="950" cy="150" r="120" fill="none" stroke={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#1e293b' : '#e2e8f0'} strokeWidth="1" className="opacity-40" />

                  {/* Scenic landmarks indicators */}
                  <g fill={localStorage.getItem('airbnb_dark_mode') === 'true' ? '#334155' : '#cbd5e1'} className="text-[10px] font-semibold select-none opacity-60">
                    <text x="50" y="230">Pacific Highway R1</text>
                    <text x="800" y="250">Garonne River Bend</text>
                    <text x="140" y="440">Scenic Peaks State Park</text>
                    <text x="960" y="160">Coastal Lagoon</text>
                  </g>
                </svg>
              </div>

              {/* Dynamic Projection Markers */}
              <div className="absolute inset-0 z-10 p-4">
                {filteredListings.map((listing) => {
                  // Collect coordinates stats dynamically to map projection bounds safely
                  const lats = filteredListings.map((l) => l.coordinates.lat);
                  const lngs = filteredListings.map((l) => l.coordinates.lng);
                  const minLat = lats.length > 0 ? Math.min(...lats) : 20;
                  const maxLat = lats.length > 0 ? Math.max(...lats) : 60;
                  const minLng = lngs.length > 0 ? Math.min(...lngs) : -120;
                  const maxLng = lngs.length > 0 ? Math.max(...lngs) : 140;

                  const latDiff = maxLat - minLat === 0 ? 1 : maxLat - minLat;
                  const lngDiff = maxLng - minLng === 0 ? 1 : maxLng - minLng;

                  // Project coordinates with boundaries
                  const paddingX = 80;
                  const paddingY = 80;

                  const xPct = paddingX + ((listing.coordinates.lng - minLng) / lngDiff) * (100 - (2 * paddingX) / 8);
                  const yPct = paddingY + (1 - (listing.coordinates.lat - minLat) / latDiff) * (100 - (2 * paddingY) / 6);

                  const isSelected = selectedMapListing?.id === listing.id;

                  return (
                    <button
                      key={listing.id}
                      onClick={() => setSelectedMapListing(listing)}
                      style={{
                        left: `${Math.min(94, Math.max(3, xPct))}%`,
                        top: `${Math.min(92, Math.max(8, yPct))}%`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20 cursor-pointer animate-fade-in"
                    >
                      <div className={`flex items-center gap-1.5 shadow-md px-3 py-1.5 rounded-full font-extrabold text-xs border select-none transition-all duration-300 hover:scale-110 ${isSelected ? 'bg-[#FF385C] border-[#FF385C] text-white scale-110 z-30' : 'bg-white dark:bg-slate-800 text-black dark:text-white border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'}`}>
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#FF385C]'}`} />
                        <span>${listing.pricePerNight}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* HUD Dashboard overlay header */}
              <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-gray-200/50 dark:border-gray-800 flex items-center gap-3 shadow-md max-w-[280px]">
                <Map className="w-5 h-5 text-[#FF385C]" />
                <div className="text-left">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white">Interactive Travel Deck</h3>
                  <p className="text-[10px] text-gray-500 truncate">Auto-panned & scaled to {filteredListings[0]?.country || 'your filter'}</p>
                </div>
              </div>

              {/* Floating map controls on the side */}
              <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
                <button 
                  onClick={() => alert("Zooming spatial mapping layers...")}
                  className="w-9 h-9 items-center justify-center flex bg-white/95 dark:bg-slate-900/95 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-755 dark:text-gray-300 font-bold select-none text-base cursor-pointer hover:text-[#FF385C]"
                >
                  +
                </button>
                <button 
                  onClick={() => alert("Restoring spatial mapping coordinates...")}
                  className="w-9 h-9 items-center justify-center flex bg-white/95 dark:bg-slate-900/95 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-755 dark:text-gray-300 font-bold select-none text-base cursor-pointer hover:text-[#FF385C]"
                >
                  −
                </button>
              </div>

              {/* Dynamic Slide-Up Popup Preview Card of Selected Pin */}
              <AnimatePresence>
                {selectedMapListing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    className="absolute bottom-4 left-4 right-16 md:right-4 md:left-auto md:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-3 z-30 flex gap-4 text-left"
                  >
                    <button 
                      onClick={() => setSelectedMapListing(null)}
                      className="absolute top-2 right-2 w-5 h-5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 rounded-full flex items-center justify-center cursor-pointer text-gray-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    
                    <img 
                      src={selectedMapListing.images[0]} 
                      alt={selectedMapListing.title} 
                      className="w-24 h-24 rounded-xl object-cover bg-gray-50"
                    />
                    
                    <div className="flex-1 flex flex-col justify-between min-w-0 pr-4">
                      <div>
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="text-[9px] bg-[#FF385C]/10 text-[#FF385C] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{selectedMapListing.category}</span>
                          <span className="text-xs font-bold flex items-center gap-0.5 text-gray-800 dark:text-gray-200">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {selectedMapListing.rating}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-gray-900 dark:text-white truncate mt-1">{selectedMapListing.title}</h4>
                        <p className="text-[10px] text-gray-500 truncate">{selectedMapListing.location}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-extrabold text-black dark:text-white">${selectedMapListing.pricePerNight} <span className="font-normal text-gray-400 text-[9px]">/ night</span></span>
                        <button 
                          onClick={() => handleOpenDetails(selectedMapListing)}
                          className="bg-black hover:bg-[#FF385C] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        ) : (
          /* LISTINGS CARDS DISPLAY */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredListings.map((listing) => {
              const activeSlide = carouselIndexes[listing.id] || 0;
              const isWishlisted = wishlist.includes(listing.id);

              return (
                <article 
                  key={listing.id}
                  onClick={() => handleOpenDetails(listing)}
                  className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.99]"
                  id={`listing-card-${listing.id}`}
                >
                  
                  {/* Image Carousel Block */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100 dark:bg-slate-850 mb-3 group-hover:shadow-md transition-shadow">
                    
                    {/* Sliding Images Container */}
                    <div className="absolute inset-0 flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                      {listing.images.map((img, index) => (
                        <img 
                          key={index}
                          src={img} 
                          alt={`${listing.title} interior element ${index + 1}`}
                          className="w-full h-full object-cover shrink-0 select-none group-hover:scale-105 transition-transform duration-750"
                          loading="lazy"
                        />
                      ))}
                    </div>

                    {/* Gradient shading overlay */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                    {/* Left/Right Action Arrows (Display on card hover) */}
                    <button
                      onClick={(e) => navigateCarousel(e, listing.id, 'prev', listing.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-full shadow hover:scale-105 active:scale-90 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => navigateCarousel(e, listing.id, 'next', listing.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-full shadow hover:scale-105 active:scale-90 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Heart wishlist element */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, listing.id)}
                      className="absolute top-3.5 right-3.5 text-white/90 hover:scale-110 active:scale-90 select-none z-20 transition-all cursor-pointer"
                      aria-label="Toggle favorite properties selection"
                      id={`wishlist-button-${listing.id}`}
                    >
                      <Heart 
                        className={`w-6 h-6 stroke-white stroke-[2px] transition-all ${isWishlisted ? 'text-[#FF385C] fill-[#FF385C] scale-110' : 'text-transparent hover:text-white/60'}`} 
                      />
                    </button>

                    {/* Slide Pagination indicator dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                      {listing.images.map((_, index) => (
                        <div 
                          key={index} 
                          className={`rounded-full transition-all duration-300 ${activeSlide === index ? 'bg-white w-2 h-2 scale-110' : 'bg-white/50 w-1.5 h-1.5'}`} 
                        />
                      ))}
                    </div>

                    {/* Host badge */}
                    {listing.rating >= 4.95 && (
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-black dark:text-white text-[9px] font-extrabold px-2 py-1 rounded-md tracking-wider flex items-center gap-1 shadow-sm">
                        <Award className="w-3 h-3 text-[#FF385C]" />
                        <span>SUPERHOST</span>
                      </div>
                    )}

                  </div>

                  {/* Text Details Description Block */}
                  <div className="flex flex-col text-sm space-y-0.5">
                    
                    {/* Location and rating row */}
                    <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                      <span className="truncate pr-2">{listing.location}</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        <span>{listing.rating.toFixed(2)}</span>
                      </span>
                    </div>

                    {/* Description distance */}
                    <span className="text-gray-500 dark:text-gray-400 text-xs truncate">
                      {listing.description}
                    </span>

                    {/* Distance indicator */}
                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                      {listing.distance}
                    </span>

                    {/* Selected dates array */}
                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                      {listing.dateRange}
                    </span>

                    {/* Calculated Price */}
                    <div className="pt-1 select-none text-gray-800 dark:text-gray-100 font-normal">
                      <span className="font-extrabold text-black dark:text-white text-base">${listing.pricePerNight}</span>
                      <span className="text-gray-500 text-xs dark:text-gray-400"> / night</span>
                    </div>

                  </div>

                </article>
              );
            })}
          </div>
        )}

      </main>



      {/* 6. BECOME A HOST banner section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 text-white aspect-[16/10] sm:aspect-[21/9] md:aspect-[3/1] group flex items-center">
          
          {/* Background image */}
          <img 
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1500&q=80" 
            alt="Warm fireplace setup with design wooden architecture" 
            className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-1000"
          />
          {/* Cover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          
          <div className="absolute p-6 sm:p-12 max-w-lg space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight">
              Earn an average of <span className="text-[#FF385C]">$1,250</span> / week hosting.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Share your alpine cabins, beachfront flats, or suburban treehouses with verified travelers seeking unique escapes.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => alert("Launching hosting calculator dashboard...")}
                className="bg-[#FF385C] hover:bg-[#e62e50] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:scale-[1.03] transition-all cursor-pointer"
                id="hosting-bottom-cta"
              >
                Become a Host now
              </button>
            </div>
          </div>
          
        </div>
      </section>

      {/* 7. INSPIRATION TAB SECTION */}
      <section className="bg-gray-50 dark:bg-slate-900 py-14 border-t border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Inspiration for local getaways</h2>
          
          {/* Subsection Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar gap-7 mb-8 select-none">
            {['Weekend Getaways', 'Beach Destinations', 'Mountain Trips', 'International Trips'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveInspirationTab(tab)}
                className={`pb-4 font-bold text-xs sm:text-sm whitespace-nowrap relative shrink-0 transition-colors ${activeInspirationTab === tab ? 'text-black dark:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}
              >
                {tab}
                {activeInspirationTab === tab && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-black dark:bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Inspiration Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {activeInspirationItems.map((item, index) => (
              <a 
                key={index}
                href={item.link}
                className="group block p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-850 hover:border-gray-200 dark:hover:border-slate-700/80 hover:shadow-sm active:scale-95 transition-all duration-300"
              >
                <span className="block text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-[#FF385C] transition-colors duration-200">
                  {item.name}
                </span>
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                  {item.type} options
                </span>
              </a>
            ))}
          </div>

        </div>
      </section>
      </>
      )}

      {/* 8. MULTI-COLUMN COMPREHENSIVE FOOTER */}
      <footer className="bg-[#F7F7F7] dark:bg-slate-950 font-medium text-xs text-gray-700 dark:text-gray-400 py-12 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 divide-y divide-gray-200 dark:divide-gray-800 space-y-10">
          
          {/* Main List Column */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-8 gap-x-4">
            
            {/* Column Support */}
            <div className="space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-white">Support</span>
              <ul className="space-y-2.5">
                <li>
                  <button 
                    onClick={() => {
                      setActiveView('help-center');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:underline cursor-pointer text-left font-medium block"
                  >
                    Help Center
                  </button>
                </li>
                <li><a href="#" className="hover:underline">AirCover</a></li>
                <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
                <li><a href="#" className="hover:underline">Disability support</a></li>
                <li><a href="#" className="hover:underline">Cancellation options</a></li>
                <li><a href="#" className="hover:underline">Report neighborhood concern</a></li>
              </ul>
            </div>

            {/* Column Hosting */}
            <div className="space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-white">Hosting</span>
              <ul className="space-y-2.5">
                <li>
                  <button 
                    onClick={() => {
                      setActiveView('hosting');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:underline cursor-pointer text-left font-medium block"
                  >
                    Airbnb your home
                  </button>
                </li>
                <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
                <li><a href="#" className="hover:underline">Hosting resources</a></li>
                <li><a href="#" className="hover:underline">Community forum</a></li>
                <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
                <li><a href="#" className="hover:underline">Airbnb-friendly apartments</a></li>
              </ul>
            </div>

            {/* Column Airbnb */}
            <div className="space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-white">Airbnb</span>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:underline">Newsroom</a></li>
                <li><a href="#" className="hover:underline">New features</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Investors</a></li>
                <li><a href="#" className="hover:underline">Gift cards</a></li>
                <li><a href="#" className="hover:underline">Airbnb.org disaster relief</a></li>
              </ul>
            </div>

            {/* Column Trust */}
            <div className="space-y-4 font-normal">
              <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-extrabold text-sm mb-3">
                <Shield className="w-5 h-5 text-[#FF385C]" />
                <span>Airbnb Safety Core</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                All guest hosts profile verifications are completed securely. Your safety, payment processes, and booking protection structures remain shielded on each transaction.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[#FF385C] font-semibold text-xs">
                <Clock className="w-4 h-4" />
                <span>24/7 Global Dispatch Team</span>
              </div>
            </div>

          </div>

          {/* Bottom Copyright and Meta details */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-normal">
            
            {/* Meta links */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center md:text-left text-[11px] text-gray-500">
              <span>© 2026 Airbnb, Inc.</span>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:underline">Terms of Service</a>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:underline">Sitemap</a>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:underline">UK Modern Slavery Act</a>
            </div>

            {/* Language currency social rows */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 hover:underline cursor-pointer font-bold">
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-450" />
                <span>English (US)</span>
              </div>
              <div className="hover:underline cursor-pointer font-bold">
                <span>$ USD</span>
              </div>
              {/* Social Media SVG shortcuts */}
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-300">
                <a href="#" aria-label="Airbnb Facebook page"><svg className="w-5 h-5 fill-current grayscale hover:grayscale-0 hover:text-blue-600" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>
                <a href="#" aria-label="Airbnb Twitter/X account"><svg className="w-4.5 h-4.5 fill-current grayscale hover:grayscale-0 hover:text-black dark:hover:text-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="#" aria-label="Airbnb Instagram channel"><svg className="w-5 h-5 fill-current grayscale hover:grayscale-0 hover:text-pink-600 animate-pulse-slow" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
              </div>
            </div>

          </div>

        </div>
      </footer>

      {/* 9. FLOATING BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-750 text-black dark:text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all select-none cursor-pointer"
          id="back-to-top-button"
        >
          <ArrowUp className="w-5 h-5 text-[#FF385C]" />
        </button>
      )}

      {/* ======================================================= */}
      {/* 10. DETAILED LISTING PROPERTY DETAIL MODAL - ROW LAYOUT */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs select-none">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl relative animate-slide-up flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-700">
            
            {/* Modal Top Header (Sticky Title & Close) */}
            <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between z-10">
              <div className="flex flex-col text-left">
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-rose-50 text-[#FF385C] dark:bg-rose-950/20 px-2.5 py-1 rounded-md tracking-wider w-fit mb-1">
                  <Star className="w-3.5 h-3.5 fill-current text-rose-500" />
                  <span>{selectedListing.rating >= 4.95 ? 'Highly Rated Guest Choice' : 'Stretches of Luxury'}</span>
                </span>
                <h3 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white truncate max-w-lg">
                  {selectedListing.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedListing(null)}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
              
              {/* Photo Collage Space */}
              <div className="grid grid-cols-4 gap-2.5 rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
                <div className="col-span-2 h-full">
                  <img src={selectedListing.images[0]} alt={`${selectedListing.title} master space`} className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="col-span-1 flex flex-col gap-2.5 h-full">
                  <img src={selectedListing.images[1]} alt="Gallery 2" className="w-full h-1/2 object-cover flex-1 hover:scale-[1.03] transition duration-500" />
                  <img src={selectedListing.images[2]} alt="Gallery 3" className="w-full h-1/2 object-cover flex-1 hover:scale-[1.03] transition duration-500" />
                </div>
                <div className="col-span-1 h-full relative">
                  <img src={selectedListing.images[3]} alt="Gallery 4" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-lg border border-white/20">
                      Show all photos
                    </span>
                  </div>
                </div>
              </div>

              {/* Major Two-Column Info Splitter (Descriptions vs Booking Panel) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Side: Descriptions, Host stats, and Amenities */}
                <div className="col-span-2 space-y-8 select-text">
                  
                  {/* Geographic Location metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-left">
                      <h4 className="text-lg md:text-xl font-black text-slate-950 dark:text-white">
                        Entire rental unit in {selectedListing.location}
                      </h4>
                      <div className="mt-3 inline-flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-750 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700">
                        <span>{selectedListing.maxGuests} guests</span>
                        <span className="text-gray-400">•</span>
                        <span>{selectedListing.bedrooms} bedrooms</span>
                        <span className="text-gray-400">•</span>
                        <span>{selectedListing.beds} beds</span>
                        <span className="text-gray-400">•</span>
                        <span>{selectedListing.bathrooms} bathrooms</span>
                      </div>
                    </div>
                    {/* Professional Host Profile Card Badge */}
                    <div className="flex items-center gap-3 bg-gray-50/80 dark:bg-slate-750/70 p-3 px-4 rounded-2xl border border-gray-250/60 dark:border-slate-700 shadow-sm max-w-[220px]">
                      <img src={selectedListing.hostAvatar} alt="Host Avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FF385C] shrink-0" />
                      <div className="text-left min-w-0">
                        <span className="block text-[9px] uppercase font-black text-rose-500 tracking-wider">Verified Guide</span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate block">Host {selectedListing.hostName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
                    
                    {/* Superhost badge marker definitions */}
                    {selectedListing.rating >= 4.95 && (
                      <div className="flex gap-4">
                        <Award className="w-6 h-6 text-[#FF385C] shrink-0 mt-0.5" />
                        <div className="text-left">
                          <h5 className="font-extrabold text-sm text-slate-950 dark:text-white">{selectedListing.hostName} is a Superhost</h5>
                          <p className="text-xs text-gray-800 dark:text-gray-200 font-medium mt-0.5 leading-relaxed">Superhosts are experienced, highly rated hosts who are committed to providing exceptional stays.</p>
                        </div>
                      </div>
                    )}

                    {/* Highly secure checkin marker */}
                    <div className="flex gap-4">
                      <Shield className="w-6 h-6 text-[#FF385C] shrink-0 mt-0.5" />
                      <div className="text-left">
                        <h5 className="font-extrabold text-sm text-slate-950 dark:text-white">Secure Check-In Experience</h5>
                        <p className="text-xs text-gray-800 dark:text-gray-200 font-medium mt-0.5 leading-relaxed">Enjoy seamless entry with smart-lock hardware access. Full secure code keys will be dispatched right after confirmation.</p>
                      </div>
                    </div>

                    {/* Cancellation timeline marker */}
                    <div className="flex gap-4">
                      <Calendar className="w-6 h-6 text-[#FF385C] shrink-0 mt-0.5" />
                      <div className="text-left">
                        <h5 className="font-extrabold text-sm text-slate-950 dark:text-white">Free cancellation up to 48 hours</h5>
                        <p className="text-xs text-gray-800 dark:text-gray-200 font-medium mt-0.5 leading-relaxed">Flexible bookings cover schedule adjustments seamlessly without penalty.</p>
                      </div>
                    </div>

                  </div>

                  {/* Curated About/Listing summary text */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-left">
                    <h5 className="font-black text-xs mb-3 text-slate-950 dark:text-white uppercase tracking-wider">About this unique space</h5>
                    <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-bold">
                      {selectedListing.description} Handcrafted interiors include premium linens, designer light fittings, and locally harvested materials. Spend mornings drinking espresso overlooking scenic horizons and wrap up nights soaking in our private wood-infused facilities.
                    </p>
                  </div>

                  {/* Checklist listings Amenities */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-left pb-6">
                    <h5 className="font-black text-xs mb-4 text-slate-950 dark:text-white uppercase tracking-wider">What this space offers</h5>
                    <div className="grid grid-cols-2 gap-3.5">
                      {selectedListing.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-900 dark:text-slate-100 font-black">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[3]" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real Airbnb-Style Verified Reviews & Evaluations */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-left space-y-6">
                    <div>
                      <h5 className="font-black text-xs text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>Guest Evaluations & Ratings Breakdown</span>
                      </h5>
                      <p className="text-[11px] text-gray-400 font-medium mt-1">Based on global verified stays at this address.</p>
                    </div>

                    {/* Score Parameters Progress Bars Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Cleanliness', score: '4.9', width: '98%' },
                        { label: 'Communication', score: '5.0', width: '100%' },
                        { label: 'Location', score: '4.8', width: '96%' },
                        { label: 'Value', score: '4.9', width: '98%' },
                        { label: 'Accuracy', score: '4.9', width: '98%' },
                        { label: 'Check-in Experience', score: '5.0', width: '100%' }
                      ].map((param, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                            <span>{param.label}</span>
                            <span className="font-black text-slate-950 dark:text-white">{param.score}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-850 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-950 dark:bg-white rounded-full transition-all duration-1000" style={{ width: param.width }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Curated Guest Comments List */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <h6 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Verified Guest Comments</h6>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { 
                            name: 'Jessica M.', 
                            location: 'United States', 
                            date: 'June 2026', 
                            text: 'Absolutely brilliant property! Checking in was seamless using the smart keypad PIN they provided. Super clean, fast wifi, and panoramic scenes.',
                            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica'
                          },
                          { 
                            name: 'Takashi S.', 
                            location: 'Japan', 
                            date: 'May 2026', 
                            text: 'Extremely tidy, beautiful design! It was exactly as described in the posting feed. The host Ahad was incredibly prompt and friendly.',
                            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Takashi'
                          },
                          { 
                            name: 'Marcus K.', 
                            location: 'Germany', 
                            date: 'April 2026', 
                            text: 'Outstanding value for money. Very comfortable linens, customized light fittings, and highly secure automatic gate clearance code system.',
                            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus'
                          },
                          { 
                            name: 'Elena D.', 
                            location: 'Spain', 
                            date: 'March 2026', 
                            text: 'Warm and relaxing place to spent families vacation. Enjoyed the outdoor spa facilities under scenic mountain shadows. Five stars!',
                            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena'
                          }
                        ].map((review, rIdx) => (
                          <div key={rIdx} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-gray-200 dark:border-gray-800/80 space-y-2.5">
                            <div className="flex items-center gap-2.5">
                              <img src={review.avatar} alt={review.name} className="w-8 h-8 rounded-full bg-rose-50" />
                              <div className="text-left">
                                <span className="block text-xs font-black text-slate-950 dark:text-white">{review.name}</span>
                                <span className="block text-[10px] text-gray-400 font-semibold">{review.location} • {review.date}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-800 dark:text-gray-300 font-medium leading-relaxed">
                              "{review.text}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side Sticky Booking Card */}
                <div className="col-span-1">
                  <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-gray-250 dark:border-gray-700 shadow-xl sticky top-2 flex flex-col gap-4">
                    
                    {/* Price and review info header */}
                    <div className="flex items-center justify-between select-none pb-4 border-b border-gray-100 dark:border-gray-700">
                      <div>
                        <span className="text-2xl font-black text-slate-950 dark:text-white">${selectedListing.pricePerNight}</span>
                        <span className="text-slate-800 dark:text-gray-250 text-xs font-bold"> / night</span>
                      </div>
                      
                      {/* Premium badged Reviews highlight */}
                      <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-lg border border-yellow-200 dark:border-amber-900/45">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        <span className="text-xs font-black text-slate-950 dark:text-amber-400">{selectedListing.rating}</span>
                        <span className="text-[10px] text-slate-800 dark:text-gray-300 font-bold">(reviews)</span>
                      </div>
                    </div>

                    {/* Booking variable configs inputs (Upgraded to solid layout with Dark text) */}
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-gray-200/90 dark:border-gray-700 p-4 space-y-4">
                      
                      {/* Interactive Calendar Date Pickers Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-left bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-gray-200/80 dark:border-slate-800">
                          <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Check-in</label>
                          <input 
                            type="date" 
                            value={bookingStartDate}
                            onChange={(e) => setBookingStartDate(e.target.value)}
                            min="2026-06-14"
                            className="w-full bg-transparent text-xs font-black text-slate-950 dark:text-white outline-none cursor-pointer mt-0.5 col-span-1" 
                          />
                        </div>
                        <div className="text-left bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-gray-200/80 dark:border-slate-800">
                          <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Check-out</label>
                          <input 
                            type="date" 
                            value={bookingEndDate}
                            onChange={(e) => setBookingEndDate(e.target.value)}
                            min={bookingStartDate}
                            className="w-full bg-transparent text-xs font-black text-slate-950 dark:text-white outline-none cursor-pointer mt-0.5 col-span-1" 
                          />
                        </div>
                      </div>

                      {/* Display computed nights badge */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                        <span>Computed Stay Duration:</span>
                        <span className="bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/20 px-2.5 py-0.5 rounded-full font-black text-xs">
                          {bookingNights} {bookingNights === 1 ? 'night' : 'nights'}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 dark:border-slate-800" />

                      {/* Guests configuration */}
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <span className="block text-[9px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider">Travelers count</span>
                          <span className="text-xs font-black text-slate-950 dark:text-white">{bookingGuests.adults + bookingGuests.children} guests</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1 rounded-xl border border-gray-200/80 dark:border-slate-800">
                          <button 
                            onClick={() => setBookingGuests(prev => prev.adults > 1 ? { ...prev, adults: prev.adults - 1 } : prev)}
                            className="w-7 h-7 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-gray-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-950 dark:text-white active:scale-90 transition-all font-bold cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <span className="w-6 text-center text-sm font-black text-slate-950 dark:text-white">{bookingGuests.adults + bookingGuests.children}</span>
                          <button 
                            onClick={() => setBookingGuests(prev => prev.adults < selectedListing.maxGuests ? { ...prev, adults: prev.adults + 1 } : prev)}
                            className="w-7 h-7 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-gray-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-950 dark:text-white active:scale-90 transition-all font-bold cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Booking Reserve Button Action */}
                    <button 
                      onClick={handleReserve}
                      className="w-full bg-[#FF385C] hover:bg-[#e62e50] text-white py-4 rounded-xl text-sm font-black shadow-md hover:shadow-rose-500/10 active:scale-[0.98] transition-all cursor-pointer text-center"
                      id="reserve-button"
                    >
                      Reserve Unique Stay
                    </button>
                    
                    <span className="block text-center text-[10px] text-slate-950 dark:text-slate-100 font-extrabold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/20 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                      No Immediate Charges Applied
                    </span>

                    {/* Detail Booking receipts listings with solid color, darkness and readable decoration */}
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-slate-950 dark:text-slate-100 font-extrabold">
                      <div className="flex items-center justify-between">
                        <span className="underline text-slate-900 dark:text-slate-200 select-none cursor-help hover:text-[#FF385C] transition-colors">${selectedListing.pricePerNight} x {bookingNights} nights</span>
                        <span className="font-extrabold dark:text-white text-sm">${priceCalculation.raw}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="underline text-slate-900 dark:text-slate-200 select-none cursor-help hover:text-[#FF385C] transition-colors">Cleaning fee</span>
                        <span className="font-extrabold dark:text-white text-sm">${priceCalculation.cleaning}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="underline text-slate-900 dark:text-slate-200 select-none cursor-help hover:text-[#FF385C] transition-colors">Airbnb service fee</span>
                        <span className="font-extrabold dark:text-white text-sm">${priceCalculation.service}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-1" />
                      
                      <div className="flex items-center justify-between text-sm text-slate-950 dark:text-white font-black">
                        <span>Total before taxes</span>
                        <span className="text-base text-[#FF385C] font-black">${priceCalculation.total}</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 11. DETAILED FILTERS MODAL DIALOG DRAWER */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs select-none">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl relative animate-slide-up flex flex-col max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
            
            {/* Filter Modal Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">Filters</h3>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                id="close-filters-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Scrollable Contents */}
            <div className="overflow-y-auto p-6 space-y-6 text-left">
              
              {/* Filter Section: Price Limit Slider */}
              <div className="space-y-3 font-semibold text-xs">
                <span className="block text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">Price range</span>
                <p className="text-xs text-gray-400 font-normal">Maximum price per night for the stay</p>
                <div className="space-y-1">
                  <input 
                    type="range" 
                    min="150" 
                    max="2500" 
                    value={tempFilters.maxPrice} 
                    onChange={(e) => setTempFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                    className="w-full accent-[#FF385C]"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-800 dark:text-gray-200 pt-1">
                    <span>Min: $150</span>
                    <span className="font-extrabold text-[#FF385C] text-sm bg-rose-50 dark:bg-rose-950/25 px-2.5 py-1 rounded-md">Max: ${tempFilters.maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Filter Section: Property Types Selection */}
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-5">
                <span className="block text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">Property type</span>
                <div className="grid grid-cols-2 gap-3.5 text-xs font-semibold">
                  {[
                    { id: 'any', label: 'Any Property' },
                    { id: 'cabin', label: 'Cabins Only' },
                    { id: 'mansion', label: 'Mansions Only' },
                    { id: 'beach', label: 'Beachfront Only' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setTempFilters(prev => ({ ...prev, propertyType: p.id }))}
                      className={`p-3.5 rounded-xl border transition-all text-center cursor-pointer ${tempFilters.propertyType === p.id ? 'border-[#FF385C] bg-[#FF385C]/11 text-[#FF385C]' : 'border-gray-200 dark:border-gray-650 hover:border-black dark:text-gray-200'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Section: Stars Minimum Limit */}
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-5 font-semibold text-xs">
                <span className="block text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">Rating Threshold</span>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Minimum Star Rating</span>
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <select 
                      value={tempFilters.minRating} 
                      onChange={(e) => setTempFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                      className="bg-transparent font-bold focus:outline-none text-amber-700 dark:text-amber-500 text-xs"
                    >
                      <option value="0">Any Rating</option>
                      <option value="4.8">4.8★ & up</option>
                      <option value="4.9">4.9★ & up</option>
                      <option value="4.95">4.95★ & up</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filter Section: Amenities checkbox toggle switches */}
              <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-5">
                <span className="block text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">Amenities Checklist</span>
                <div className="space-y-3.5 text-sm font-semibold">
                  
                  {/* Wifi Option */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-gray-800 dark:text-gray-100">High-speed Wifi</span>
                      <span className="block text-[10px] text-gray-400 font-normal">Remote workspace friendly</span>
                    </div>
                    <button
                      onClick={() => setTempFilters(prev => ({ ...prev, hasWifi: !prev.hasWifi }))}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${tempFilters.hasWifi ? 'bg-[#FF385C]' : 'bg-gray-300 dark:bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all absolute ${tempFilters.hasWifi ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Pool Option */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-gray-800 dark:text-gray-100">Private Swimming Pool</span>
                      <span className="block text-[10px] text-gray-400 font-normal">Backyard heated plunge pools</span>
                    </div>
                    <button
                      onClick={() => setTempFilters(prev => ({ ...prev, hasPool: !prev.hasPool }))}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${tempFilters.hasPool ? 'bg-[#FF385C]' : 'bg-gray-300 dark:bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all absolute ${tempFilters.hasPool ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* A/C Option */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-gray-800 dark:text-gray-100">Air Conditioning</span>
                      <span className="block text-[10px] text-gray-400 font-normal">Cool breezes for high summer stays</span>
                    </div>
                    <button
                      onClick={() => setTempFilters(prev => ({ ...prev, hasAirConditioning: !prev.hasAirConditioning }))}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${tempFilters.hasAirConditioning ? 'bg-[#FF385C]' : 'bg-gray-300 dark:bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all absolute ${tempFilters.hasAirConditioning ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* Filter Modal Footer */}
            <div className="sticky bottom-0 bg-white/95 dark:bg-slate-800/95 p-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <button 
                onClick={handleResetFilters}
                className="text-xs font-bold text-gray-650 hover:text-black dark:text-gray-350 dark:hover:text-white underline"
                id="reset-filters"
              >
                Clear All
              </button>
              <button 
                onClick={handleApplyFilters}
                className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 px-6 py-3 rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all text-center cursor-pointer"
                id="apply-filters"
              >
                Show Results
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 12. RESERVE STAY CONFETTI SUCCESS BOOKED OVERLAY DIALOG */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-55 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm select-none">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl relative animate-scale-up space-y-4 border border-emerald-500 dark:border-emerald-600">
            {/* Confetti sparkle emoji */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🎉
            </div>
            
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-[10px] text-emerald-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Booking Complete
            </span>

            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Pack your bags!
            </h3>
            
            <p className="text-xs text-gray-500 dark:text-gray-450 leading-relaxed font-normal">
              Your vacation stay booking was verified successfully. Standard check-in instructions, door gate codes, and host itinerary layouts will be sent shortly before arrival.
            </p>

            <div className="bg-gray-50 dark:bg-slate-750 p-4 rounded-xl text-left font-semibold text-xs text-gray-750 divide-y divide-gray-200 dark:divide-slate-700">
              <div className="pb-2.5 flex items-center justify-between text-black dark:text-white font-extrabold">
                <span>{selectedListing?.title}</span>
                <span className="text-[#FF385C]">${selectedListing?.pricePerNight}/nt</span>
              </div>
              <div className="pt-2.5 space-y-1.5 text-gray-500">
                <div className="flex justify-between">
                  <span>Travelers:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{bookingGuests.adults + bookingGuests.children} guests</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{bookingNights} nights</span>
                </div>
                <div className="flex justify-between">
                  <span>Grand Total:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-500 text-sm">${priceCalculation.total}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedListing(null);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all text-center cursor-pointer"
            >
              Continue Exploring Escape
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <LoginSignup 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
          }} 
          initialTab={authModalTab}
        />
      )}

    </div>
  );
}
