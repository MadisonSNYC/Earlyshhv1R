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
    <Card key={coupon.id} className="glass-morphism border-white/20 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] rounded-3xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={coupon.campaign?.brandLogoUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40&h=40&fit=crop"}
              alt="Brand"
              className="w-16 h-16 rounded-2xl border-2 border-white/30 shadow-lg"
            />
            <div>
              <h4 className="font-black text-white text-xl tracking-tight">{coupon.campaign?.brandName || "Brand"}</h4>
              <p className="text-gray-300 text-base font-medium">{coupon.productName}</p>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="text-2xl font-black gradient-text">
              ${coupon.redeemableAmount}
            </div>
            <Badge 
              className={`${
                coupon.status === 'active' 
                  ? 'bg-gradient-to-r from-green-400/20 to-cyan-400/20 text-cyan-300 border-cyan-400/40 shadow-lg shadow-cyan-400/20' 
                  : coupon.status === 'redeemed'
                  ? 'bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-pink-300 border-pink-400/40 shadow-lg shadow-pink-400/20'
                  : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-400/40'
              } px-3 py-1 rounded-2xl font-semibold`}
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
          <div className="flex space-x-3">
            <Button 
              asChild
              className="flex-1 h-12 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 hover:from-pink-500 hover:via-purple-600 hover:to-cyan-500 text-white font-semibold rounded-2xl border-0 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              <Link href={`/qr/${coupon.id}`}>
                <QrCode className="w-5 h-5 mr-2" />
                Show QR Code
              </Link>
            </Button>
            
            <Button 
              size="sm"
              className="h-12 w-12 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/30"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      
      <div className="relative z-10 flex-1 p-6 space-y-8 pb-24">
        {/* Header */}
        <div className="text-center pt-8 pb-6">
          <h1 className="text-5xl font-black tracking-tight text-white mb-4">
            <span className="gradient-text">My Partnerships</span>
          </h1>
          <p className="text-gray-300 text-xl font-medium tracking-wide">
            Track your exclusive brand collaborations
          </p>
        </div>

        {/* Stats Overview */}
        <Card className="glass-morphism border-white/20 shadow-xl shadow-purple-500/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="text-4xl font-black text-white tracking-tight">
                  {userStats?.claimed || coupons.length}
                </div>
                <div className="text-sm text-gray-300 font-medium">Total Partnerships</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-black gradient-text">
                  {activeCoupons.length}
                </div>
                <div className="text-sm text-gray-300 font-medium">Active</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-black text-cyan-400">
                  {redeemedCoupons.length}
                </div>
                <div className="text-sm text-gray-300 font-medium">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnerships Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-morphism border-white/20 p-2 rounded-3xl">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:via-purple-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 text-gray-300 font-semibold transition-all duration-300 rounded-2xl hover:scale-105"
            >
              Active ({activeCoupons.length})
            </TabsTrigger>
            <TabsTrigger 
              value="redeemed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:via-purple-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 text-gray-300 font-semibold transition-all duration-300 rounded-2xl hover:scale-105"
            >
              Completed ({redeemedCoupons.length})
            </TabsTrigger>
            <TabsTrigger 
              value="expired"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:via-purple-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 text-gray-300 font-semibold transition-all duration-300 rounded-2xl hover:scale-105"
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