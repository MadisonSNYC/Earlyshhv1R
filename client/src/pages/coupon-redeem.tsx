import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Clock, Instagram, Copy, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CouponRedeemPage() {
  const [match, params] = useRoute("/redeem/:couponId");
  const [timeLeft, setTimeLeft] = useState(24 * 60); // 24 hours in minutes
  const [copied, setCopied] = useState(false);

  const couponId = params?.couponId;

  const { data: coupon, isLoading } = useQuery({
    queryKey: [`/api/coupons/${couponId}`],
    enabled: !!couponId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen electric-bg flex items-center justify-center">
        <div className="text-white font-rubik text-xl">Loading early access...</div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="min-h-screen electric-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-rubik font-bold text-white mb-2">Access Not Found</h2>
          <p className="text-gray-300">This early access coupon could not be found.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  const handleCopyCode = () => {
    if (coupon?.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share && coupon) {
      navigator.share({
        title: `${coupon.brandName} Early Access`,
        text: `I got early access to ${coupon.offerDescription} at ${coupon.brandName}!`,
        url: window.location.href,
      });
    }
  };

  if (!match) return null;

  return (
    <div className="min-h-screen electric-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => window.history.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-rubik font-black earlyshh-text-gradient">EARLYSHH</h1>
        <Button variant="ghost" size="icon" className="text-white" onClick={handleShare}>
          <Share2 className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col">
        <Card className="glass-morphism border-white/20 mb-6">
          <CardContent className="p-6 text-center">
            {/* Brand Name & Offer */}
            <div className="mb-6">
              <h2 className="text-4xl font-rubik font-black text-pink-400 mb-2">
                {coupon.brandName}
              </h2>
              <div className="text-5xl font-rubik font-black earlyshh-text-gradient">
                {coupon.offerDescription}
              </div>
            </div>

            <p className="text-gray-300 font-space text-lg mb-6">
              Show this QR code at checkout to redeem your early access deal.
            </p>

            {/* QR Code */}
            <div className="mb-6">
              <div className="w-64 h-64 mx-auto bg-white rounded-3xl p-4 border-4 border-pink-500">
                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-6xl">📱</div>
                </div>
              </div>
            </div>

            {/* Expiry Timer */}
            <div className="mb-6">
              <Badge className="bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-rubik font-bold text-lg px-6 py-2">
                <Clock className="w-5 h-5 mr-2" />
                Expires in {formatTimeLeft(timeLeft)}
              </Badge>
            </div>

            {/* Fetch Code */}
            <div className="mb-6">
              <p className="text-gray-300 font-space text-sm mb-2">Or use Fetch Code:</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="text-2xl font-mono font-bold text-white bg-black/50 px-4 py-2 rounded-lg">
                  {coupon.code}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCopyCode}
                  className="text-white"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Card */}
        <Card className="glass-morphism border-white/20 mb-6">
          <CardContent className="p-5">
            <h3 className="text-white font-rubik font-bold text-lg mb-4">The place invites you! 😊</h3>
            
            <div className="space-y-4 text-white font-space">
              <div>
                <p className="font-semibold mb-2">You'll get:</p>
                <p className="text-gray-300">• {coupon.offerDescription} on {coupon.productName}</p>
              </div>

              <div>
                <p className="text-yellow-400 font-semibold mb-2">💰 Mandatory 20% tip of total value of collab will be paid at the expense of the influencer</p>
              </div>

              <div>
                <p className="text-gray-300 mb-2">In house dining only 😊</p>
              </div>

              <div>
                <p className="font-semibold mb-2">For at least one video Instagram story:</p>
                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <p className="text-red-400 font-bold mb-2">! Must Haves:</p>
                  <p className="text-gray-300 text-sm">• Video story 📱 (10+ sec)</p>
                  <p className="text-gray-300 text-sm">• Talk 🎤 or add music 🎵</p>
                  <p className="text-gray-300 text-sm">• Show the product</p>
                </div>

                <div className="bg-black/30 rounded-lg p-3">
                  <p className="font-bold mb-2">📱 Required Tags:</p>
                  <p className="text-gray-300 text-sm">• @{coupon.brandName?.toLowerCase()}</p>
                  <p className="text-gray-300 text-sm">• @inplace.usa (🔗 hidden)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto pb-6">
          <Button className="w-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-rubik font-bold py-4 text-lg">
            <Instagram className="w-5 h-5 mr-2" />
            Post to Instagram Story
          </Button>
          
          <div className="text-center">
            <p className="text-gray-400 font-space text-sm">
              🏷️ Product: {coupon.productName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}