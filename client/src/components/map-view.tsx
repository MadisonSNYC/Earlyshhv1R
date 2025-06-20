import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Navigation, MapPin } from "lucide-react";
import { Campaign } from "@shared/schema";

interface MapViewProps {
  campaigns: Campaign[];
  onCouponClaimed?: (coupon: any) => void;
  onCampaignClick?: (campaign: Campaign) => void;
}

export default function MapView({ campaigns, onCouponClaimed, onCampaignClick }: MapViewProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Brooklyn area campaign locations with realistic coordinates
  const brooklynCampaigns = [
    {
      id: 1,
      brandName: "The Roost",
      brandIgHandle: "@theroostcafe",
      brandBio: "Artisanal coffee roasters in Williamsburg",
      offerDescription: "Buy 2 coffees, get 1 free pastry",
      productName: "House Blend Coffee",
      brandLogoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=64&h=64&fit=crop",
      offerId: "ROOST001",
      redeemableAmount: "FREE PASTRY",
      latitude: "40.7081",
      longitude: "-73.9571",
      radius: "0.5km",
      status: "active",
      perUserLimit: 1,
      category: "Food & Beverage",
      position: { top: "25%", left: "35%" },
      legalDisclaimer: "Valid with purchase of 2 beverages. One per customer.",
      createdAt: new Date("2024-06-01")
    },
    {
      id: 2,
      brandName: "Brooklyn Botanicals",
      brandIgHandle: "@bkbotanicals",
      brandBio: "Plant-based skincare made in Brooklyn",
      offerDescription: "20% off first purchase + free consultation",
      productName: "Organic Face Serum",
      brandLogoUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=64&h=64&fit=crop",
      offerId: "BBT002",
      redeemableAmount: "20% OFF",
      latitude: "40.7051",
      longitude: "-73.9250",
      radius: "1km",
      status: "active",
      perUserLimit: 2,
      category: "Beauty & Health",
      position: { top: "20%", right: "30%" },
      legalDisclaimer: "Valid for new customers only. Cannot be combined with other offers.",
      createdAt: new Date("2024-06-02")
    },
    {
      id: 3,
      brandName: "Greenpoint Fitness",
      brandIgHandle: "@greenpointfit",
      brandBio: "Community-focused fitness studio in Greenpoint",
      offerDescription: "Free trial class + 20% off first month",
      productName: "Unlimited Monthly Pass",
      brandLogoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop",
      offerId: "GPF003",
      redeemableAmount: "FREE TRIAL",
      latitude: "40.7308",
      longitude: "-73.9500",
      radius: "1km",
      status: "active",
      perUserLimit: 1,
      category: "Fitness & Wellness",
      position: { top: "15%", left: "45%" },
      legalDisclaimer: "New members only. Valid ID required. One trial per person.",
      createdAt: new Date("2024-06-03")
    },
    {
      id: 4,
      brandName: "DUMBO Design Co",
      brandIgHandle: "@dumbodesignco",
      brandBio: "Handcrafted furniture and home decor",
      offerDescription: "15% off custom furniture orders",
      productName: "Custom Dining Table",
      brandLogoUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=64&h=64&fit=crop",
      offerId: "DDC004",
      redeemableAmount: "15% OFF",
      latitude: "40.7033",
      longitude: "-73.9890",
      radius: "2km",
      status: "active",
      perUserLimit: 1,
      category: "Home & Garden",
      position: { bottom: "35%", right: "15%" },
      legalDisclaimer: "Minimum order $500. Custom orders only. 6-8 week delivery.",
      createdAt: new Date("2024-06-04")
    },
    {
      id: 5,
      brandName: "Bushwick Bites",
      brandIgHandle: "@bushwickbites",
      brandBio: "Farm-to-table restaurant featuring local ingredients",
      offerDescription: "Complimentary dessert with entree purchase",
      productName: "Seasonal Tasting Menu",
      brandLogoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=64&h=64&fit=crop",
      offerId: "BB005",
      redeemableAmount: "FREE DESSERT",
      latitude: "40.6944",
      longitude: "-73.9213",
      radius: "1.5km",
      status: "active",
      perUserLimit: 1,
      category: "Food & Beverage",
      position: { bottom: "20%", left: "60%" },
      legalDisclaimer: "Valid Sunday-Thursday only. Must order entree. Dine-in only.",
      createdAt: new Date("2024-06-05")
    },
    {
      id: 6,
      brandName: "Red Hook Records",
      brandIgHandle: "@redhookrecords",
      brandBio: "Independent record store and vinyl collection",
      offerDescription: "Buy 2 vinyls, get 1 used vinyl free",
      productName: "Vinyl Record Collection",
      brandLogoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop",
      offerId: "RHR006",
      redeemableAmount: "FREE VINYL",
      latitude: "40.6762",
      longitude: "-74.0058",
      radius: "2km",
      status: "active",
      perUserLimit: 1,
      category: "Entertainment",
      position: { bottom: "45%", left: "20%" },
      legalDisclaimer: "Free vinyl must be from used section. Value up to $15.",
      createdAt: new Date("2024-06-06")
    }
  ];

  // Use provided campaigns or fall back to Brooklyn campaigns
  const displayCampaigns = campaigns.length > 0 ? campaigns : brooklynCampaigns;

  const handlePinClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    if (onCampaignClick) {
      onCampaignClick(campaign);
    }
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
    <div className="relative h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden rounded-2xl border border-gray-700">
      {/* Map Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          {/* Street grid pattern */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: `repeating-linear-gradient(15deg, transparent, transparent 30px, rgba(168, 85, 247, 0.1) 30px, rgba(168, 85, 247, 0.1) 32px), repeating-linear-gradient(105deg, transparent, transparent 25px, rgba(236, 72, 153, 0.1) 25px, rgba(236, 72, 153, 0.1) 27px)`
            }}
          />

          {/* River representation */}
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-cyan-500/20 to-transparent"></div>

          {/* Street lines */}
          <div className="absolute left-1/3 top-0 w-1 h-full bg-purple-400/20"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-pink-400/20"></div>
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

      {/* Additional Location Pins */}
      {[
        { name: "Local Café", address: "123 Main St", distance: "0.2 mi", type: "coffee", position: { top: "25%", left: "30%" } },
        { name: "Food Market", address: "456 Broadway", distance: "0.4 mi", type: "food", position: { top: "40%", right: "25%" } },
        { name: "Fashion Store", address: "789 5th Ave", distance: "0.3 mi", type: "retail", position: { top: "60%", left: "40%" } }
      ].map((location, index) => (
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
function MapViewAlternative({ campaigns, userLocation, onCampaignClick }: {
  campaigns: Campaign[];
  userLocation: { lat: number; lng: number } | null;
  onCampaignClick: (campaign: Campaign) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // For now, we'll create a simple grid-based "map" view
  // In a real implementation, this would integrate with Google Maps or similar
  return (
    <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full relative bg-gradient-to-br from-gray-800 via-gray-900 to-black"
      >
        {/* User Location Indicator */}
        {userLocation && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping"></div>
            </div>
          </div>
        )}

        {/* Campaign Markers */}
        {campaigns.map((campaign, index) => {
          // Simulate random positions around the center for demo
          const angle = (index / campaigns.length) * 2 * Math.PI;
          const radius = 80 + Math.random() * 100;
          const x = 50 + (Math.cos(angle) * radius / 3);
          const y = 50 + (Math.sin(angle) * radius / 3);

          return (
            <div
              key={campaign.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedCampaign(campaign)}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {campaign.brandName.charAt(0)}
                  </span>
                </div>
                {campaign.perUserLimit && campaign.perUserLimit < 5 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0 h-4">
                    {campaign.perUserLimit}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}

        {/* Campaign Details Popup */}
        {selectedCampaign && (
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <div className="glass-morphism p-4 rounded-2xl border border-white/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {selectedCampaign.brandName}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {selectedCampaign.productName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCampaign(null)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  ×
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Partnership Value</p>
                  <p className="text-cyan-400 font-semibold">
                    {selectedCampaign.redeemableAmount}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Badge variant="outline" className="border-white/30">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedCampaign.radius ? `${selectedCampaign.radius} radius` : "Nearby"}
                  </Badge>

                  <Button
                    size="sm"
                    onClick={() => onCampaignClick?.(selectedCampaign)}
                    className="bg-gradient-to-r from-pink-500 to-cyan-500"
                  >
                    Claim
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-30 space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20"
            onClick={() => {
              // In a real implementation, this would recenter the map
              console.log('Recenter map to user location');
            }}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* No Location Fallback */}
        {!userLocation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-gray-400 text-sm">
                Location required to show map
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}