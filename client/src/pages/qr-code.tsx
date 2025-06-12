import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, Share2, Clock, CheckCircle, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

export default function QRCodePage() {
  const [, params] = useRoute('/qr/:couponId');
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState('24 minutes');
  const [isRedeemed, setIsRedeemed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create mock coupon for demo purposes
  const mockCoupon = {
    id: params?.couponId || '1',
    code: 'DEMO-EARLY-2024',
    qrData: `https://earlyshh.com/redeem/${params?.couponId || '1'}`,
    fetchCode: '1234-5678-9012-3456',
    productName: 'SuperRoot Premium Energy Formula',
    brandName: 'SuperRoot Energy',
    brandLogo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
    redeemableAmount: '3.99',
    expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    legalDisclaimer: 'Valid at participating locations. One per customer. Terms apply.',
    dateFetched: new Date().toISOString(),
    offerDescription: 'Free Sample Energy Drink',
    campaign: {
      brandName: 'SuperRoot Energy',
      brandIgHandle: '@superrootenergy'
    }
  };

  // Fetch coupon data, fallback to mock for demo
  const { data: fetchedCoupon, isLoading } = useQuery({
    queryKey: ['/api/coupons', params?.couponId],
    enabled: !!params?.couponId,
  });

  const coupon = fetchedCoupon || mockCoupon;

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-pink-400">EARLY</span>
            <span className="text-cyan-400">SHH</span>
          </h1>
        </div>

        <Button
          onClick={handleShare}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Share2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8">
        {/* Coupon Card */}
        <div className="bg-white rounded-3xl p-8 mx-2 shadow-2xl">
          {/* Brand Name and Discount */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-pink-500 mb-2">
              {coupon.brandName}
            </h2>
            <h3 className="text-4xl font-bold text-green-500">
              {coupon.redeemableAmount}
            </h3>
          </div>

          {/* Instructions */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg">
              Show this QR code at checkout<br />
              to redeem your deal.
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-2xl border-4 border-pink-400 shadow-lg">
              <QRCodeSVG
                value={coupon.qrData || `${coupon.fetchCode}-${coupon.id}`}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Expiration */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-6 py-3 rounded-full flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Expires in {timeLeft}</span>
            </div>
          </div>

          {/* Fetch Code */}
          <div className="text-center mb-8">
            <p className="text-gray-500 mb-2">Or use Fetch Code:</p>
            <p className="text-2xl font-bold text-gray-800 tracking-wider">
              {coupon.fetchCode || '1234-5678-9012'}
            </p>
          </div>
        </div>

        {/* Mark as Redeemed Button */}
        <div className="mt-6 px-2 space-y-3">
          {!isRedeemed ? (
            <Button
              onClick={handleMarkRedeemed}
              disabled={markRedeemedMutation.isPending}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:opacity-50"
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
            <div className="bg-green-100 border border-green-400 rounded-2xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-semibold">Coupon Redeemed Successfully!</p>
              <p className="text-green-600 text-sm mt-1">Redirecting to share your experience...</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-6 text-center">
          <p className="text-white/60 flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Product: {coupon.productName}</span>
          </p>
        </div>
      </div>
    </div>
  );
}