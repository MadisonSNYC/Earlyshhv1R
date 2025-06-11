import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Navigation } from "lucide-react";
import { Campaign } from "@shared/schema";

interface MapViewProps {
  campaigns: Campaign[];
  onCouponClaimed?: (coupon: any) => void;
}

export default function MapView({ campaigns, onCouponClaimed }: MapViewProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Brooklyn locations near 120 Bedford Ave
  const brooklynLocations = [
    { name: "Café Grumpy", address: "193 Meserole Ave", distance: "0.2 mi", type: "coffee", position: { top: "25%", left: "30%" } },
    { name: "Smorgasburg", address: "East River State Park", distance: "0.4 mi", type: "food", position: { top: "40%", right: "25%" } },
    { name: "Desert Island Comics", address: "540 Metropolitan Ave", distance: "0.3 mi", type: "retail", position: { top: "60%", left: "40%" } },
    { name: "Spuyten Duyvil", address: "359 Metropolitan Ave", distance: "0.1 mi", type: "bar", position: { bottom: "30%", right: "35%" } },
    { name: "Bagel Store", address: "754 Metropolitan Ave", distance: "0.5 mi", type: "food", position: { top: "35%", left: "60%" } }
  ];

  const handlePinClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleLocationClick = (location: any) => {
    if (campaigns.length === 0) return;
    
    // Create a campaign for the location
    const locationCampaign = {
      ...campaigns[0],
      id: Math.random(),
      brandName: location.name,
      offerDescription: getOfferForType(location.type),
      productName: location.address,
      brandLogoUrl: "",
      latitude: "40.7128",
      longitude: "-73.9578"
    };
    setSelectedCampaign(locationCampaign);
  };

  const getOfferForType = (type: string) => {
    switch (type) {
      case "coffee": return "20% off your morning coffee";
      case "food": return "Free appetizer with entrée";
      case "retail": return "$10 off purchases over $50";
      case "bar": return "Happy hour pricing all day";
      default: return "Exclusive early access discount";
    }
  };

  const getPinColor = (type: string) => {
    switch (type) {
      case "coffee": return "bg-amber-500";
      case "food": return "bg-green-500";
      case "retail": return "bg-purple-500";
      case "bar": return "bg-blue-500";
      default: return "bg-pink-500";
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "coffee": return "☕";
      case "food": return "🍽️";
      case "retail": return "🛍️";
      case "bar": return "🍻";
      default: return "🎫";
    }
  };

  return (
    <div className="relative h-full electric-bg overflow-hidden">
      {/* Brooklyn Map Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          {/* Street grid pattern for Williamsburg */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `repeating-linear-gradient(15deg, transparent, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 32px), repeating-linear-gradient(105deg, transparent, transparent 25px, rgba(255,255,255,0.1) 25px, rgba(255,255,255,0.1) 27px)`
            }}
          />
          
          {/* East River representation */}
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-blue-900/30 to-transparent"></div>
          
          {/* Bedford Ave street line */}
          <div className="absolute left-1/3 top-0 w-1 h-full bg-white/10"></div>
          
          {/* Metropolitan Ave street line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10"></div>
        </div>
      </div>

      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="glass-morphism rounded-2xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-rubik font-bold text-lg">Williamsburg</h2>
              <p className="text-gray-300 font-space text-sm">5 discoveries nearby</p>
            </div>
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost" className="glass-morphism">
                <Plus className="h-4 w-4 text-white" />
              </Button>
              <Button size="icon" variant="ghost" className="glass-morphism">
                <Minus className="h-4 w-4 text-white" />
              </Button>
              <Button size="icon" variant="ghost" className="glass-morphism">
                <Navigation className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Your Location (120 Bedford Ave) */}
      <div className="absolute" style={{ top: "50%", left: "35%" }}>
        <div className="relative">
          <div className="w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="w-8 h-8 bg-cyan-400 opacity-20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded font-space">You are here</div>
          </div>
        </div>
      </div>

      {/* Brooklyn Business Pins */}
      {brooklynLocations.map((location, index) => (
        <div
          key={index}
          className="absolute cursor-pointer"
          style={location.position}
          onClick={() => handleLocationClick(location)}
        >
          <div className="relative group">
            <div className={`w-10 h-10 ${getPinColor(location.type)} rounded-full border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-110 transition-all duration-300 earlyshh-gradient`}>
              {getIconForType(location.type)}
            </div>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white absolute top-full left-1/2 transform -translate-x-1/2"></div>
            
            {/* Hover tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg font-space">
                <div className="font-semibold">{location.name}</div>
                <div className="text-gray-300">{location.distance}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Brooklyn Business Bottom Sheet */}
      {selectedCampaign && (
        <div className="absolute bottom-0 left-0 right-0 glass-morphism border-t border-white/20 rounded-t-3xl p-5 shadow-2xl mobile-safe-area">
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4"></div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 earlyshh-gradient rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">{selectedCampaign.brandName[0]}</span>
            </div>
            <div>
              <h3 className="font-rubik font-bold text-white text-lg">{selectedCampaign.brandName}</h3>
              <p className="font-space text-gray-300 text-sm">{selectedCampaign.productName}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-rubik font-semibold text-white mb-2">{selectedCampaign.offerDescription}</h4>
            <p className="text-xl font-rubik font-bold earlyshh-text-gradient">Up to ${selectedCampaign.redeemableAmount}</p>
          </div>
          
          <Button 
            className="w-full btn-electric mobile-touch"
            onClick={() => setSelectedCampaign(null)}
          >
            Get Early Access
          </Button>
        </div>
      )}
    </div>
  );
}
