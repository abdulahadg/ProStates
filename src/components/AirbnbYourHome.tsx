import { useState, FormEvent } from 'react';
import { 
  Home, 
  Calculator, 
  Sparkles, 
  MapPin, 
  Smile, 
  MessageSquare, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  Trash2, 
  TrendingUp, 
  Coins, 
  Wallet 
} from 'lucide-react';
import { Listing, Category } from '../types';

interface AirbnbYourHomeProps {
  onClose: () => void;
  categories: Category[];
  onPublishListing: (newListing: Listing) => void;
  allListings: Listing[];
  onDeleteListing: (id: number) => void;
}

const mockRegions = [
  { name: "Malibu Beachfront Studio", price: 850, category: "beachfront", location: "Malibu, California", country: "United States" },
  { name: "Chamonix Alpine A-Frame", price: 320, category: "cabins", location: "Chamonix, Auvergne-Rhône-Alpes", country: "France" },
  { name: "Beverly Hills Mansion", price: 2450, category: "mansions", location: "Beverly Hills, California", country: "United States" },
  { name: "Kyoto Machiya Townhouse", price: 420, category: "amazing-views", location: "Kyoto, Kansai", country: "Japan" },
  { name: "Costa Rica Bamboo Dome", price: 180, category: "treehouses", location: "San Jose, Costa Rica", country: "Costa Rica" },
  { name: "Santorini Cliff Horizon", price: 680, category: "amazing-views", location: "Oia, Santorini", country: "Greece" },
];

