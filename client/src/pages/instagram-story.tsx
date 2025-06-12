import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, Instagram, Camera, Upload, CheckCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function InstagramStoryPage() {
  const [, params] = useRoute('/instagram-story/:couponId');
  const [, setLocation] = useLocation();
  const [storyPosted, setStoryPosted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch coupon data for context
  const { data: coupon, isLoading } = useQuery({
    queryKey: ['/api/coupons', params?.couponId],
    enabled: !!params?.couponId,
  });

  // Mock coupon data for demo
  const mockCoupon = {
    id: params?.couponId || '1',
    brandName: 'SuperRoot Energy',
    productName: 'SuperRoot Premium Energy Formula',
    brandIgHandle: '@superrootenergy',
    redeemableAmount: '$3.99',
    campaign: {
      brandName: 'SuperRoot Energy',
      brandIgHandle: '@superrootenergy'
    }
  };

  const activeCoupon = coupon || mockCoupon;

  // Submit Instagram story mutation
  const submitStoryMutation = useMutation({
    mutationFn: async (data: { couponId: string; storyUrl?: string; storyImage?: string }) => {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // Hardcoded for MVP
          campaignId: 1, // Will get from coupon data
          couponId: parseInt(data.couponId),
          instagramStoryId: 'mock_story_' + Date.now(),
          storyUrl: data.storyUrl || 'https://instagram.com/stories/mock',
          metadata: { image: data.storyImage }
        }),
      });
      if (!response.ok) throw new Error('Failed to submit story');
      return response.json();
    },
    onSuccess: () => {
      setStoryPosted(true);
      toast({
        title: "Story Submitted!",
        description: "Thank you for sharing! Now complete the product survey.",
      });
      // Navigate to survey after 2 seconds
      setTimeout(() => {
        setLocation(`/survey/${params?.couponId}`);
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit story",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitStory = () => {
    if (params?.couponId) {
      submitStoryMutation.mutate({
        couponId: params.couponId,
        storyImage: uploadedImage || undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setLocation(`/qr/${params?.couponId}`)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Share Your Experience</h1>
          <div className="w-10 h-10"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
          {!storyPosted ? (
            <>
              {/* Brand Info */}
              <div className="text-center mb-8">
                <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Share on Instagram Stories
                </h2>
                <p className="text-gray-600">
                  Post about your experience with <strong>{activeCoupon.brandName}</strong> and tag <strong>{activeCoupon.brandIgHandle}</strong>
                </p>
              </div>

              {/* Upload Section */}
              <div className="mb-8">
                <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded story" 
                        className="w-32 h-56 object-cover rounded-2xl mx-auto shadow-lg"
                      />
                      <p className="text-green-600 font-semibold">Story uploaded successfully!</p>
                      <Button
                        onClick={() => setUploadedImage(null)}
                        variant="outline"
                        size="sm"
                      >
                        Upload Different Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-pink-400 mx-auto" />
                      <div>
                        <p className="text-gray-700 font-semibold mb-2">Upload Your Instagram Story</p>
                        <p className="text-gray-500 text-sm mb-4">
                          Take a screenshot of your story after posting
                        </p>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="bg-pink-100 text-pink-600 px-6 py-3 rounded-xl font-semibold hover:bg-pink-200 transition-colors inline-block">
                          Choose Image
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">How to share:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <p>Post a photo/video of the product on your Instagram Story</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <p>Tag <strong>{activeCoupon.brandIgHandle}</strong> and use #EarlyshhReview</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <p>Take a screenshot and upload it here</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitStory}
                disabled={!uploadedImage || submitStoryMutation.isPending}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:opacity-50"
              >
                {submitStoryMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>Submit Story</span>
                  </div>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Story Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for sharing your experience with {activeCoupon.brandName}
              </p>
              <p className="text-purple-600 font-semibold">
                Redirecting to product survey...
              </p>
            </div>
          )}
        </div>

        {/* Skip Option */}
        {!storyPosted && (
          <div className="text-center mt-6">
            <button
              onClick={() => setLocation(`/survey/${params?.couponId}`)}
              className="text-white/80 hover:text-white underline"
            >
              Skip for now and go to survey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}