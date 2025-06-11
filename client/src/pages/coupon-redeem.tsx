import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { ArrowLeft, CheckCircle2, Instagram } from 'lucide-react';
import { Button } from '../components/ui/button';
import CouponDisplay from '../components/coupon-display';
import { couponService } from '../services/coupon-service';
import { useAuth } from '../lib/auth';

export default function CouponRedeemPage() {
  const [, params] = useRoute('/coupon/:id');
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [storyShared, setStoryShared] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (params?.id) {
      loadCoupon(params.id);
    }
  }, [params?.id]);

  const loadCoupon = async (couponId: string) => {
    try {
      const couponData = await couponService.getCoupon(couponId);
      setCoupon(couponData);
    } catch (error) {
      console.error('Failed to load coupon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && coupon) {
      navigator.share({
        title: `${coupon.brandName || 'Brand'} Early Access`,
        text: `I got early access to ${coupon.offerDescription || 'special offer'} at ${coupon.brandName || 'this brand'}!`,
        url: window.location.href,
      });
    }
  };

  const handleOpenInstagram = () => {
    // Open Instagram app or web version
    const instagramUrl = `instagram://camera`;
    const webUrl = `https://www.instagram.com/`;

    // Try to open Instagram app, fallback to web
    window.location.href = instagramUrl;
    setTimeout(() => {
      window.open(webUrl, '_blank');
    }, 1000);
  };

  if (!params?.id) return null;

  return (
    <div className="min-h-screen electric-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => window.history.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-rubik font-black earlyshh-text-gradient">EARLYSHH</h1>
        <Button variant="ghost" size="icon" className="text-white" onClick={handleShare}>
          {/* Replaced Share2 with handleShare, but keeping Share2 icon would require more context */}
          {/* <Share2 className="h-6 w-6" /> */}
          Share
        </Button>
      </div>

      {/* Coupon Display */}
      <div className="flex-1 px-4 pb-20">
        <CouponDisplay
          coupon={{
            id: coupon.id,
            code: coupon.code,
            qrData: coupon.qrData || `EARLYSHH-${coupon.code}`,
            fetchCode: coupon.fetchCode || coupon.code || '1234-5678-9012',
            productName: coupon.productName || coupon.offerDescription,
            brandName: coupon.brandName,
            brandLogo: coupon.brandLogo,
            redeemableAmount: coupon.redeemableAmount || '$5.00',
            expirationDate: coupon.expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            legalDisclaimer: coupon.legalDisclaimer || 'Terms apply. See details.',
            dateFetched: coupon.dateFetched || new Date().toISOString(),
            offerDescription: coupon.offerDescription
          }}
          onShare={handleShare}
          onShowTerms={() => setShowTerms(true)}
        />

        {/* Story Sharing Instructions */}
        <div className="glass-morphism p-6 border-0 rounded-2xl border border-white/10">
            <div className="text-center space-y-4">
              {!storyShared ? (
                <>
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Complete Your Partnership</h3>
                    <p className="text-gray-300 text-sm">
                      Share an Instagram Story tagging <span className="text-cyan-400">@earlyshh</span> and{' '}
                      <span className="text-pink-400">@{coupon.brandName?.toLowerCase().replace(/\s+/g, '') || 'brand'}</span> to complete your partnership experience.
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600"
                    onClick={() => {
                      handleOpenInstagram();
                      // Simulate story shared (in real app, this would be detected via webhook)
                      setTimeout(() => setStoryShared(true), 3000);
                    }}
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Open Instagram
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Partnership Complete! 🎉</h3>
                    <p className="text-gray-300 text-sm">
                      Thanks for sharing your experience. Your story helps other community members discover great partnerships.
                    </p>
                  </div>
                </>
              )}
            </div>
        </div>
</div>
    </div>
  );
}