export default function AirbnbYourHome({ onClose, categories, onPublishListing, allListings, onDeleteListing }: AirbnbYourHomeProps) {
  // Navigation states
  const [activeSegment, setActiveSegment] = useState<'create' | 'manage'>('create');

  // Calculator state
  const [selectedRegionIdx, setSelectedRegionIdx] = useState(0);
  const [nightsCount, setNightsCount] = useState(15);
  
  // Registration Form States
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[1]?.id || 'beachfront');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('United States');
  const [pricePerNight, setPricePerNight] = useState(250);
  const [description, setDescription] = useState('');
  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(4);
  const [bathrooms, setBathrooms] = useState(2);
  const [amenitiesText, setAmenitiesText] = useState('High-speed Wifi, Kitchen, Ocean View, Free Parking');
  const [imageUrls, setImageUrls] = useState('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80, https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80');

  // Earnings Withdrawal Simulator state
  const [withdrawableBalance, setWithdrawableBalance] = useState<number>(3480);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<boolean>(false);

  // Interactive feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentRegion = mockRegions[selectedRegionIdx];
  const calculatedEarnings = currentRegion.price * nightsCount;

  // Filter listings published by the current user
  const userListings = allListings.filter(listing => listing.hostName.includes("Ahad"));

  // Calculate estimated combined active host monthly yield
  const estTotalMonthlyYield = userListings.reduce((sum, item) => sum + (item.pricePerNight * 15), 0);

  const handleWithdrawRevenue = () => {
    if (withdrawableBalance <= 0) return;
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawableBalance(0);
      setWithdrawalSuccess(true);
      setTimeout(() => setWithdrawalSuccess(false), 5000);
    }, 1800);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!title || !location || !description) {
      setErrorMessage('Please fill in stay title, location, and write a beautiful description.');
      return;
    }

    setIsSubmitting(true);

    const imagesArray = imageUrls
      .split(',')
      .map(url => url.trim())
      .filter(url => url.startsWith('http'));

    if (imagesArray.length === 0) {
      imagesArray.push("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80");
    }

    const preparedAmenities = amenitiesText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const generatedListing: Listing = {
      id: Math.floor(Math.random() * 100000) + 100,
      title: title,
      description: description,
      location: location,
      country: country,
      distance: "Newly Hosted Stay",
      dateRange: "Available Now",
      pricePerNight: Number(pricePerNight) || 120,
      rating: 5.0,
      reviewsCount: 0,
      category: selectedCategory,
      images: imagesArray,
      hostName: "Ahad (You)",
      hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ahad",
      maxGuests: Number(maxGuests) || 2,
      beds: Number(beds) || 2,
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      amenities: preparedAmenities.length > 0 ? preparedAmenities : ["Wifi", "Kitchen", "Air Conditioning"],
      coordinates: {
        lat: 34.0522 + (Math.random() - 0.5) * 5,
        lng: -118.2437 + (Math.random() - 0.5) * 5
      }
    };

    setTimeout(() => {
      onPublishListing(generatedListing);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form fields
      setTitle('');
      setLocation('');
      setDescription('');
      
      // Flash a quick segment switch
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveSegment('manage');
      }, 2000);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Return button and Top Title */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 select-none">
        <div className="text-left">
          <span className="text-xs uppercase font-black tracking-widest text-[#FF385C] block">Become a space pioneer</span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">Host Management Hub</h1>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer select-none"
        >
          ← Return to stays
        </button>
      </div>

      {/* Segment Switch Tabs Layout */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 pb-px mb-8 text-sm font-black select-none gap-6 text-left">
        <button 
          onClick={() => setActiveSegment('create')}
          className={`pb-4 border-b-2 transition-all cursor-pointer ${activeSegment === 'create' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Publish New Stay
        </button>
        <button 
          onClick={() => setActiveSegment('manage')}
          className={`pb-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${activeSegment === 'manage' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          My Listed Properties & Earnings
          {userListings.length > 0 && (
            <span className="bg-[#FF385C] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {userListings.length}
            </span>
          )}
        </button>
      </div>

      {activeSegment === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left column: Dynamic Income Earnings estimator */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            
            {/* Main Earnings Predictor Box */}
            <div className="bg-gradient-to-tr from-slate-900 via-rose-950/25 to-slate-950 dark:from-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 text-white relative shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#FF385C]/15 rounded-full blur-2xl" />
              
              <div className="text-left space-y-1 z-10 relative select-none">
                <span className="text-[10px] uppercase font-black text-rose-500 tracking-wider bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/15">Revenue Estimator</span>
                <h2 className="text-2.5xl font-black text-white tracking-tight mt-3">You could earn up to</h2>
                
                {/* Dynamic Big Profit value */}
                <div className="my-5 flex items-baseline gap-2 animate-fade-in">
                  <span className="text-5xl md:text-5.5xl font-black text-white">${calculatedEarnings.toLocaleString()}</span>
                  <span className="text-gray-400 font-bold text-sm">/ month</span>
                </div>

                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-sm">
                  Expected projection of <span className="text-white font-extrabold">{nightsCount} nights</span> stayed in a premium <span className="text-rose-400 font-extrabold">{currentRegion.name}</span> location.
                </p>
              </div>

              {/* Calculations Controls */}
              <div className="space-y-4 pt-6 border-t border-slate-800 z-10 relative">
                
                {/* Region Selector dropdown */}
                <div className="text-left">
                  <label className="block text-[9px] font-black uppercase text-gray-400 tracking-wider mb-2">Select similar space class</label>
                  <select
                    value={selectedRegionIdx}
                    onChange={(e) => setSelectedRegionIdx(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 text-white font-bold text-xs p-3.5 rounded-xl cursor-copy focus:border-[#FF385C] outline-none"
                  >
                    {mockRegions.map((region, idx) => (
                      <option key={idx} value={idx}>{region.name} (${region.price}/night)</option>
                    ))}
                  </select>
                </div>

                {/* Slider for nights stayed */}
                <div className="text-left">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2 text-gray-300">
                    <span className="font-extrabold text-[#FF385C]">Estimated Nights Booked</span>
                    <span className="font-black text-white text-sm">{nightsCount} nights</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={nightsCount}
                    onChange={(e) => setNightsCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-[#FF385C]"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 font-black uppercase tracking-wider pt-1">
                    <span>1 night</span>
                    <span>15 nights</span>
                    <span>30 nights</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Secure Hosting advantages */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 text-left space-y-5 shadow-sm">
              <h3 className="text-base font-black flex items-center gap-2">
                <ShieldCheck className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-400" />
                <span>Host with peace of mind (AirCover)</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-black text-slate-950 dark:text-white block">$3M damage protection</span>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Covers valuables, cars, boat liabilities instantly.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-black text-slate-950 dark:text-white block">$1M liability insurance</span>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Protect your space against physical accidents easily.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-black text-slate-950 dark:text-white block">24/7 safety hotline</span>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Instant fast communication access anytime.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right column: Form wizard to post a brand new stay directly into active memory */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            
            <div className="text-left mb-6">
              <span className="text-[10px] uppercase font-black text-[#FF385C] tracking-widest block font-bold">Core listing publishing hub</span>
              <h2 className="text-1.5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">Configure your stay listing</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Publish spaces directly inside local lists dynamically to test booking flows.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              {/* Display error message */}
              {errorMessage && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl p-3 text-xs text-rose-600 dark:text-rose-400 font-bold text-left animate-fade-in">
                  {errorMessage}
                </div>
              )}

              {/* Display success banner */}
              {submitSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/40 rounded-2xl p-5 text-left text-xs font-semibold animate-fade-in text-emerald-800 dark:text-emerald-400 space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                    <span className="font-black text-sm">Congratulations! Your stay is officially active!</span>
                  </div>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    We have added your custom accommodation listing to the home list dynamic memories. Navigating you directly to your manage console...
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                
                {/* Stay Title */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Stay title / headline</label>
                  <input
                    type="text"
                    required
                    disabled={submitSuccess}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Kyoto Zen Cedar Forest House"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none"
                  />
                </div>

                {/* Stay Category */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Stay Category</label>
                  <select
                    disabled={submitSuccess}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none cursor-pointer"
                  >
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Location (City/State) */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">City and State/Region</label>
                  <input
                    type="text"
                    required
                    disabled={submitSuccess}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kyoto, Kansai"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Country</label>
                  <input
                    type="text"
                    required
                    disabled={submitSuccess}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Japan"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none"
                  />
                </div>

                {/* Listing Base Price */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Base Price per night ($)</label>
                  <input
                    type="number"
                    min="5"
                    max="10000"
                    required
                    disabled={submitSuccess}
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none"
                  />
                </div>

                {/* Config items */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Capacity (Max guests)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    disabled={submitSuccess}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none"
                  />
                </div>

              </div>

              {/* Room specs configs */}
              <div className="grid grid-cols-3 gap-4 text-left">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    required
                    disabled={submitSuccess}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Beds</label>
                  <input
                    type="number"
                    min="0"
                    required
                    disabled={submitSuccess}
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Bathrooms</label>
                  <input
                    type="number"
                    min="0"
                    required
                    disabled={submitSuccess}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20"
                  />
                </div>
              </div>

              {/* Amenities block */}
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Amenities (Comma separated list)</label>
                <input
                  type="text"
                  disabled={submitSuccess}
                  value={amenitiesText}
                  onChange={(e) => setAmenitiesText(e.target.value)}
                  placeholder="e.g. High-speed Wifi, Kitchen, Ocean View, Fireplace"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 outline-none"
                />
              </div>

              {/* Image URLs text area */}
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Image URLs list (Comma separated)</label>
                <textarea
                  disabled={submitSuccess}
                  rows={2}
                  value={imageUrls}
                  onChange={(e) => setImageUrls(e.target.value)}
                  placeholder="https://image1.jpg, https://image2.jpg"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 outline-none resize-none"
                />
                <span className="block text-[9px] text-gray-400 mt-1">Provide up to 4 comma-separated web addresses. We support standard landscape templates.</span>
              </div>

              {/* Description Text area */}
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Description details</label>
                <textarea
                  required
                  disabled={submitSuccess}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Welcome to our majestic peaceful cedar hideout..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none resize-none"
                />
              </div>

              {!submitSuccess && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF385C] hover:bg-[#e62e50] text-white py-4 rounded-xl text-sm font-black shadow-md hover:shadow-rose-500/10 active:scale-[0.98] transition-all cursor-pointer text-center font-bold"
                >
                  {isSubmitting ? 'Verifying spatial coordinates and building stay...' : 'Publish Space to Guest Feed'}
                </button>
              )}

            </form>

          </div>

        </div>
      ) : (
        /* Host Management Console Tab */
        <div className="space-y-8 animate-fade-in text-left">
          
          {/* Top Panel stats box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Total earnings withdrawable card */}
            <div className="bg-gradient-to-tr from-slate-950 to-slate-900 p-6 rounded-3xl border border-slate-800 text-white relative overflow-hidden flex flex-col justify-between h-48 shadow-lg">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FF385C]/10 rounded-full blur-xl" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[9px] uppercase font-black text-rose-500 tracking-wider">Withdrawable Cash</span>
                  <span className="text-3xl font-black mt-2 block font-mono">${withdrawableBalance.toLocaleString()}</span>
                </div>
                <Coins className="w-8 h-8 text-[#FF385C]" />
              </div>
              
              <div>
                {withdrawalSuccess ? (
                  <div className="text-emerald-400 font-extrabold text-[11px] flex items-center gap-1">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Transferred successfully to bank!</span>
                  </div>
                ) : (
                  <button 
                    disabled={withdrawableBalance <= 0 || isWithdrawing}
                    onClick={handleWithdrawRevenue}
                    className="w-full bg-[#FF385C] hover:bg-[#e62e50] disabled:bg-slate-800 disabled:text-gray-500 text-white py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                  >
                    {isWithdrawing ? "Initiating secure wire..." : "Withdraw host revenue"}
                  </button>
                )}
              </div>
            </div>

            {/* Total Listed count */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between h-48 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Active Posted Stays</span>
                  <span className="text-3.5xl font-black">{userListings.length} {userListings.length === 1 ? 'Stay' : 'Stays'}</span>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Available on search carousel feed.</p>
                </div>
                <Home className="w-7 h-7 text-[#FF385C] stroke-[1.5]" />
              </div>
              <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-xl text-[10.5px] font-bold border border-rose-100 dark:border-rose-900/10">
                You are registered as a Superhost.
              </div>
            </div>

            {/* Est Monthly Earnings yield */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between h-48 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Projected Monthly Yield</span>
                  <span className="text-3.5xl font-black text-rose-500 font-mono">${estTotalMonthlyYield.toLocaleString()}</span>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Assuming average 15 booked nights per property.</p>
                </div>
                <TrendingUp className="w-7 h-7 text-emerald-500 stroke-[1.5]" />
              </div>
              <div className="text-[10px] text-gray-500 font-semibold">
                Average guest recommendation score: <b className="text-slate-900 dark:text-white">5.0 ★</b>
              </div>
            </div>

          </div>

          {/* User Listings Grid section */}
          <div className="space-y-4">
            <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">My Active Listings</h3>
            
            {userListings.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-16 text-center space-y-4">
                <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto">
                  No hosted listings associated with your account yet. Use the "Publish New Stay" tab to post your properties in memory!
                </p>
                <button 
                  onClick={() => setActiveSegment('create')}
                  className="bg-[#FF385C] hover:bg-[#e62e50] text-white text-xs font-black px-5 py-2.5 rounded-xl transition-colors"
                >
                  Configure your first stay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((listing) => (
                  <div key={listing.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-slate-950/80 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                          {listing.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-extrabold text-sm text-slate-950 dark:text-white line-clamp-1 leading-snug">{listing.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                          <span>{listing.location}, {listing.country}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          <span className="bg-slate-50 dark:bg-slate-950 text-gray-500 text-[10px] px-2 py-0.5 rounded-lg font-bold border border-gray-100 dark:border-gray-800">{listing.bedrooms} Beds</span>
                          <span className="bg-slate-50 dark:bg-slate-950 text-gray-500 text-[10px] px-2 py-0.5 rounded-lg font-bold border border-gray-100 dark:border-gray-800">{listing.bathrooms} Baths</span>
                          <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-[10px] px-2 py-0.5 rounded-lg font-bold border border-rose-100 dark:border-rose-900/10">${listing.pricePerNight} / nt</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick remove action */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-slate-950/25 flex items-center justify-between">
                      <span className="text-xs font-black text-rose-500 font-mono">ID: #{listing.id}</span>
                      <button
                        onClick={() => onDeleteListing(listing.id)}
                        className="text-gray-400 hover:text-rose-500 transition-all font-black text-xs flex items-center gap-1 cursor-pointer"
                        title="Unlist property"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete listed property</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
