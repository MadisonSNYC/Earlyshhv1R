import { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, Instagram, Camera, Upload, CheckCircle, Share2, X, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function InstagramStoryPage() {
  // Route and navigation hooks
  const [, params] = useRoute('/instagram-story/:couponId');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State management
  const [storyPosted, setStoryPosted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Refs for camera functionality
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        // Draw the video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add brand tag overlay
        addBrandOverlay(context, canvas.width, canvas.height);

        // Convert to base64
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoData);
        stopCamera();
      }
    }
  };

  const addBrandOverlay = (context: CanvasRenderingContext2D, width: number, height: number) => {
    // Set up text styling for brand tag
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(20, height - 100, width - 40, 80);

    // Brand tag (visible and prominent)
    context.fillStyle = '#FFFFFF';
    context.font = 'bold 32px Arial';
    context.textAlign = 'left';
    context.fillText(activeCoupon.brandIgHandle, 40, height - 60);

    // Hidden tag (smaller, less prominent but still visible)
    context.fillStyle = 'rgba(255, 255, 255, 0.6)';
    context.font = '16px Arial';
    context.textAlign = 'left';
    context.fillText('@earlyshh', 40, height - 30);

    // Tracking hashtag (nearly invisible)
    context.fillStyle = 'rgba(255, 255, 255, 0.05)';
    context.font = '8px Arial';
    context.textAlign = 'right';
    context.fillText('#EarlyshhReview', width - 10, height - 5);
  };

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

  const handleSubmitStory = async () => {
    setIsSubmitting(true);

    if (params?.couponId) {
      submitStoryMutation.mutate({
        couponId: params.couponId,
        storyImage: capturedPhoto || uploadedImage || undefined,
      });
    }

    setIsSubmitting(false);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setUploadedImage(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 via-blue-500 to-cyan-500 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Camera View
  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="relative h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Camera Controls */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <Button
              onClick={stopCamera}
              className="bg-gray-900/80 backdrop-blur-md text-white rounded-full w-12 h-12 p-0 border border-white/20"
            >
              <X className="w-6 h-6" />
            </Button>

            <div className="bg-gray-900/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <span className="text-white font-medium">Story Camera</span>
            </div>

            <Button
              onClick={switchCamera}
              className="bg-gray-900/80 backdrop-blur-md text-white rounded-full w-12 h-12 p-0 border border-white/20"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
          </div>

          {/* Brand Tag Preview */}
          <div className="absolute bottom-32 left-6 right-6 bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <Instagram className="w-6 h-6 text-pink-400" />
              <div>
                <p className="text-white font-bold">{activeCoupon.brandIgHandle}</p>
                <p className="text-gray-400 text-sm">Primary brand tag</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-gray-300 text-xs">@</span>
              </div>
              <div>
                <p className="text-gray-300 font-medium">@earlyshh</p>
                <p className="text-gray-500 text-xs">Hidden tag (required)</p>
              </div>
            </div>
          </div>

          {/* Capture Button */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={capturePhoto}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full w-20 h-20 p-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Camera className="w-8 h-8" />
            </Button>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 via-blue-500 to-cyan-500 relative overflow-hidden">
      {/* Enhanced background overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-500/15 to-cyan-400/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-gray-900/20" />

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setLocation(`/qr/${params?.couponId}`)}
            className="bg-gray-900/80 backdrop-blur-md text-white rounded-full w-12 h-12 p-0 border border-white/20 hover:bg-gray-800/90 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-black text-white drop-shadow-lg">Share Your Experience</h1>
          <div className="w-12 h-12"></div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20">
          {!storyPosted ? (
            <>
              {/* Brand Info */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Instagram className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-3 drop-shadow-lg">
                  Share on Instagram Stories
                </h2>
                <p className="text-orange-200 drop-shadow-md">
                  Post about your experience with <span className="font-bold text-yellow-300">{activeCoupon.brandName}</span>, tag <span className="font-bold text-pink-300">{activeCoupon.brandIgHandle}</span>, and include <span className="font-bold text-gray-300">@earlyshh</span> as a hidden tag
                  <span className="block text-gray-400 text-xs mt-2">*Hidden tag = smaller, discrete placement in your story</span>
                </p>
              </div>

              {/* Photo Options */}
              {!capturedPhoto && !uploadedImage && (
                <div className="space-y-4 mb-8">
                  {/* Camera Option */}
                  <Button
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold py-6 rounded-2xl text-lg shadow-xl shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
                  >
                    <Camera className="w-6 h-6 mr-3" />
                    Take Photo with Auto-Tags
                    <Sparkles className="w-5 h-5 ml-3" />
                  </Button>

                  {/* Upload Option */}
                  <div className="text-center">
                    <p className="text-gray-300 text-sm mb-3">or</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Existing Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Photo Preview */}
              {(capturedPhoto || uploadedImage) && (
                <div className="mb-8">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="space-y-4">
                      <img
                        src={capturedPhoto || uploadedImage}
                        alt="Story preview"
                        className="w-full max-w-xs mx-auto rounded-2xl shadow-xl object-cover"
                      />
                      <div className="text-center">
                        <p className="text-green-300 font-bold mb-2 drop-shadow-md">
                          {capturedPhoto ? '📸 Photo ready with brand tag + @earlyshh!' : '✅ Photo uploaded - remember to tag @earlyshh!'}
                        </p>
                        <Button
                          onClick={capturedPhoto ? retakePhoto : () => {
                            setUploadedImage(null);
                            fileInputRef.current?.click();
                          }}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300"
                          size="sm"
                        >
                          {capturedPhoto ? 'Retake Photo' : 'Choose Different Photo'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
                <h3 className="text-white font-black text-lg mb-4 drop-shadow-md">Quick Instructions:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">1</div>
                    <p className="text-white font-medium drop-shadow-sm">Post a photo/video of the product on your Instagram Story</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">2</div>
                    <p className="text-white font-medium drop-shadow-sm">Tag <span className="text-pink-300 font-bold">{activeCoupon.brandIgHandle}</span> and include <span className="text-gray-300 font-bold">@earlyshh</span> as hidden tag</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">3</div>
                    <p className="text-white font-medium drop-shadow-sm">Take a screenshot and upload it here</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitStory}
                disabled={(!capturedPhoto && !uploadedImage) || isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black py-4 rounded-2xl text-lg shadow-xl shadow-yellow-500/40 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>Submit Story</span>
                    <Zap className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2 drop-shadow-lg">Story Submitted!</h2>
              <p className="text-orange-200 mb-4 drop-shadow-md">
                Thank you for sharing your experience with {activeCoupon.brandName}
              </p>
              <p className="text-purple-300 font-bold drop-shadow-md">
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
              className="text-white/80 hover:text-white underline font-medium"
            >
              Skip for now and go to survey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}