import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ChevronLeft, 
  User, 
  Bell, 
  MapPin, 
  Camera, 
  Shield, 
  LogOut, 
  Download,
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  Users,
  Zap,
  Heart,
  School
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import BottomNavigation from '@/components/bottom-navigation';

export default function SettingsPage() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  
  // User Profile Data
  const [profileData, setProfileData] = useState({
    fullName: 'Alex Chen',
    bio: 'Coffee enthusiast & wellness advocate. Always trying new products!',
    instagramHandle: '@alexchen_nyc',
    school: 'NYU Stern School of Business',
    graduationYear: '2025',
    accountType: 'personal' as 'personal' | 'creator' | 'business',
    email: 'alex.chen@nyu.edu',
    phone: '+1 (555) 123-4567',
    gender: user?.gender || 'prefer-not-to-say'
  });

  // Social Influence Metrics (user can see their own data)
  const [socialMetrics] = useState({
    avgStoryViews: 247,
    avgStoryReplies: 12,
    avgStoryShares: 8,
    storyEngagementRate: 4.8,
    followerCount: 1247,
    followingRatio: 0.72,
    completionRate: 94,
    brandLoyalty: ['wellness', 'coffee', 'beauty']
  });

  // Privacy & Data Sharing Controls
  const [dataSharing, setDataSharing] = useState({
    socialInfluenceMetrics: true,
    locationData: true,
    storyPerformanceTracking: true,
    brandAffinityAnalysis: true,
    campusInfluenceData: true,
    behavioralTiming: true,
    networkEffectData: false,
    contentQualityAnalysis: true
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    partnerships: true,
    nearbyDeals: true,
    rewards: false,
    marketing: false,
    personalInsights: true,
    trendingProducts: true
  });

  // Preference Settings
  const [preferences, setPreferences] = useState({
    brandDiscoveryStyle: 'early_adopter' as 'early_adopter' | 'trending_follower' | 'deal_hunter',
    pricePointComfort: '$15-45',
    sustainabilityInterest: 'medium' as 'low' | 'medium' | 'high',
    categoryPreferences: {
      wellness: 40,
      beauty: 30,
      food: 20,
      lifestyle: 10
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const updateProfileData = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateDataSharing = (field: string, value: boolean) => {
    setDataSharing(prev => ({ ...prev, [field]: value }));
  };

  const updateNotifications = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const updatePreferences = (field: string, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { gender?: string; fullName?: string }) => {
      const response = await fetch(`/api/users/1`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      gender: profileData.gender,
      fullName: profileData.fullName,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-gray-300 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-white">Settings</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24 space-y-6">

        {/* Profile Information */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => updateProfileData('fullName', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="bio" className="text-gray-300">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => updateProfileData('bio', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="instagram" className="text-gray-300">Instagram Handle</Label>
              <Input
                id="instagram"
                value={profileData.instagramHandle}
                onChange={(e) => updateProfileData('instagramHandle', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="@username"
              />
            </div>

            <div>
              <Label htmlFor="school" className="text-gray-300">School/University</Label>
              <Input
                id="school"
                value={profileData.school}
                onChange={(e) => updateProfileData('school', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gradYear" className="text-gray-300">Graduation Year</Label>
                <Input
                  id="gradYear"
                  value={profileData.graduationYear}
                  onChange={(e) => updateProfileData('graduationYear', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-gray-300">Gender</Label>
                <Select value={profileData.gender} onValueChange={(value) => updateProfileData('gender', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="accountType" className="text-gray-300">Account Type</Label>
                <Select value={profileData.accountType} onValueChange={(value) => updateProfileData('accountType', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="creator">Creator</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Insights Dashboard */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Influence Metrics
            </CardTitle>
            <p className="text-gray-400 text-sm">See how your content performs</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{socialMetrics.avgStoryViews}</div>
                <div className="text-xs text-gray-400">Avg Story Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{socialMetrics.storyEngagementRate}%</div>
                <div className="text-xs text-gray-400">Engagement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{socialMetrics.followerCount}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{socialMetrics.completionRate}%</div>
                <div className="text-xs text-gray-400">Partnership Completion</div>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Your Top Categories</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {socialMetrics.brandLoyalty.map((category) => (
                  <Badge key={category} className="bg-cyan-400/20 text-cyan-300">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Discovery Preferences */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Discovery Preferences
            </CardTitle>
            <p className="text-gray-400 text-sm">Help us show you better matches</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Discovery Style</Label>
              <Select value={preferences.brandDiscoveryStyle} onValueChange={(value) => updatePreferences('brandDiscoveryStyle', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early_adopter">Early Adopter - Try new brands first</SelectItem>
                  <SelectItem value="trending_follower">Trending Follower - Popular products</SelectItem>
                  <SelectItem value="deal_hunter">Deal Hunter - Best value offers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Price Point Comfort</Label>
              <Select value={preferences.pricePointComfort} onValueChange={(value) => updatePreferences('pricePointComfort', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$5-15">Budget Friendly ($5-15)</SelectItem>
                  <SelectItem value="$15-45">Mid-Range ($15-45)</SelectItem>
                  <SelectItem value="$45-100">Premium ($45-100)</SelectItem>
                  <SelectItem value="$100+">Luxury ($100+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Sustainability Interest</Label>
              <Select value={preferences.sustainabilityInterest} onValueChange={(value) => updatePreferences('sustainabilityInterest', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Not a priority</SelectItem>
                  <SelectItem value="medium">Somewhat important</SelectItem>
                  <SelectItem value="high">Very important</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Category Preferences</Label>
              <div className="space-y-3 mt-2">
                {Object.entries(preferences.categoryPreferences).map(([category, percentage]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-400 text-sm w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing & Privacy */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data Sharing & Privacy
            </CardTitle>
            <p className="text-gray-400 text-sm">Control what data helps improve your experience</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: 'socialInfluenceMetrics',
                title: 'Social Influence Metrics',
                description: 'Story views, engagement rate, follower insights',
                icon: TrendingUp,
                benefit: 'Get personalized creator tips'
              },
              {
                key: 'locationData',
                title: 'Location & Timing Data',
                description: 'Redemption patterns, peak activity times',
                icon: MapPin,
                benefit: 'Find nearby deals at optimal times'
              },
              {
                key: 'storyPerformanceTracking',
                title: 'Story Performance Analysis',
                description: 'Content quality, posting consistency',
                icon: Camera,
                benefit: 'Improve your content strategy'
              },
              {
                key: 'brandAffinityAnalysis',
                title: 'Brand Affinity Analysis',
                description: 'Category preferences, discovery patterns',
                icon: Heart,
                benefit: 'Better brand recommendations'
              },
              {
                key: 'campusInfluenceData',
                title: 'Campus Influence Data',
                description: 'Dorm influence, peer network analysis',
                icon: School,
                benefit: 'Campus-specific opportunities'
              },
              {
                key: 'behavioralTiming',
                title: 'Behavioral Timing Patterns',
                description: 'App usage, decision speed, planning style',
                icon: Clock,
                benefit: 'Optimized notification timing'
              },
              {
                key: 'networkEffectData',
                title: 'Network Effect Analysis',
                description: 'Referral success, viral coefficient',
                icon: Users,
                benefit: 'Exclusive referral rewards'
              },
              {
                key: 'contentQualityAnalysis',
                title: 'Content Quality Metrics',
                description: 'Visual quality, hashtag usage, authenticity',
                icon: Zap,
                benefit: 'Creator partnership opportunities'
              }
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <item.icon className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <Switch
                        checked={dataSharing[item.key as keyof typeof dataSharing]}
                        onCheckedChange={(checked) => updateDataSharing(item.key, checked)}
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{item.description}</p>
                    <p className="text-green-400 text-xs mt-1">✓ {item.benefit}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'partnerships', title: 'New Partnership Opportunities', description: 'Get notified about relevant brand partnerships' },
              { key: 'nearbyDeals', title: 'Nearby Deals', description: 'Location-based product offers' },
              { key: 'personalInsights', title: 'Personal Insights', description: 'Your weekly performance and tips' },
              { key: 'trendingProducts', title: 'Trending Products', description: 'Popular products in your categories' },
              { key: 'rewards', title: 'Rewards & Achievements', description: 'Milestone celebrations and rewards' },
              { key: 'marketing', title: 'Marketing Updates', description: 'App updates and feature announcements' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{item.title}</h4>
                  <p className="text-gray-400 text-xs mt-1">{item.description}</p>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(checked) => updateNotifications(item.key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

      </div>

      <BottomNavigation />
    </div>
  );
}