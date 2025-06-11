import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Ticket, CheckCircle, Instagram, Eye } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";

export default function AnalyticsPage() {
  const { data: analyticsData = [], isLoading } = useQuery({
    queryKey: ['/api/analytics/campaigns'],
  });

  const totalStats = analyticsData.reduce(
    (acc: any, item: any) => ({
      claimsIssued: acc.claimsIssued + item.stats.claimsIssued,
      couponsRedeemed: acc.couponsRedeemed + item.stats.couponsRedeemed,
      storiesVerified: acc.storiesVerified + item.stats.storiesVerified,
      totalReach: acc.totalReach + item.stats.totalReach,
    }),
    { claimsIssued: 0, couponsRedeemed: 0, storiesVerified: 0, totalReach: 0 }
  );

  const handleDownloadCSV = () => {
    // Simulate CSV download
    alert('CSV download started...');
  };

  const handleSyncToMonday = () => {
    // Simulate Monday.com sync
    alert('Syncing to Monday.com...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4 pb-20 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className="w-4 h-4" />
            <span>Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Claims Issued</p>
                  <p className="text-2xl font-bold text-primary">{totalStats.claimsIssued}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">+12% from last week</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Redeemed</p>
                  <p className="text-2xl font-bold text-green-600">{totalStats.couponsRedeemed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                {totalStats.claimsIssued > 0 
                  ? `${((totalStats.couponsRedeemed / totalStats.claimsIssued) * 100).toFixed(1)}% redemption rate`
                  : '0% redemption rate'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stories Verified</p>
                  <p className="text-2xl font-bold text-pink-600">{totalStats.storiesVerified}</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-pink-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                {totalStats.couponsRedeemed > 0 
                  ? `${((totalStats.storiesVerified / totalStats.couponsRedeemed) * 100).toFixed(1)}% share rate`
                  : '0% share rate'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Reach</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {totalStats.totalReach > 1000 
                      ? `${(totalStats.totalReach / 1000).toFixed(1)}K`
                      : totalStats.totalReach
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                {totalStats.storiesVerified > 0 
                  ? `${Math.round(totalStats.totalReach / totalStats.storiesVerified)} avg per story`
                  : '0 avg per story'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <CardTitle>Campaign Performance</CardTitle>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button size="sm" onClick={handleSyncToMonday} className="w-full sm:w-auto">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync to Monday.com
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No campaign data available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyticsData.map((item: any) => (
                  <div key={item.campaign.id} className="p-4 border border-gray-200 rounded-xl bg-white">
                    {/* Mobile-first layout */}
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      {/* Campaign Info */}
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <img
                          src={item.campaign.brandLogoUrl}
                          alt={item.campaign.brandName}
                          className="w-12 h-12 rounded-xl flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 truncate">{item.campaign.brandName}</h4>
                          <p className="text-sm text-gray-500 truncate">{item.campaign.offerDescription}</p>
                        </div>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 sm:gap-6 sm:flex sm:space-x-6 text-center sm:text-right">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {item.stats.claimsIssued} / {item.campaign.maxCoupons}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">Claims</p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-green-600 text-sm sm:text-base">{item.stats.redemptionRate}%</p>
                          <p className="text-xs sm:text-sm text-gray-500">Redemption</p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-pink-600 text-sm sm:text-base">
                            {item.stats.totalReach > 1000 
                              ? `${(item.stats.totalReach / 1000).toFixed(1)}K`
                              : item.stats.totalReach
                            }
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">Story Reach</p>
                        </div>
                      </div>
                    </div>
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
