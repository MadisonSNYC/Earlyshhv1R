import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Package, Star } from 'lucide-react';
import { Campaign } from '@shared/schema';

export default function ProductConfirmationPage() {
  const [location, navigate] = useLocation();
  
  // Extract campaign ID from URL path
  const pathParts = location.split('/');
  const campaignId = pathParts[pathParts.length - 1];

  // Fetch campaign data based on ID
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const campaign = campaigns.find(c => c.id.toString() === campaignId);

  const handleConfirmProduct = () => {
    navigate(`/partnership-qr/${campaignId}`);
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
    <div className="min-h-screen earlyshh-bg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 pt-8 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-bold text-lg">Confirm Product</h1>
          <div className="w-10" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Product Confirmation Card */}
          <div className="bg-gradient-to-br from-gray-900/95 via-purple-900/80 to-gray-900/95 backdrop-blur-xl border border-purple-300/40 rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Confirm Your Product
              </h2>
              <p className="text-gray-300 text-sm">
                Make sure you have the correct product before proceeding
              </p>
            </div>

            {/* Product Details */}
            <div className="bg-gradient-to-br from-gray-800/60 via-blue-900/40 to-gray-800/60 backdrop-blur-md border border-blue-300/20 rounded-2xl p-5 mb-6">
              {/* Brand Logo/Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">SO</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{campaign.brandName}</h3>
                  <p className="text-gray-300 text-sm">{campaign.brandIgHandle}</p>
                </div>
              </div>

              {/* Product Name */}
              <div className="mb-4">
                <h4 className="text-white font-semibold text-base mb-1">Product Name</h4>
                <p className="text-gray-200 text-lg font-medium">{campaign.productName}</p>
              </div>

              {/* Product Description */}
              <div className="mb-4">
                <h4 className="text-white font-semibold text-base mb-2">Description</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {campaign.offerDescription}
                </p>
              </div>

              {/* Product Image Placeholder */}
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-8 border border-gray-600/30">
                <div className="text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Product Image</p>
                  <p className="text-gray-500 text-xs mt-1">Visual confirmation will be available at pickup</p>
                </div>
              </div>
            </div>

            {/* Confirmation Instructions */}
            <div className="bg-gradient-to-br from-green-900/40 via-gray-900/60 to-green-900/40 backdrop-blur-md border border-green-300/20 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Before you confirm:</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Make sure this matches the product you want</li>
                    <li>• Check the brand name and description</li>
                    <li>• You'll receive a QR code for pickup after confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Add padding at bottom for fixed button */}
          <div className="h-24"></div>
        </div>

        {/* Fixed Bottom Action */}
        <div className="flex-shrink-0 p-4 bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-sm">
          <Button
            onClick={handleConfirmProduct}
            className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-4 rounded-2xl text-lg shadow-2xl shadow-green-500/30 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] border border-white/10"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirm Product
          </Button>
        </div>
      </div>
    </div>
  );
}