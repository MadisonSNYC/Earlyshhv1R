import { useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Camera, Instagram, Target, ChevronLeft, Download, Share, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Campaign } from '@shared/schema';

interface PartnershipConfirmationProps {
  campaign?: Campaign;
}

export default function PartnershipConfirmationPage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get campaign data from navigation state or URL params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const campaignData = urlParams.get('campaign') ? JSON.parse(decodeURIComponent(urlParams.get('campaign')!)) : null;

  if (!campaignData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-rubik font-bold text-white mb-4">Partnership not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const startCamera = useCallback(async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please enable camera permissions to capture your story.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Add overlay text for Instagram story
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, canvas.height - 120, canvas.width, 120);
    
    context.fillStyle = 'white';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.fillText(`Trying ${campaignData.productName}!`, canvas.width / 2, canvas.height - 80);
    
    context.font = '18px Arial';
    context.fillText(`@${campaignData.brandName.toLowerCase().replace(/\s+/g, '')} x @earlyshh`, canvas.width / 2, canvas.height - 50);
    
    context.fillText('#EarlyAccess #Partnership', canvas.width / 2, canvas.height - 20);

    // Convert to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    setIsCapturing(false);
    stopCamera();
  }, [campaignData]);

  const shareToInstagram = useCallback(() => {
    // Create Instagram story sharing URL with pre-filled content
    const instagramUrl = `https://www.instagram.com/create/story/`;
    
    // For web, we'll open Instagram and copy the tags to clipboard
    const tags = `@${campaignData.brandName.toLowerCase().replace(/\s+/g, '')} @earlyshh #EarlyAccess #Partnership`;
    
    // Copy tags to clipboard
    navigator.clipboard.writeText(tags).then(() => {
      alert(`Tags copied to clipboard: ${tags}\n\nPlease paste these when sharing your Instagram story!`);
    });

    // Open Instagram in new tab
    window.open(instagramUrl, '_blank');
  }, [campaignData]);

  const downloadImage = useCallback(() => {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.download = `earlyshh-${campaignData.brandName}-story.jpg`;
    link.href = capturedImage;
    link.click();
  }, [capturedImage, campaignData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        {/* Camera View */}
        {showCamera && (
          <Card className="glass-morphism border-white/20 mb-6 overflow-hidden">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-[9/16] object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200"
                >
                  <Camera className="w-6 h-6" />
                </Button>
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Captured Image Preview */}
        {capturedImage && (
          <Card className="glass-morphism border-white/20 mb-6 overflow-hidden">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured story"
                className="w-full aspect-[9/16] object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                <Button
                  onClick={downloadImage}
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={shareToInstagram}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Instagram className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        {!showCamera && !capturedImage && (
          <Card className="glass-morphism border-white/20 text-center p-8 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-rubik font-bold text-white mb-4">
              Confirm Your Partnership
            </h1>
            
            <p className="text-white/90 font-space text-lg mb-6 leading-relaxed">
              You experienced {campaignData.productName} first! Now share your authentic Story to complete the partnership.
            </p>

            <Card className="bg-white/10 border-white/20 p-6 mb-6">
              <h3 className="text-white font-rubik font-bold text-lg mb-4">
                Share an Instagram Story
              </h3>
              <p className="text-white/80 font-space text-sm mb-4">
                Tag @earlyshh and @{campaignData.brandName.toLowerCase().replace(/\s+/g, '')} in your Story - no feed posts, only fleeting Stories count!
              </p>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                Stories only • Authentic content preferred
              </Badge>
            </Card>
          </Card>
        )}

        {/* Action Buttons */}
        {!showCamera && !capturedImage && (
          <div className="space-y-4">
            <Button
              onClick={startCamera}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-rubik font-bold py-4 h-16 text-lg shadow-2xl rounded-2xl"
            >
              <Instagram className="w-6 h-6 mr-2" />
              Share Your Story
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 font-rubik font-medium h-12 rounded-xl"
            >
              Share Later
            </Button>
            
            <p className="text-center text-white/60 font-space text-xs px-4">
              Story sharing helps other community members discover authentic partnerships
            </p>
          </div>
        )}
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}