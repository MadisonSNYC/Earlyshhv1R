import React, { useState, useEffect } from 'react';
import { MapPin, List, Filter, Clock, Users, TrendingUp, Instagram, QrCode, Share2, ChevronLeft, Star, Navigation, Heart, Search } from 'lucide-react';

const EarlyshhMockup = () => {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState(['All']);

  // Handle loading screen transition
  useEffect(() => {
    if (currentScreen === 'loading') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 3000); // Show loading for 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Mock data
  const mockUser = {
    id: 'user_123',
    username: 'maya_discovers',
    name: 'Maya Chen',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    following: 892,
    followers: 1247
  };

  const mockCampaigns = [
    {
      id: 'energy_001',
      brandName: 'Peak Energy',
      brandHandle: '@peakenergy',
      productName: 'Natural Energy Drink',
      offerDescription: 'Free sample up to $2.99',
      brandLogo: '⚡',
      category: 'Drinks',
      distance: '0.2 mi',
      slotsRemaining: 47,
      totalSlots: 100,
      location: { lat: 40.7589, lng: -73.9851, name: 'Corner Market' },
      redeemableAmount: '$2.99',
      legalText: 'Redeemable up to $2.99. One per customer. Terms apply.',
      expiresAt: '2025-07-31',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=200&fit=crop'
    },
    {
      id: 'cosmic_002', 
      brandName: 'Cosmic Brownies Co',
      brandHandle: '@cosmicbrownies',
      productName: 'Galaxy Fudge Brownie',
      offerDescription: '$2 off any brownie',
      brandLogo: '🌌',
      category: 'Food',
      distance: '0.4 mi',
      slotsRemaining: 23,
      totalSlots: 75,
      location: { lat: 40.7505, lng: -73.9934, name: 'Corner Deli Plus' },
      redeemableAmount: '$2.00',
      legalText: 'Redeemable up to $2.00. Valid on any brownie flavor.',
      expiresAt: '2025-06-30',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop'
    },
    {
      id: 'brew_003',
      brandName: 'Local Brew Co',
      brandHandle: '@localbrewco',
      productName: 'Cold Brew Coffee',
      offerDescription: 'Buy one get one 50% off',
      brandLogo: '☕',
      category: 'Drinks',
      distance: '0.6 mi', 
      slotsRemaining: 8,
      totalSlots: 50,
      location: { lat: 40.7614, lng: -73.9776, name: 'Quick Stop Market' },
      redeemableAmount: '$4.50',
      legalText: 'Second item 50% off. Equal or lesser value.',
      expiresAt: '2025-08-15',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop'
    }
  ];

  const filterCategories = ['All', 'Food', 'Drinks', 'Beauty', 'Tech', 'Lifestyle'];

  const generateQRData = (campaign) => {
    return `earlyshh://redeem/${campaign.id}/${Date.now()}`;
  };

  const generateFetchCode = () => {
    return Array.from({length: 4}, () => 
      Math.floor(1000 + Math.random() * 9000)
    ).join('-');
  };

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-lime-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-br from-yellow-500/25 to-pink-500/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-lime-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0">
        {/* Triangular shapes inspired by the logo */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 transform rotate-45 animate-bounce opacity-70" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-gradient-to-br from-lime-500 to-yellow-500 transform rotate-12 animate-pulse opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 transform -rotate-12 animate-bounce opacity-50" style={{animationDelay: '1.5s'}}></div>
        
        {/* Sparkle elements */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              fontSize: '12px'
            }}
          >
            ✨
          </div>
        ))}
      </div>
      
      {/* Main Logo Recreation */}
      <div className="relative z-10 text-center">
        <div className="mb-8 relative">
          {/* Shopping Bag Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Bag Body */}
              <div className="w-16 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg relative border-4 border-purple-900 shadow-lg">
                {/* Bag Handles */}
                <div className="absolute -top-3 left-2 w-3 h-6 border-4 border-pink-500 rounded-full bg-transparent"></div>
                <div className="absolute -top-3 right-2 w-3 h-6 border-4 border-pink-500 rounded-full bg-transparent"></div>
                
                {/* Bag Design Elements */}
                <div className="absolute top-2 left-1 w-3 h-1 bg-pink-500 rounded"></div>
                <div className="absolute top-4 left-1 w-4 h-1 bg-cyan-500 rounded"></div>
                <div className="absolute top-6 left-2 w-2 h-1 bg-lime-500 rounded"></div>
              </div>
              
              {/* Geometric Accents */}
              <div className="absolute -top-2 -right-3 w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-400 transform rotate-45 rounded-sm"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-lime-500 to-lime-400 transform rotate-12 rounded-sm"></div>
              <div className="absolute top-3 -right-5 w-3 h-3 bg-gradient-to-br from-pink-500 to-pink-400 transform -rotate-12 rounded-sm"></div>
            </div>
          </div>
          
          {/* 3D Style EARLYSHH Text */}
          <div className="relative">
            {/* Shadow layers for 3D effect */}
            <h1 
              className="text-5xl font-black absolute transform translate-x-1 translate-y-1"
              style={{
                fontFamily: "'Rubik', sans-serif",
                color: '#7C3AED',
                textShadow: '2px 2px 0px #EC4899'
              }}
            >
              EARLYSHH
            </h1>
            <h1 
              className="text-5xl font-black absolute transform translate-x-0.5 translate-y-0.5"
              style={{
                fontFamily: "'Rubik', sans-serif",
                color: '#06B6D4'
              }}
            >
              EARLYSHH
            </h1>
            {/* Main text */}
            <h1 
              className="text-5xl font-black relative"
              style={{
                fontFamily: "'Rubik', sans-serif",
                color: '#F8FAFC',
                textShadow: '0 0 20px rgba(255,255,255,0.5)'
              }}
            >
              EARLYSHH
            </h1>
          </div>
          
          {/* Sparkle Effects */}
          <div className="absolute -top-2 -right-4 text-2xl animate-pulse">✨</div>
          <div className="absolute -bottom-2 -left-4 text-xl animate-pulse delay-500">✨</div>
          
          {/* Tagline */}
          <p 
            className="text-purple-200 text-lg font-medium opacity-90 mt-6"
            style={{fontFamily: "'Space Grotesk', sans-serif"}}
          >
            Electric Playground
          </p>
        </div>
        
        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-2 mt-12">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: i === 0 ? '#EC4899' : i === 1 ? '#06B6D4' : '#84CC16',
                  animation: `loadingBounce 1.4s ease-in-out ${i * 0.16}s infinite`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Loading Text */}
        <p 
          className="text-purple-300 text-sm mt-6 animate-pulse"
          style={{fontFamily: "'Space Grotesk', sans-serif"}}
        >
          Loading your deals...
        </p>
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes loadingBounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 text-center mb-12">
        <div className="text-6xl mb-6 animate-bounce">🔥</div>
        <h1 className="text-5xl font-black mb-4" style={{
          fontFamily: "'Rubik', sans-serif",
          color: '#F8FAFC',
          textShadow: '2px 2px 0px #EC4899, 4px 4px 0px #06B6D4, 0 0 20px rgba(255,255,255,0.3)'
        }}>
          EARLYSHH
        </h1>
        <p className="text-gray-300 text-lg font-medium" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
          Electric Playground • Discover • Redeem • Share
        </p>
      </div>
      
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm border border-white/20 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center" style={{fontFamily: "'Rubik', sans-serif"}}>
          Find amazing deals near you
        </h2>
        
        <button 
          onClick={() => {
            setUser(mockUser);
            setCurrentScreen('discovery');
          }}
          className="w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          style={{
            background: 'linear-gradient(45deg, #FF1493, #00D4FF)',
            color: 'white',
            fontFamily: "'Rubik', sans-serif",
            boxShadow: '0 10px 30px rgba(255, 20, 147, 0.3)'
          }}
        >
          <Instagram size={24} />
          Continue with Instagram
        </button>
        
        <p className="text-xs text-gray-400 text-center mt-4">
          By continuing, you agree to our Terms and Privacy Policy
        </p>
      </div>
      
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );

  const DiscoveryScreen = () => {
    const filteredCampaigns = filters.includes('All') 
      ? mockCampaigns 
      : mockCampaigns.filter(c => filters.includes(c.category));

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-lg border-b border-white/10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img 
                  src={user.profilePic} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
                <div>
                  <p className="font-bold text-white text-lg" style={{fontFamily: "'Rubik', sans-serif"}}>
                    Hey {user.name.split(' ')[0]}! 👋
                  </p>
                  <p className="text-gray-400 text-sm">3 deals near you</p>
                </div>
              </div>
              <div className="text-3xl animate-pulse">🔥</div>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search deals near you..."
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl py-4 px-6 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                style={{fontFamily: "'Space Grotesk', sans-serif"}}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex bg-white/10 backdrop-blur-lg rounded-xl p-1 border border-white/20">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{fontFamily: "'Rubik', sans-serif"}}
                >
                  <List size={16} className="inline mr-2" />
                  List
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                    viewMode === 'map' 
                      ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{fontFamily: "'Rubik', sans-serif"}}
                >
                  <MapPin size={16} className="inline mr-2" />
                  Map
                </button>
              </div>
              
              <button className="p-3 text-gray-300 hover:text-white transition-colors bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                <Filter size={20} />
              </button>
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {filterCategories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    if (category === 'All') {
                      setFilters(['All']);
                    } else {
                      setFilters(prev => 
                        prev.includes('All') 
                          ? [category]
                          : prev.includes(category)
                            ? prev.filter(f => f !== category)
                            : [...prev.filter(f => f !== 'All'), category]
                      );
                    }
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    filters.includes(category)
                      ? 'bg-gradient-to-r from-yellow-400 to-green-400 text-black shadow-lg'
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                  }`}
                  style={{fontFamily: "'Space Grotesk', sans-serif"}}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="p-4 space-y-4">
            {filteredCampaigns.map(campaign => (
              <div 
                key={campaign.id}
                onClick={() => {
                  setSelectedCampaign(campaign);
                  setCurrentScreen('campaign-detail');
                }}
                className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6 active:scale-[0.98] transition-all duration-300 cursor-pointer hover:bg-white/10 hover:border-white/20 relative overflow-hidden"
              >
                {/* Gradient Border Effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500"></div>
                
                <div className="flex gap-4">
                  <div className="relative">
                    <img 
                      src={campaign.image} 
                      alt={campaign.productName}
                      className="w-24 h-24 rounded-2xl object-cover border border-white/20"
                    />
                    <div className="absolute -top-2 -right-2 text-3xl">
                      {campaign.brandLogo}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg" style={{fontFamily: "'Rubik', sans-serif"}}>
                          {campaign.brandName}
                        </h3>
                        <p className="text-gray-300" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
                          {campaign.productName}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Navigation size={12} />
                        {campaign.distance}
                      </span>
                    </div>
                    
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-green-400 text-black px-4 py-2 rounded-full font-bold text-sm mb-3">
                      {campaign.offerDescription}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">{campaign.location.name}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                          {campaign.slotsRemaining} left
                        </span>
                        <Heart size={16} className="text-gray-400 hover:text-pink-500 transition-colors cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative h-[calc(100vh-280px)] bg-gray-900 overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
              {/* Street Grid Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-30">
                <defs>
                  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4B5563" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              
              {/* Simulated Streets */}
              <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-600"></div>
              <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-600"></div>
              <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-600"></div>
              <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-gray-600"></div>
              
              {/* Main Avenue */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-500 transform -rotate-12 origin-center"></div>
            </div>
            
            {/* User Location (Blue Dot) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                {/* Geofence Circle */}
                <div className="w-32 h-32 border-2 border-cyan-400/50 rounded-full bg-cyan-400/10 animate-pulse"></div>
                {/* User Dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Deal Pins */}
            {filteredCampaigns.map((campaign, index) => (
              <div 
                key={campaign.id}
                className="absolute z-10 cursor-pointer transform hover:scale-110 transition-all duration-300"
                style={{
                  top: `${25 + index * 15}%`,
                  left: `${30 + index * 20}%`
                }}
                onClick={() => {
                  setSelectedCampaign(campaign);
                  setCurrentScreen('campaign-detail');
                }}
              >
                {/* Pin Shadow */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black/30 rounded-full blur-sm"></div>
                
                {/* Pin Body */}
                <div className="relative">
                  {/* Pin Background */}
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                    <div className="text-xl">{campaign.brandLogo}</div>
                  </div>
                  
                  {/* Pin Point */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>
                  
                  {/* Slots Remaining Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-lime-400 text-black text-xs font-bold px-2 py-1 rounded-full border border-white shadow-lg">
                    {campaign.slotsRemaining}
                  </div>
                </div>
                
                {/* Hover Info Card */}
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-lg text-white p-3 rounded-xl border border-white/20 shadow-xl opacity-0 hover:opacity-100 transition-opacity duration-300 w-48 pointer-events-none">
                  <h3 className="font-bold text-sm mb-1" style={{fontFamily: "'Rubik', sans-serif"}}>
                    {campaign.brandName}
                  </h3>
                  <p className="text-xs text-gray-300 mb-1">{campaign.productName}</p>
                  <p className="text-xs font-semibold" style={{
                    background: 'linear-gradient(45deg, #FFD700, #32CD32)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {campaign.offerDescription}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">📍 {campaign.distance}</p>
                </div>
              </div>
            ))}
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-30 space-y-3">
              {/* Zoom Controls */}
              <div className="bg-black/50 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <button className="block w-10 h-10 text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                  <span className="text-xl font-bold">+</span>
                </button>
                <div className="w-full h-px bg-white/20"></div>
                <button className="block w-10 h-10 text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                  <span className="text-xl font-bold">−</span>
                </button>
              </div>
              
              {/* My Location Button */}
              <button className="w-10 h-10 bg-black/50 backdrop-blur-lg rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              </button>
            </div>
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-30 bg-black/80 backdrop-blur-lg rounded-2xl border border-white/20 p-4 max-w-48">
              <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2" style={{fontFamily: "'Rubik', sans-serif"}}>
                <div className="w-4 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded border border-purple-800 relative">
                  <div className="absolute -top-0.5 left-0.5 w-0.5 h-1 border border-pink-500 rounded-full bg-transparent"></div>
                  <div className="absolute -top-0.5 right-0.5 w-0.5 h-1 border border-pink-500 rounded-full bg-transparent"></div>
                </div>
                Map Legend
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"></div>
                  <span className="text-gray-300">Available Deals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-cyan-400/50 rounded-full"></div>
                  <span className="text-gray-300">0.5mi Radius</span>
                </div>
              </div>
            </div>
            
            {/* Search Results Counter */}
            <div className="absolute top-4 left-4 z-30 bg-black/80 backdrop-blur-lg rounded-2xl border border-white/20 px-4 py-2">
              <p className="text-white text-sm font-semibold" style={{fontFamily: "'Rubik', sans-serif"}}>
                {filteredCampaigns.length} deals nearby
              </p>
            </div>
            
            {/* Quick Filters Overlay */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
              <div className="flex gap-2">
                <button className="bg-gradient-to-r from-yellow-400 to-lime-400 text-black px-4 py-2 rounded-full text-xs font-bold border border-white/20 shadow-lg">
                  All Categories
                </button>
                <button className="bg-black/50 backdrop-blur-lg text-white px-4 py-2 rounded-full text-xs font-semibold border border-white/20">
                  Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CampaignDetailScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="relative">
        <img 
          src={selectedCampaign.image} 
          alt={selectedCampaign.productName}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <button 
          onClick={() => setCurrentScreen('discovery')}
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-lg text-white p-3 rounded-full border border-white/20 hover:bg-black/70 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="absolute bottom-4 right-4 text-5xl drop-shadow-lg">
          {selectedCampaign.brandLogo}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2">
            <span className="text-xs text-gray-300">Partnership with</span>
            <span className="text-sm font-bold text-white ml-2" style={{
              color: '#F8FAFC',
              textShadow: '1px 1px 0px #EC4899, 2px 2px 0px #06B6D4',
              fontFamily: "'Rubik', sans-serif"
            }}>
              🛍️ EARLYSHH
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white mb-2" style={{fontFamily: "'Rubik', sans-serif"}}>
              {selectedCampaign.brandName}
            </h1>
            <p className="text-gray-300 text-lg" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
              {selectedCampaign.productName}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400/20 to-green-400/20 border border-yellow-400/30 rounded-3xl p-6 mb-8 backdrop-blur-lg">
          <p className="text-3xl font-black mb-2" style={{
            fontFamily: "'Rubik', sans-serif",
            background: 'linear-gradient(45deg, #FFD700, #32CD32)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {selectedCampaign.offerDescription}
          </p>
          <p className="text-yellow-400 text-sm font-semibold">
            Limited time • {selectedCampaign.slotsRemaining} remaining
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold text-white" style={{fontFamily: "'Rubik', sans-serif"}}>
                {selectedCampaign.location.name}
              </p>
              <p className="text-gray-400 text-sm">{selectedCampaign.distance} away</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Clock className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold text-white" style={{fontFamily: "'Rubik', sans-serif"}}>
                Expires {selectedCampaign.expiresAt}
              </p>
              <p className="text-gray-400 text-sm">Redeem anytime before expiration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold text-white" style={{fontFamily: "'Rubik', sans-serif"}}>
                {selectedCampaign.slotsRemaining} slots remaining
              </p>
              <p className="text-gray-400 text-sm">Out of {selectedCampaign.totalSlots} total</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            const newCoupon = {
              ...selectedCampaign,
              couponId: `coupon_${Date.now()}`,
              qrData: generateQRData(selectedCampaign),
              fetchCode: generateFetchCode(),
              claimedAt: new Date().toISOString(),
              status: 'claimed'
            };
            setClaimedCoupon(newCoupon);
            setCurrentScreen('coupon-display');
          }}
          className="w-full py-5 px-6 rounded-3xl font-black text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          style={{
            background: 'linear-gradient(45deg, #FF1493, #00D4FF)',
            color: 'white',
            fontFamily: "'Rubik', sans-serif",
            boxShadow: '0 15px 40px rgba(255, 20, 147, 0.3)'
          }}
        >
          Claim Your Deal 🔥
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
          {selectedCampaign.legalText}
        </p>
      </div>
    </div>
  );

  const CouponDisplayScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setCurrentScreen('discovery')}
            className="p-3 text-gray-300 hover:text-white transition-colors bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white" style={{
            fontFamily: "'Rubik', sans-serif",
            color: '#F8FAFC',
            textShadow: '1px 1px 0px #EC4899'
          }}>
            Your Digital Coupon
          </h1>
          <div className="w-8"></div>
        </div>
        
        {/* Brand Logos */}
        <div className="flex items-center justify-between mb-8 p-6 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
          <div className="text-5xl">{claimedCoupon.brandLogo}</div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Partnership with</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded border border-purple-800 relative">
                <div className="absolute -top-0.5 left-0.5 w-0.5 h-1 border border-pink-500 rounded-full bg-transparent"></div>
                <div className="absolute -top-0.5 right-0.5 w-0.5 h-1 border border-pink-500 rounded-full bg-transparent"></div>
              </div>
              <p className="text-xl font-black" style={{
                fontFamily: "'Rubik', sans-serif",
                color: '#F8FAFC',
                textShadow: '1px 1px 0px #EC4899, 2px 2px 0px #06B6D4'
              }}>
                EARLYSHH
              </p>
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-3" style={{fontFamily: "'Rubik', sans-serif"}}>
            {claimedCoupon.brandName}
          </h2>
          <p className="text-xl text-gray-300 mb-6" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
            {claimedCoupon.productName}
          </p>
          <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border-2 border-green-400 rounded-3xl p-6 backdrop-blur-lg">
            <p className="text-3xl font-black mb-2" style={{
              fontFamily: "'Rubik', sans-serif",
              background: 'linear-gradient(45deg, #32CD32, #00FF7F)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Redeemable up to {claimedCoupon.redeemableAmount}
            </p>
            <p className="text-green-400 text-sm font-semibold">Show this code at checkout</p>
          </div>
        </div>
        
        {/* QR Code */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-white/20">
          <div className="text-center">
            <div className="w-52 h-52 mx-auto bg-black rounded-2xl flex items-center justify-center mb-6 border-4 border-gray-800">
              <div className="text-center">
                <QrCode size={120} className="text-white mx-auto mb-2" />
                <div className="text-xs text-gray-300 font-mono">8112 FORMAT</div>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4 font-semibold">
              Scan at checkout or enter code below:
            </p>
            <p className="text-2xl font-black text-gray-800 tracking-wider mb-4" style={{fontFamily: "'Monaco', monospace"}}>
              {claimedCoupon.fetchCode}
            </p>
            <div className="text-xs text-gray-600">
              <p>Date fetched: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* Expiration & Terms */}
        <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-2xl p-4 mb-6 backdrop-blur-lg">
          <p className="text-sm font-bold text-yellow-400">Expires: {claimedCoupon.expiresAt}</p>
          <p className="text-xs text-yellow-300 mt-1">Valid for limited time only</p>
        </div>
        
        {/* Redeem Button */}
        <button 
          onClick={() => {
            setClaimedCoupon({...claimedCoupon, status: 'redeemed', redeemedAt: new Date().toISOString()});
            setCurrentScreen('story-prompt');
          }}
          className="w-full py-5 px-6 rounded-3xl font-black text-lg mb-4 transition-all duration-300 transform hover:scale-105"
          style={{
            background: 'linear-gradient(45deg, #32CD32, #00FF7F)',
            color: 'black',
            fontFamily: "'Rubik', sans-serif",
            boxShadow: '0 15px 40px rgba(50, 205, 50, 0.3)'
          }}
        >
          ✅ Mark as Redeemed
        </button>
        
        <p className="text-xs text-gray-500 text-center" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
          {claimedCoupon.legalText}
        </p>
      </div>
    </div>
  );

  const StoryPromptScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm text-center border border-white/20 shadow-2xl">
        <div className="text-7xl mb-6">🛍️</div>
        <h1 className="text-3xl font-black text-white mb-4" style={{
          fontFamily: "'Rubik', sans-serif",
          color: '#F8FAFC',
          textShadow: '2px 2px 0px #EC4899, 4px 4px 0px #06B6D4'
        }}>
          Awesome!
        </h1>
        <p className="text-white/90 text-lg mb-8" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
          You just saved {claimedCoupon.redeemableAmount} on {claimedCoupon.productName}!
        </p>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <p className="text-white font-bold mb-3" style={{fontFamily: "'Rubik', sans-serif"}}>
            Share your discovery! ✨
          </p>
          <p className="text-white/80 text-sm" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
            Tag @earlyshh and {claimedCoupon.brandHandle} in your Story to help others discover this deal
          </p>
        </div>
        
        <button 
          onClick={() => {
            alert(`Opening Instagram Stories...\n\nTemplate: "Just discovered ${claimedCoupon.brandHandle} through @earlyshh! ${claimedCoupon.brandLogo}✨ This ${claimedCoupon.productName} is amazing! #EarlyshhFinds"`);
          }}
          className="w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 mb-4 transition-all duration-300 transform hover:scale-105"
          style={{
            background: 'linear-gradient(45deg, #FF1493, #00D4FF)',
            color: 'white',
            fontFamily: "'Rubik', sans-serif",
            boxShadow: '0 15px 40px rgba(255, 20, 147, 0.3)'
          }}
        >
          <Instagram size={24} />
          Share on Instagram
        </button>
        
        <button 
          onClick={() => setCurrentScreen('discovery')}
          className="w-full border-2 border-white/30 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/10"
          style={{fontFamily: "'Rubik', sans-serif"}}
        >
          Maybe Later
        </button>
        
        <p className="text-white/60 text-xs mt-6" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
          Sharing helps others discover amazing local deals!
        </p>
      </div>
    </div>
  );

  const UserDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <img 
              src={user.profilePic} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-4 border-white/20"
            />
            <div>
              <h1 className="text-2xl font-black text-white" style={{
                fontFamily: "'Rubik', sans-serif",
                color: '#F8FAFC',
                textShadow: '1px 1px 0px #EC4899'
              }}>
                @{user.username}
              </h1>
              <p className="text-gray-300 text-lg" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
                {user.name}
              </p>
              <div className="flex gap-6 mt-2">
                <span className="text-sm text-gray-400">{user.followers} followers</span>
                <span className="text-sm text-gray-400">{user.following} following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Discovery Impact Score */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-7 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded border-2 border-purple-800 relative">
                <div className="absolute -top-1 left-0.5 w-1 h-2 border-2 border-pink-500 rounded-full bg-transparent"></div>
                <div className="absolute -top-1 right-0.5 w-1 h-2 border-2 border-pink-500 rounded-full bg-transparent"></div>
              </div>
              <h3 className="text-cyan-400 font-bold text-sm" style={{fontFamily: "'Rubik', sans-serif"}}>
                PREMIUM DISCOVERER
              </h3>
            </div>
            <h2 className="text-white text-xl font-bold mb-6" style={{fontFamily: "'Rubik', sans-serif"}}>
              Discovery Impact Score
            </h2>
            
            {/* Circular Score */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Background Circle */}
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#374151"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${88 * 2.51} ${100 * 2.51}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#84CC16" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black" style={{
                  fontFamily: "'Rubik', sans-serif",
                  background: 'linear-gradient(45deg, #FFD700, #32CD32)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  88
                </span>
                <span className="text-yellow-400 font-bold text-lg" style={{fontFamily: "'Rubik', sans-serif"}}>
                  Excellent
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              You're in the top <span className="text-yellow-400 font-bold">12%</span> of discovery creators!
            </p>
            
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105">
              📈 Boost Score
            </button>
          </div>
        </div>

        {/* Creator Demographics */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2" style={{fontFamily: "'Rubik', sans-serif"}}>
            📊 Creator Demographics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black mb-1" style={{
                fontFamily: "'Rubik', sans-serif",
                background: 'linear-gradient(45deg, #EC4899, #7B2D8E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                22
              </p>
              <p className="text-gray-400 text-sm">Age</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black mb-1" style={{
                fontFamily: "'Rubik', sans-serif",
                background: 'linear-gradient(45deg, #06B6D4, #0EA5E9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                NYC
              </p>
              <p className="text-gray-400 text-sm">Location</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black mb-1" style={{
                fontFamily: "'Rubik', sans-serif",
                background: 'linear-gradient(45deg, #84CC16, #22C55E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                12.4%
              </p>
              <p className="text-gray-400 text-sm">Engagement</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black mb-1" style={{
                fontFamily: "'Rubik', sans-serif",
                background: 'linear-gradient(45deg, #F59E0B, #EAB308)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                8.2K
              </p>
              <p className="text-gray-400 text-sm">Avg. Views</p>
            </div>
          </div>
        </div>

        {/* Completed Discoveries */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
          <h3 className="text-white font-bold text-lg mb-4" style={{fontFamily: "'Rubik', sans-serif"}}>
            🎯 Completed Discoveries
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl">
                ⚡
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold" style={{fontFamily: "'Rubik', sans-serif"}}>
                  Peak Energy - Corner Market
                </h4>
                <p className="text-gray-400 text-sm">3 days ago</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 relative">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke="#374151"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke="#22C55E"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${92 * 0.88} ${100 * 0.88}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-green-400 font-bold text-xs">92</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
                🌌
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold" style={{fontFamily: "'Rubik', sans-serif"}}>
                  Cosmic Brownies - Deli Plus
                </h4>
                <p className="text-gray-400 text-sm">1 week ago</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 relative">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke="#374151"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke="#F59E0B"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${85 * 0.88} ${100 * 0.88}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-xs">85</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-brown-600 to-yellow-700 rounded-full flex items-center justify-center text-xl">
                ☕
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold" style={{fontFamily: "'Rubik', sans-serif"}}>
                  Local Brew Co - Quick Stop
                </h4>
                <p className="text-gray-400 text-sm">2 weeks ago</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 relative">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke="#374151"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke="#EF4444"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${71 * 0.88} ${100 * 0.88}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-red-400 font-bold text-xs">71</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-4 text-cyan-400 text-sm font-semibold py-2">
            Show more
          </button>
        </div>

        {/* Discover New Brands CTA */}
        <div className="bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-pink-500/30 rounded-3xl p-6 text-center backdrop-blur-lg">
          <h3 className="text-white font-bold text-lg mb-2" style={{fontFamily: "'Rubik', sans-serif"}}>
            Ready for your next discovery?
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Premium discoverers get first access to exclusive brand partnerships
          </p>
          <button 
            onClick={() => setCurrentScreen('discovery')}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105"
            style={{fontFamily: "'Rubik', sans-serif"}}
          >
            🎯 Discover New Brands
          </button>
        </div>
      </div>
    </div>
  );

  // Navigation
  const screens = {
    'loading': LoadingScreen,
    'login': LoginScreen,
    'discovery': DiscoveryScreen,
    'campaign-detail': CampaignDetailScreen,
    'coupon-display': CouponDisplayScreen,
    'story-prompt': StoryPromptScreen,
    'dashboard': UserDashboard
  };

  const CurrentScreen = screens[currentScreen];

  return (
    <div className="max-w-sm mx-auto bg-black min-h-screen border-x border-gray-800 relative overflow-hidden">
      <CurrentScreen />
      
      {/* Bottom Navigation */}
      {user && currentScreen !== 'loading' && currentScreen !== 'login' && currentScreen !== 'story-prompt' && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-black/90 backdrop-blur-lg border-t border-white/10">
          <div className="flex items-center justify-around py-4">
            <button 
              onClick={() => setCurrentScreen('discovery')}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                currentScreen === 'discovery' 
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin size={24} />
            </button>
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                currentScreen === 'dashboard' 
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users size={24} />
            </button>
          </div>
        </div>
      )}
      
      {/* Dev Tools */}
      {currentScreen !== 'loading' && (
        <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-lg text-white text-xs px-3 py-2 rounded-lg border border-white/20 z-50">
          {currentScreen}
        </div>
      )}
      
      {/* Add Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" 
        rel="stylesheet" 
      />
    </div>
  );
};

export default EarlyshhMockup;