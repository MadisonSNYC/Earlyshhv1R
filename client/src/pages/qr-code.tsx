import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, Share2, Clock, CheckCircle, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import type { Coupon } from '@shared/schema';

export default function QRCodePage() {
  const [, params] = useRoute('/qr-code/:couponId');
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState('24 minutes');
  const [isRedeemed, setIsRedeemed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch coupon data
  const { data: coupon, isLoading } = useQuery<Coupon>({
    queryKey: ['/api/coupons', params?.couponId],
    enabled: !!params?.couponId,
  });

  // Show demo QR code if no coupon data
  if (!coupon && !isLoading) {
    const demoCoupon = {
      brandName: 'SuperRoot Energy',
      redeemableAmount: '30% OFF',
      fetchCode: 'DEMO-1234',
      id: '1',
      qrData: 'DEMO-QR-CODE-DATA',
      expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    return (
      <div className="min-h-screen earlyshh-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
        
        <div className="relative z-10 flex items-center justify-between p-4 pt-8">
          <Button
            onClick={() => setLocation('/home')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-white font-bold text-lg">QR Code</h1>
          <div className="w-10" />
        </div>

        <div className="relative z-10 flex-1 px-4 pb-6 space-y-6">
          <div className="bg-gradient-to-br from-gray-900/90 via-purple-900/60 to-gray-900/80 backdrop-blur-md border border-purple-300/30 rounded-2xl p-6 shadow-xl text-center">
            <h2 className="text-white font-black text-2xl mb-2 drop-shadow-lg">
              {demoCoupon.brandName}
            </h2>
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-black text-3xl mb-3">
              {demoCoupon.redeemableAmount}
            </h3>
            <p className="text-pink-200 text-sm font-medium drop-shadow-sm">
              Show this QR code at checkout to redeem
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-400">
                <QRCodeSVG
                  value={demoCoupon.qrData}
                  size={180}
                  level="M"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-2">
                <div className="flex items-center text-orange-200">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">Expires in 24 minutes</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-300 text-sm mb-2">Backup Code:</p>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/50">
                <p className="text-white font-mono text-lg tracking-wider">
                  {demoCoupon.fetchCode}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setLocation(`/instagram-story/${demoCoupon.id}`)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 rounded-2xl text-lg shadow-2xl shadow-pink-500/30 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] border border-white/10"
            >
              <div className="flex items-center space-x-2">
                <Instagram className="w-5 h-5" />
                <span>Share on Instagram</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mark coupon as redeemed mutation
  const markRedeemedMutation = useMutation({
    mutationFn: async (couponId: string) => {
      const response = await fetch(`/api/coupons/${couponId}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 }), // Using hardcoded userId for MVP
      });
      if (!response.ok) throw new Error('Failed to mark as redeemed');
      return response.json();
    },
    onSuccess: () => {
      setIsRedeemed(true);
      toast({
        title: "Coupon Redeemed!",
        description: "Now share your experience on Instagram and complete the survey.",
      });
      // Navigate to Instagram story posting flow
      setTimeout(() => {
        setLocation(`/instagram-story/${params?.couponId}`);
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark coupon as redeemed",
        variant: "destructive",
      });
    },
  });

  const handleMarkRedeemed = () => {
    if (params?.couponId) {
      markRedeemedMutation.mutate(params.couponId);
    }
  };

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (coupon?.expirationDate) {
        const now = new Date();
        const expiry = new Date(coupon.expirationDate);
        const diff = expiry.getTime() - now.getTime();
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          if (hours > 0) {
            setTimeLeft(`${hours}h ${minutes}m`);
          } else {
            setTimeLeft(`${minutes} minutes`);
          }
        } else {
          setTimeLeft('Expired');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [coupon?.expirationDate]);

  const handleBack = () => {
    history.back();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${coupon?.brandName} Deal`,
          text: `Check out this ${coupon?.redeemableAmount} deal from ${coupon?.brandName}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePostToInstagram = () => {
    // Open Instagram with pre-filled story
    const instagramUrl = `instagram://story-camera`;
    window.open(instagramUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Coupon not found</h2>
          <Button onClick={handleBack} variant="outline" className="border-white text-white hover:bg-white hover:text-purple-900">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen earlyshh-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-8">
        <Button
          onClick={() => setLocation('/home')}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-white font-bold text-lg">QR Code</h1>

        <Button
          onClick={handleShare}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-4 pb-6 space-y-6">
        {/* Brand Header */}
        <div className="bg-gradient-to-br from-gray-900/90 via-purple-900/60 to-gray-900/80 backdrop-blur-md border border-purple-300/30 rounded-2xl p-6 shadow-xl text-center">
          <h2 className="text-white font-black text-2xl mb-2 drop-shadow-lg">
            {coupon?.brandName || 'SuperRoot Energy'}
          </h2>
          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-black text-3xl mb-3">
            {coupon?.redeemableAmount || '30% OFF'}
          </h3>
          <p className="text-pink-200 text-sm font-medium drop-shadow-sm">
            Show this QR code at checkout to redeem
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-gradient-to-r from-pink-400 to-cyan-400">
              <QRCodeSVG
                value={coupon?.qrData || `${coupon?.fetchCode || 'DEMO123'}-${coupon?.id || '1'}`}
                size={180}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Expiration Timer */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-2">
              <div className="flex items-center text-orange-200">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">Expires in {timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Fetch Code */}
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-2">Backup Code:</p>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/50">
              <p className="text-white font-mono text-lg tracking-wider">
                {coupon?.fetchCode || 'DEMO-1234-5678'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!isRedeemed ? (
            <Button
              onClick={handleMarkRedeemed}
              disabled={markRedeemedMutation.isPending}
              className="w-full bg-gradient-to-r from-green-500 to-cyan-400 hover:from-green-600 hover:to-cyan-500 text-white font-bold py-4 rounded-2xl text-lg shadow-2xl shadow-green-500/30 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] border border-white/10 disabled:opacity-50"
            >
              {markRedeemedMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark as Redeemed</span>
                </div>
              )}
            </Button>
          ) : (
            <div className="bg-gradient-to-br from-green-900/60 via-gray-900/80 to-green-900/60 backdrop-blur-md border border-green-300/30 rounded-2xl p-6 shadow-xl text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-white font-bold text-lg mb-1">Partnership Completed!</p>
              <p className="text-green-300 text-sm">Redirecting to share your experience...</p>
            </div>
          )}

          {/* Instagram Share Button */}
          <Button
            onClick={() => setLocation(`/instagram-story/${params?.couponId || '1'}`)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 rounded-2xl text-lg shadow-2xl shadow-pink-500/30 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] border border-white/10"
          >
            <div className="flex items-center space-x-2">
              <Instagram className="w-5 h-5" />
              <span>Share on Instagram</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}