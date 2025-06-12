import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  Calendar,
  Share2,
  Gift,
  Users,
  Zap,
  Crown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface GamificationSummary {
  userStats: {
    level: string;
    totalPoints: number;
    totalProducts: number;
    currentStreak: number;
    longestStreak: number;
    totalSavings: string;
    storiesPosted: number;
    friendsReferred: number;
  };
  earnedBadges: Array<{
    id: string;
    name: string;
    category: string;
    icon: string;
    description: string;
    earnedAt: string;
  }>;
  availableBadges: Array<{
    id: string;
    name: string;
    category: string;
    icon: string;
    description: string;
    requirement: any;
    progress?: number;
  }>;
  recentActivities: Array<{
    id: number;
    activityType: string;
    points: number;
    metadata: any;
    createdAt: string;
  }>;
  nextLevel: {
    name: string;
    requiredProducts: number;
    productsNeeded: number;
    progressPercentage: number;
  };
}

export default function GamificationPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const userId = 1; // Hardcoded for MVP

  const { data: gamificationData, isLoading } = useQuery<GamificationSummary>({
    queryKey: [`/api/gamification/summary/${userId}`],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: allBadges } = useQuery({
    queryKey: ["/api/badges"],
  });

  const { data: userActivities } = useQuery({
    queryKey: [`/api/users/${userId}/activities`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
        <div className="max-w-6xl mx-auto text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
            Gamification System Loading
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Setting up your achievement tracking...
          </p>
        </div>
      </div>
    );
  }

  const { userStats, earnedBadges, availableBadges, recentActivities, nextLevel } = gamificationData;

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "VIP": return <Crown className="w-6 h-6 text-yellow-500" />;
      case "Explorer": return <Target className="w-6 h-6 text-blue-500" />;
      case "Advocate": return <Star className="w-6 h-6 text-purple-500" />;
      default: return <Trophy className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBadgeIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Trophy, Star, Target, TrendingUp, Award, Clock, Calendar, Share2, Gift, Users, Zap
    };
    const IconComponent = iconMap[iconName] || Trophy;
    return <IconComponent className="w-6 h-6" />;
  };

  const formatActivityType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Achievement Journey
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress, earn badges, and unlock exclusive rewards
          </p>
        </div>

        {/* Level & Progress Overview */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getLevelIcon(userStats.level)}
                <div>
                  <h2 className="text-2xl font-bold">{userStats.level}</h2>
                  <p className="text-purple-100">Current Level</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userStats.totalPoints}</div>
                <div className="text-purple-100">Total Points</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextLevel.name}</span>
                <span>{userStats.totalProducts}/{nextLevel.requiredProducts} products</span>
              </div>
              <Progress 
                value={nextLevel.progressPercentage} 
                className="h-3 bg-purple-700"
              />
              <p className="text-sm text-purple-100">
                {nextLevel.productsNeeded} more products to reach {nextLevel.name}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.totalProducts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Products Claimed</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.currentStreak}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Current Streak</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Share2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.storiesPosted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Stories Shared</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.friendsReferred}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Friends Referred</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {earnedBadges.slice(0, 3).length > 0 ? (
                  <div className="space-y-3">
                    {earnedBadges.slice(0, 3).map((badge) => (
                      <div key={badge.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center space-x-3">
                          {getBadgeIcon(badge.icon)}
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {badge.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {badge.description}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {badge.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Start claiming products to earn your first badges!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span>Next Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableBadges.slice(0, 3).map((badge) => (
                    <div key={badge.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center space-x-3">
                        {getBadgeIcon(badge.icon)}
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {badge.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {badge.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            {/* Earned Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Earned Badges ({earnedBadges.length})</CardTitle>
                <CardDescription>Your collection of achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {earnedBadges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {earnedBadges.map((badge) => (
                      <Card key={badge.id} className="border-2 border-yellow-200 dark:border-yellow-700 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                        <CardContent className="p-4 text-center">
                          <div className="mb-3">
                            {getBadgeIcon(badge.icon)}
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            {badge.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {badge.description}
                          </p>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {badge.category}
                          </Badge>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Earned {new Date(badge.earnedAt).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      No Badges Yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Start claiming products and sharing stories to earn your first badges!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Available Badges ({availableBadges.length})</CardTitle>
                <CardDescription>Badges you can earn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableBadges.map((badge) => (
                    <Card key={badge.id} className="border border-gray-200 dark:border-gray-700 opacity-75 hover:opacity-100 transition-opacity">
                      <CardContent className="p-4 text-center">
                        <div className="mb-3 opacity-60">
                          {getBadgeIcon(badge.icon)}
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                          {badge.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {badge.description}
                        </p>
                        <Badge variant="outline">
                          {badge.category}
                        </Badge>
                        {badge.progress !== undefined && (
                          <div className="mt-3">
                            <Progress value={badge.progress} className="h-2" />
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {badge.progress}% complete
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest achievements and actions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatActivityType(activity.activityType)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          +{activity.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      No Activities Yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Start using Earlyshh to see your activity history here!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}