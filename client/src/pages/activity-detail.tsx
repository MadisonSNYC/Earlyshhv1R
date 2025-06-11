import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Instagram,
  Camera,
  Play,
  Eye,
  TrendingUp,
  Award
} from 'lucide-react';
import BottomNavigation from '@/components/bottom-navigation';

export default function ActivityDetailPage() {
  const [location, navigate] = useLocation();
  const [match, params] = useRoute("/activity/:id");
  const activityId = params?.id;
  
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Fetch activity details
  const { data: activity, isLoading } = useQuery({
    queryKey: [`/api/activities/${activityId}`],
    enabled: !!activityId,
  });

  // Mock activity data for demonstration
  const mockActivity = {
    id: parseInt(activityId || '1'),
    type: "partnership_claimed",
    brandName: "SuperRoot Energy",
    brandHandle: "@superoot_energy",
    productName: "Premium Energy Drink",
    userHandle: "@maya_discovers",
    userName: "Maya Chen",
    timestamp: "2 hours ago",
    location: "Downtown NYC",
    distance: "0.3 mi",
    storyContent: {
      type: "image",
      url: "/api/placeholder/400/600",
      caption: "Just discovered this amazing energy drink! 🚀 The flavor is incredible and it's giving me the perfect boost for my afternoon workout. Thanks @superoot_energy for the partnership! #EnergyBoost #DiscoverWithEarlyshh"
    },
    metrics: {
      views: 1247,
      likes: 89,
      comments: 23,
      shares: 12,
      engagementRate: "7.2%"
    },
    partnershipDetails: {
      offerValue: "$15",
      redeemableAmount: "$15",
      expiryDate: "Dec 25, 2024",
      status: "Active"
    },
    tags: ["#EnergyDrink", "#Fitness", "#Partnership", "#NYC"]
  };

  const activityData = activity || mockActivity;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-8">
          <Button
            onClick={() => navigate('/notifications')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-lg font-rubik font-bold text-white">Activity</h1>
          <div className="w-16"></div>
        </div>

        {/* Activity Header */}
        <Card className="mx-6 mb-4 glass-morphism border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-rubik font-bold text-white">
                Partnership Claimed
              </h2>
              <p className="text-gray-300 font-space text-sm">
                {activityData.brandName} • {activityData.timestamp}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 font-space text-xs">
                  {activityData.location} • {activityData.distance}
                </span>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
              Active
            </Badge>
          </div>
        </Card>

        {/* Story Content */}
        <Card className="mx-6 mb-4 glass-morphism border-white/20 overflow-hidden">
          <div className="relative">
            <img 
              src={activityData.storyContent.url}
              alt="Story content"
              className="w-full h-80 object-cover"
            />
            <div className="absolute top-4 left-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div>
                  <p className="text-white font-rubik font-semibold text-sm drop-shadow">
                    {activityData.userName}
                  </p>
                  <p className="text-white/80 font-space text-xs drop-shadow">
                    {activityData.userHandle}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Button
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <Instagram className="w-4 h-4 mr-1" />
                View Story
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-white font-space text-sm leading-relaxed mb-4">
              {activityData.storyContent.caption}
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsLiked(!isLiked)}
                  variant="ghost"
                  size="sm"
                  className={`text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {activityData.metrics.likes}
                </Button>
                <Button
                  onClick={() => setShowComments(!showComments)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {activityData.metrics.comments}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  {activityData.metrics.shares}
                </Button>
              </div>
              <Button
                onClick={() => setIsBookmarked(!isBookmarked)}
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/10 ${isBookmarked ? 'text-yellow-400' : ''}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Metrics & Performance */}
        <Card className="mx-6 mb-4 glass-morphism border-white/20 p-6">
          <h3 className="text-lg font-rubik font-bold text-white mb-4">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-4 h-4 text-cyan-400 mr-1" />
              </div>
              <div className="text-xl font-rubik font-bold text-white">
                {activityData.metrics.views.toLocaleString()}
              </div>
              <div className="text-xs font-space text-gray-400">Views</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              </div>
              <div className="text-xl font-rubik font-bold text-green-400">
                {activityData.metrics.engagementRate}
              </div>
              <div className="text-xs font-space text-gray-400">Engagement</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 font-space">
                <Heart className="w-3 h-3 inline mr-1" />
                {activityData.metrics.likes} likes
              </span>
              <span className="text-gray-400 font-space">
                <MessageCircle className="w-3 h-3 inline mr-1" />
                {activityData.metrics.comments} comments
              </span>
            </div>
          </div>
        </Card>

        {/* Partnership Details */}
        <Card className="mx-6 mb-4 glass-morphism border-white/20 p-6">
          <h3 className="text-lg font-rubik font-bold text-white mb-4">
            Partnership Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-space text-sm">Brand</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-rubik font-semibold">
                  {activityData.brandName}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10 text-xs h-6"
                >
                  <Instagram className="w-3 h-3 mr-1" />
                  Follow
                </Button>
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-space text-sm">Offer Value</span>
              <span className="text-green-400 font-rubik font-bold">
                {activityData.partnershipDetails.offerValue}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-space text-sm">Status</span>
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                {activityData.partnershipDetails.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-space text-sm">Expires</span>
              <span className="text-white font-space text-sm">
                {activityData.partnershipDetails.expiryDate}
              </span>
            </div>
          </div>
        </Card>

        {/* Tags */}
        <Card className="mx-6 mb-6 glass-morphism border-white/20 p-6">
          <h3 className="text-lg font-rubik font-bold text-white mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {activityData.tags.map((tag, index) => (
              <Badge 
                key={index} 
                className="bg-purple-500/20 text-purple-300 border-purple-400/30 font-space"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}