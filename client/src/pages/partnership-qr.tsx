import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, Copy, Share2, Clock, CheckCircle } from 'lucide-react';
import { Campaign } from '@shared/schema';
import * as QRCode from 'qrcode.react';

export default function PartnershipQRPage() {
  const [location, navigate] = useLocation();
  const [qrValue, setQrValue] = useState('');
  const [fetchCode, setFetchCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  
  // Extract campaign ID from URL path
  const pathParts = location.split('/');
  const campaignId = pathParts[pathParts.length - 1];

  // Fetch campaign data based on ID
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const campaign = campaigns.find(c => c.id.toString() === campaignId);

  useEffect(() => {
    if (campaign) {
      // Simulate QR code generation
      setTimeout(() => {
        const qrCodeValue = `EARLYSHH_${campaign.brandName.toUpperCase()}_${Date.now()}`;
        const backupCode = `${campaign.brandName.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        
        setQrValue(qrCodeValue);
        setFetchCode(backupCode);
        setIsGenerating(false);
      }, 2000);
    }
  }, [campaign]);

  const handleProceedToRedemption = () => {
    navigate(`/partnership-loading/${campaignId}`);
  };

  const copyFetchCode = () => {
    navigator.clipboard.writeText(fetchCode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Partnership not found</h2>
          <Button onClick={() => navigate('/home')} variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen earlyshh-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-bold text-lg">Your QR Code</h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-6 space-y-6">
          {/* QR Code Card */}
          <div className="bg-gradient-to-br from-gray-900/95 via-purple-900/80 to-gray-900/95 backdrop-blur-xl border border-purple-300/40 rounded-3xl p-6 shadow-2xl">
            
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Generating Your QR Code
                </h2>
                <p className="text-gray-300 text-sm mb-4">
                  Creating secure redemption code...
                </p>
                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Your QR Code is Ready!
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Show this code at pickup to redeem your {campaign.productName}
                  </p>
                </div>

                {/* QR Code Display */}
                <div className="bg-white rounded-2xl p-6 mb-6">
                  <div className="flex justify-center">
                    <QRCode
                      value={qrValue}
                      size={200}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>

                {/* Backup Code */}
                <div className="bg-gradient-to-br from-gray-800/60 via-blue-900/40 to-gray-800/60 backdrop-blur-md border border-blue-300/20 rounded-2xl p-4 mb-6">
                  <h3 className="text-white font-semibold text-sm mb-2 flex items-center">
                    <Copy className="w-4 h-4 mr-2 text-blue-400" />
                    Backup Fetch Code
                  </h3>
                  <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
                    <span className="text-white font-mono text-lg tracking-wider">{fetchCode}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyFetchCode}
                      className="text-blue-400 hover:bg-blue-400/10 p-1"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Use this code if QR scanner isn't available
                  </p>
                </div>

                {/* Redemption Instructions */}
                <div className="bg-gradient-to-br from-green-900/40 via-gray-900/60 to-green-900/40 backdrop-blur-md border border-green-300/20 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-2">Redemption Instructions:</h4>
                      <ul className="text-gray-300 text-xs space-y-1">
                        <li>• Present this QR code at the brand location</li>
                        <li>• Have your ID ready for verification</li>
                        <li>• Code expires in 24 hours</li>
                        <li>• One-time use only</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Expiration Notice */}
                <div className="flex items-center justify-center gap-2 text-orange-400 bg-orange-900/20 rounded-lg p-3 border border-orange-400/20">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Expires in 23:45:32</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Action */}
        {!isGenerating && (
          <div className="p-4 bg-gradient-to-t from-black/50 to-transparent">
            <Button
              onClick={handleProceedToRedemption}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-2xl text-lg shadow-2xl shadow-orange-500/30 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02] border border-white/10"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Ready to Redeem
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}