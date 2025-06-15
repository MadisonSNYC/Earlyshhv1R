import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CheckCircle, Instagram, Camera, Star, Sparkles, Gift } from 'lucide-react';
import { Campaign } from '@shared/schema';

export default function PartnershipLoadingPage() {
  const [location, navigate] = useLocation();
  const [loadingStage, setLoadingStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Extract campaign ID from URL path
  const pathParts = location.split('/');
  const campaignId = pathParts[pathParts.length - 1];

  // Fetch campaign data based on ID
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const campaign = campaigns.find(c => c.id.toString() === campaignId);

  const loadingStages = [
    { icon: Gift, text: "Processing your partnership...", color: "from-purple-500 to-blue-500" },
    { icon: CheckCircle, text: "Confirming product availability...", color: "from-blue-500 to-cyan-500" },
    { icon: Sparkles, text: "Setting up your redemption...", color: "from-cyan-500 to-green-500" },
    { icon: CheckCircle, text: "Partnership confirmed!", color: "from-green-500 to-emerald-500" }
  ];

  useEffect(() => {
    if (campaign) {
      const interval = setInterval(() => {
        setLoadingStage(prev => {
          if (prev < loadingStages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => setIsComplete(true), 1000);
            return prev;
          }
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [campaign]);

  const handleContinue = () => {
    navigate(`/instagram-story/${campaignId}`);
  };

  const handleReturnHome = () => {
    navigate('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Partnership not found</h2>
          <Button onClick={() => navigate('/home')} variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen earlyshh-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        
        {!isComplete ? (
          // Loading State
          <div className="text-center max-w-sm mx-auto">
            <div className="mb-8">
              {loadingStages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index === loadingStage;
                const isCompleted = index < loadingStage;
                
                return (
                  <div key={index} className={`transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'} ${isCompleted ? 'opacity-60' : isActive ? 'opacity-100' : 'opacity-30'}`}>
                    {isActive && (
                      <div className="mb-6">
                        <div className={`w-20 h-20 bg-gradient-to-r ${stage.color} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}>
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-white text-xl font-bold mb-2">
                          {stage.text}
                        </h2>
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Success State
          <div className="text-center max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-gray-900/95 via-green-900/80 to-gray-900/95 backdrop-blur-xl border border-green-300/40 rounded-3xl p-8 shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Partnership Confirmed!
              </h1>
              
              <p className="text-gray-300 text-lg mb-6">
                Your {campaign.productName} is ready for pickup
              </p>

              {/* Brand Info */}
              <div className="bg-gradient-to-br from-gray-800/60 via-blue-900/40 to-gray-800/60 backdrop-blur-md border border-blue-300/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">SO</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold">{campaign.brandName}</h3>
                    <p className="text-gray-300 text-sm">{campaign.brandIgHandle}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-purple-900/40 via-gray-900/60 to-purple-900/40 backdrop-blur-md border border-purple-300/20 rounded-2xl p-4 mb-6">
                <h3 className="text-white font-semibold text-lg mb-3">Next Steps:</h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-3">
                    <Camera className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">Create your Instagram story</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">Tag @drinksuperoot and @earlyshh</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">Complete feedback survey</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-2xl text-lg shadow-2xl shadow-purple-500/30 hover:shadow-pink-500/40 transition-all duration-300 hover:scale-[1.02] border border-white/10"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  Create Instagram Story
                </Button>
                
                <Button
                  onClick={handleReturnHome}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 py-3 rounded-2xl"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}