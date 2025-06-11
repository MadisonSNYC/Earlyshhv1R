import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { ArrowLeft, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodePage() {
  const [, params] = useRoute('/qr/:couponId');
  const [timeLeft, setTimeLeft] = useState('24 minutes');

  // Fetch coupon data
  const { data: coupon, isLoading } = useQuery({
    queryKey: ['/api/coupons', params?.couponId],
    enabled: !!params?.couponId,
  });

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
              <QRCode
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

        {/* Post to Instagram Button */}
        <div className="mt-6 px-2">
          <Button
            onClick={handlePostToInstagram}
            className="w-full bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-600 hover:to-cyan-500 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg"
          >
            Post to Instagram Story
          </Button>
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