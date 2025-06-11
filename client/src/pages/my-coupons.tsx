import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import BottomNavigation from "@/components/bottom-navigation";
import { Coupon } from "@shared/schema";

export default function MyCouponsPage() {
  const { user } = useAuth();

  const { data: coupons = [], isLoading } = useQuery<Coupon[]>({
    queryKey: ['/api/users', user?.id, 'coupons'],
    queryFn: () => fetch(`/api/users/${user?.id}/coupons`).then(res => res.json()),
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/users', user?.id, 'stats'],
    queryFn: () => fetch(`/api/users/${user?.id}/stats`).then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={user?.profilePicUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                <p className="text-gray-500">@{user?.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{userStats?.claimed || 0}</p>
                <p className="text-sm text-gray-500">Partnerships</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{userStats?.redeemed || 0}</p>
                <p className="text-sm text-gray-500">Redeemed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">{userStats?.shared || 0}</p>
                <p className="text-sm text-gray-500">Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Coupons */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Coupons</h3>

            {coupons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No coupons claimed yet.</p>
                <p className="text-sm text-gray-400 mt-1">Visit the home page to claim your first coupon!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <img
                        src={coupon.campaign?.brandLogoUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40&h=40&fit=crop"}
                        alt="Brand"
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{coupon.campaign?.brandName}</p>
                        <p className="text-sm text-gray-500">
                          Expires {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Soon'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={coupon.status === 'redeemed' ? 'default' : 'secondary'}>
                      {coupon.status === 'redeemed' ? 'Redeemed' : 'Active'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
