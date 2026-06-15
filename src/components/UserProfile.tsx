import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  Mail, 
  Settings, 
  Trash2, 
  Lock, 
  ExternalLink,
  Smartphone,
  Globe,
  Camera,
  Star,
  Check,
  CreditCard,
  History,
  TrendingDown,
  Bell,
  Fingerprint
} from 'lucide-react';

interface UserProfileProps {
  onClose: () => void;
  currentUser: { name: string; email: string; avatar?: string } | null;
  onUpdateUser: (user: { name: string; email: string; avatar?: string } | null) => void;
}

export default function UserProfile({ onClose, currentUser, onUpdateUser }: UserProfileProps) {
  // Profile field states
  const [name, setName] = useState(currentUser?.name || 'Ahad');
  const [email, setEmail] = useState(currentUser?.email || 'ahad90194@gmail.com');
  const [location, setLocation] = useState('Kyoto, Kansai');
  const [language, setLanguage] = useState('English, Urdu, Japanese');
  const [about, setAbout] = useState('Enthusiastic global traveler searching for minimal architectural glasshouses, remote cedar cabins, and high-quality traditional tea gardens!');
  const [avatarSeed, setAvatarSeed] = useState('Ahad');

  // Interactive scan states
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [passportVerified, setPassportVerified] = useState(true);

  // Notifications toggles
  const [notifySMS, setNotifySMS] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyDeals, setNotifyDeals] = useState(false);

  // Settings status
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState('');

  const computedAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

  const handlePassportVerify = () => {
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setPassportVerified(true);
      setTimeout(() => setScanSuccess(false), 4000);
    }, 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateFeedback('');

    setTimeout(() => {
      onUpdateUser({
        name,
        email,
        avatar: computedAvatar
      });
      setIsUpdating(false);
      setUpdateFeedback('Profile settings synced successfully to local memory!');
      setTimeout(() => setUpdateFeedback(''), 4000);
    }, 1200);
  };

  const handleResetUser = () => {
    onUpdateUser(null);
    onClose();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-900 dark:text-white text-left">
      
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 select-none">
        <div className="text-left">
          <span className="text-xs uppercase font-black tracking-widest text-[#FF385C] block">Personal traveler credentials</span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">My Account Profile</h1>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          ← Return to stays
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Avatar & Verified Credentials audit */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          
          {/* Avatar card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl text-center flex flex-col items-center">
            <div className="relative group select-none">
              <img 
                src={computedAvatar} 
                alt="Account Avatar" 
                className="w-28 h-28 rounded-full object-cover bg-rose-50 border-4 border-white dark:border-slate-800 shadow-lg" 
              />
              <button 
                onClick={() => setAvatarSeed(Math.random().toString(36).substr(2, 5))}
                className="absolute bottom-0 right-0 bg-[#FF385C] hover:bg-rose-650 text-white p-2 rounded-full cursor-pointer transition-all shadow-md"
                title="Randomize Avatar Seed"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-black mt-3 text-slate-950 dark:text-white">{name}</h3>
            <span className="text-xs text-gray-400 font-bold mt-0.5">{email}</span>

            <div className="flex items-center gap-1.5 mt-3 select-none">
              {passportVerified ? (
                <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-black border border-emerald-100 dark:border-emerald-900/10 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Passport Verified</span>
                </span>
              ) : (
                <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[10px] px-2.5 py-1 rounded-full font-black border border-amber-100 dark:border-amber-900/10">
                  ⚠️ Verification Pending
                </span>
              )}
              <span className="bg-rose-50 dark:bg-rose-950/10 text-rose-500 text-[10px] px-2.5 py-1 rounded-full font-black border border-rose-100/10">
                Superhost Ally
              </span>
            </div>

            {/* Travel metrics stats */}
            <div className="grid grid-cols-3 gap-2 w-full pt-6 mt-6 border-t border-gray-200 dark:border-gray-800/60 select-none">
              <div className="text-center">
                <span className="block text-lg font-black text-slate-950 dark:text-white font-mono">18</span>
                <span className="block text-[8px] text-gray-400 uppercase font-bold tracking-wider">Nights Stayed</span>
              </div>
              <div className="text-center border-x border-gray-200 dark:border-gray-800/60">
                <span className="block text-lg font-black text-slate-950 dark:text-white font-mono">4</span>
                <span className="block text-[8px] text-gray-400 uppercase font-bold tracking-wider">Properties</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-black text-rose-500 font-mono">5.0 ★</span>
                <span className="block text-[8px] text-gray-400 uppercase font-bold tracking-wider">Guest Score</span>
              </div>
            </div>
          </div>

          {/* Secure passport check scanner */}
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-3xl text-white space-y-4">
            <div className="text-left select-none">
              <span className="text-[9px] uppercase font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tracking-wider">Secure Identity check</span>
              <h4 className="text-base font-black mt-2">Airbnb Passport Scan</h4>
              <p className="text-[11px] text-gray-300 font-medium leading-relaxed mt-1">
                To reserve highly-rated custom spaces safely, upload a photo verification or mock passport scanner credentials to win the premium emerald badge.
              </p>
            </div>

            {isScanning ? (
              <div className="bg-slate-900 p-4 rounded-xl text-center space-y-3.5 border border-slate-800/80 animate-pulse">
                <Fingerprint className="w-10 h-10 mx-auto text-emerald-400 animate-bounce" />
                <span className="text-[11px] text-emerald-400 font-black tracking-widest uppercase block">Checking biocredentials and passports...</span>
              </div>
            ) : scanSuccess ? (
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl text-center space-y-2 animate-fade-in text-emerald-400">
                <Check className="w-7 h-7 mx-auto stroke-[3]" />
                <span className="text-[11px] font-black uppercase tracking-wider block">ID checked successfully! Badge assigned.</span>
              </div>
            ) : (
              <button
                onClick={handlePassportVerify}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Fingerprint className="w-4.5 h-4.5" />
                <span>Simulate Passport Check</span>
              </button>
            )}
          </div>

          {/* Environmental carbon offset */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl text-left space-y-2 select-none">
            <h4 className="text-xs uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              <span>Green Travel Metrics</span>
            </h4>
            <p className="text-[11.5px] text-gray-500 dark:text-gray-400 font-semibold leading-normal">
              By reserving sustainable cabins, you have offset approximately <b className="text-slate-950 dark:text-white">42 kg of CO2 equivalent emissions</b> this summer.
            </p>
          </div>

        </div>

        {/* Right Side: Account configurations form */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          
          {/* Main settings container */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
            
            <div className="text-left select-none">
              <span className="text-[10px] uppercase font-black text-[#FF385C] tracking-widest block font-bold">Manage profile details</span>
              <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight mt-1">Personal Account Settings</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Update your guest itinerary biography, toggle push security indicators, and manage accounts.</p>
            </div>

            {updateFeedback && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 p-3.5 rounded-xl text-xs text-emerald-800 dark:text-emerald-400 font-bold text-left animate-fade-in flex gap-2">
                <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                <span>{updateFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Your Full name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:border-[#FF385C]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Primary Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:border-[#FF385C]"
                  />
                </div>

                {/* Hometown */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Where you live</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kyoto, Japan"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:border-[#FF385C]"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Languages spoken</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g. English, Japanese"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:border-[#FF385C]"
                  />
                </div>

              </div>

              {/* Biography details */}
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">About you / biography</label>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Share a short summary about your travelers tastes..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:border-[#FF385C] outline-none resize-none"
                />
              </div>

              {/* Push alert settings */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-5 space-y-4 text-left">
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-950 dark:text-white flex items-center gap-1.5 select-none">
                  <Bell className="w-4 h-4 text-rose-500" />
                  <span>Notification & Alert Systems</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 cursor-pointer text-xs font-bold text-slate-800 dark:text-gray-300">
                    <input 
                      type="checkbox" 
                      checked={notifySMS}
                      onChange={(e) => setNotifySMS(e.target.checked)}
                      className="accent-[#FF385C] scale-110" 
                    />
                    <span>SMS Key reminders</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 cursor-pointer text-xs font-bold text-slate-800 dark:text-gray-300">
                    <input 
                      type="checkbox" 
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="accent-[#FF385C] scale-110" 
                    />
                    <span>Email Invoices</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 cursor-pointer text-xs font-bold text-slate-800 dark:text-gray-300">
                    <input 
                      type="checkbox" 
                      checked={notifyDeals}
                      onChange={(e) => setNotifyDeals(e.target.checked)}
                      className="accent-[#FF385C] scale-110" 
                    />
                    <span>Discount Promos</span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-[#FF385C] hover:bg-[#e62e50] text-white py-3.5 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer text-center font-bold"
                >
                  {isUpdating ? 'Synchronizing fields...' : 'Save Profile Coordination'}
                </button>
                <button
                  type="button"
                  onClick={handleResetUser}
                  className="bg-slate-100 hover:bg-rose-50 text-gray-500 dark:bg-slate-950 dark:hover:bg-rose-950/20 hover:text-rose-500 py-3.5 px-6 rounded-xl text-xs font-black transition-all cursor-pointer text-center flex items-center gap-1 border border-transparent hover:border-rose-100/30"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sign out Account</span>
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
