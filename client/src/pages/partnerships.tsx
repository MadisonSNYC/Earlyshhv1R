import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import BottomNavigation from "@/components/bottom-navigation";
import { Coupon, Campaign } from "@shared/schema";

// Enhanced coupon type with campaign data
type CouponWithCampaign = Coupon & {
  campaign?: Campaign;
};
import { QrCode, Share2, Calendar, MapPin, Trophy, Clock, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function PartnershipsPage() {
  const { user } = useAuth();

  const { data: coupons = [], isLoading } = useQuery<CouponWithCampaign[]>({
    queryKey: ['/api/users', user?.id, 'coupons'],
    queryFn: () => fetch(`/api/users/${user?.id}/coupons`).then(res => res.json()),
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/users', user?.id, 'stats'],
    queryFn: () => fetch(`/api/users/${user?.id}/stats`).then(res => res.json()),
  });

  // Categorize partnerships
  const activeCoupons = coupons.filter(coupon => coupon.status === 'active');
  const redeemedCoupons = coupons.filter(coupon => coupon.status === 'redeemed');
  const expiredCoupons = coupons.filter(coupon => coupon.status === 'expired');

  if (isLoading) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const PartnershipCard = ({ coupon, showActions = true }: { coupon: CouponWithCampaign; showActions?: boolean }) => (
    <Card key={coupon.id} className="glass-morphism border-white/20 bg-black/20 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={coupon.campaign?.brandLogoUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40&h=40&fit=crop"}
              alt="Brand"
              className="w-12 h-12 rounded-xl border border-white/20"
            />
            <div>
              <h4 className="font-rubik font-bold text-white text-lg">{coupon.campaign?.brandName || "Brand"}</h4>
              <p className="text-gray-300 text-sm font-space">{coupon.productName}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-green-400 font-bold text-lg font-rubik">
              ${coupon.redeemableAmount}
            </div>
            <Badge 
              variant={coupon.status === 'active' ? 'default' : coupon.status === 'redeemed' ? 'secondary' : 'destructive'}
              className={`${
                coupon.status === 'active' 
                  ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                  : coupon.status === 'redeemed'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                  : 'bg-red-500/20 text-red-300 border-red-400/30'
              }`}
            >
              {coupon.status === 'active' && <Clock className="w-3 h-3 mr-1" />}
              {coupon.status === 'redeemed' && <CheckCircle className="w-3 h-3 mr-1" />}
              {coupon.status === 'expired' && <Calendar className="w-3 h-3 mr-1" />}
              {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-400 text-sm font-space">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {coupon.status === 'redeemed' 
                ? `Redeemed ${coupon.redeemedAt ? new Date(coupon.redeemedAt).toLocaleDateString() : 'recently'}`
                : `Expires ${coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'soon'}`
              }
            </span>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm font-space">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Available at participating locations</span>
          </div>
        </div>

        {showActions && coupon.status === 'active' && (
          <div className="flex space-x-2">
            <Button 
              asChild
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-rubik font-semibold"
            >
              <Link href={`/qr/${coupon.id}`}>
                <QrCode className="w-4 h-4 mr-2" />
                Show QR Code
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen earlyshh-bg flex flex-col">
      <div className="flex-1 p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-rubik font-bold text-white mb-2">
            My Partnerships
          </h1>
          <p className="text-gray-400 font-space">
            Track your brand collaborations and rewards
          </p>
        </div>

        {/* Stats Overview */}
        <Card className="glass-morphism border-white/20 bg-black/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-400 font-rubik">
                  {userStats?.claimed || coupons.length}
                </div>
                <div className="text-xs text-gray-400 font-space">Total</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-400 font-rubik">
                  {activeCoupons.length}
                </div>
                <div className="text-xs text-gray-400 font-space">Active</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-400 font-rubik">
                  {redeemedCoupons.length}
                </div>
                <div className="text-xs text-gray-400 font-space">Redeemed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnerships Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-white/20">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 font-rubik"
            >
              Active ({activeCoupons.length})
            </TabsTrigger>
            <TabsTrigger 
              value="redeemed"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 font-rubik"
            >
              Past ({redeemedCoupons.length})
            </TabsTrigger>
            <TabsTrigger 
              value="expired"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 font-rubik"
            >
              Expired ({expiredCoupons.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {activeCoupons.length === 0 ? (
              <Card className="glass-morphism border-white/20 bg-black/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-rubik font-bold text-white mb-2">
                    No Active Partnerships
                  </h3>
                  <p className="text-gray-400 font-space mb-4">
                    Discover new brand partnerships on the home page
                  </p>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-rubik">
                    <Link href="/home">Explore Partnerships</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeCoupons.map((coupon) => (
                  <PartnershipCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="redeemed" className="space-y-4 mt-6">
            {redeemedCoupons.length === 0 ? (
              <Card className="glass-morphism border-white/20 bg-black/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-rubik font-bold text-white mb-2">
                    No Redeemed Partnerships
                  </h3>
                  <p className="text-gray-400 font-space">
                    Your successfully redeemed partnerships will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {redeemedCoupons.map((coupon) => (
                  <PartnershipCard key={coupon.id} coupon={coupon} showActions={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4 mt-6">
            {expiredCoupons.length === 0 ? (
              <Card className="glass-morphism border-white/20 bg-black/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-rubik font-bold text-white mb-2">
                    No Expired Partnerships
                  </h3>
                  <p className="text-gray-400 font-space">
                    Expired partnerships will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {expiredCoupons.map((coupon) => (
                  <PartnershipCard key={coupon.id} coupon={coupon} showActions={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
}