import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Check, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

interface CouponModalProps {
  coupon: any;
  onClose: () => void;
  onRedeemed: () => void;
}

export default function CouponModal({ coupon, onClose, onRedeemed }: CouponModalProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showFullTerms, setShowFullTerms] = useState(false);

  const redeemMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', `/api/coupons/${coupon.couponId}/redeem`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Early Access Secured!",
        description: "Your QR code is ready for redemption.",
      });
      onRedeemed();
      setLocation(`/redeem/${coupon.couponId}`);
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Access Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleShareToInstagram = () => {
    // Simulate opening Instagram with pre-filled story template
    alert("Opening Instagram to share your story...");
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full max-h-[90vh] overflow-y-auto p-0 glass-morphism border-white/20">
        <DialogTitle className="sr-only">Coupon Details and QR Code</DialogTitle>
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 earlyshh-gradient rounded-2xl flex items-center justify-center shadow-lg">
                <img
                  src={coupon.brandLogo}
                  alt="Brand logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
              </div>
              <div className="w-8 h-8 glass-morphism rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-pink-500 to-cyan-400 rounded-sm"></div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 rounded-xl">
              <X className="h-5 w-5 text-white" />
            </Button>
          </div>

          <h2 className="text-xl font-rubik font-bold text-white mb-2">{coupon.productName}</h2>
          <p className="text-2xl font-rubik font-bold earlyshh-text-gradient mb-1">{coupon.redeemableAmount}</p>
          <p className="text-sm text-gray-400 font-space">
            Expires {new Date(coupon.expirationDate).toLocaleDateString()}
          </p>
        </div>

        {/* QR Code Section */}
        <div className="p-6 glass-morphism">
          <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl text-center shadow-lg">
            <h3 className="text-lg font-rubik font-semibold mb-4 text-gray-900">Show at Checkout</h3>

            {/* High-contrast QR Code */}
            <div className="w-48 h-48 mx-auto bg-white border-4 border-gray-200 rounded-xl flex items-center justify-center mb-4">
              <div className="w-40 h-40 qr-code-container rounded-lg"></div>
            </div>

            {/* Fetch Code */}
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Backup Code</p>
              <p className="text-lg font-mono font-bold text-gray-900">{coupon.fetchCode}</p>
            </div>

            <p className="text-xs text-gray-500">
              Fetched: {new Date(coupon.dateFetched).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Legal and Actions */}
        <div className="p-6">
          <Alert className="bg-yellow-50 border-yellow-200 mb-6">
            <AlertDescription className="text-gray-700">
              {coupon.legalDisclaimer}
              <button
                onClick={() => setShowFullTerms(!showFullTerms)}
                className="block text-primary font-medium mt-1 hover:underline"
              >
                {showFullTerms ? "Hide" : "View"} Full Terms
              </button>
              {showFullTerms && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>• Limit one per customer</p>
                  <p>• Cannot be combined with other offers</p>
                  <p>• Valid at participating locations only</p>
                  <p>• No cash value</p>
                </div>
              )}
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => redeemMutation.mutate()}
              disabled={redeemMutation.isPending}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold button-press"
            >
              <Check className="w-4 h-4 mr-2" />
              {redeemMutation.isPending ? "Redeeming..." : "Mark as Redeemed"}
            </Button>

            <Button
              variant="outline"
              onClick={handleShareToInstagram}
              className="w-full border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-semibold button-press"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Share to Instagram Story
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import type { Campaign } from '../types';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  campaign: Campaign | null;
  error: any;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  campaign: any;
  error: string | null;
}

export default function CouponModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  campaign,
  error
}: CouponModalProps) {
  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-white/20 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Claim Partnership
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campaign Info */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {campaign.brandName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{campaign.brandName}</h3>
              <p className="text-sm text-gray-300">{campaign.productName}</p>
            </div>
          </div>

          {/* Partnership Details */}
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Partnership Value:</span>
              <span className="text-cyan-400 font-semibold">
                {campaign.redeemableAmount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Expires:</span>
              <span className="text-white">
                {new Date(campaign.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Spots Remaining:</span>
              <span className="text-white">{campaign.spotsRemaining}</span>
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-400 text-center">
            By claiming this partnership, you agree to visit the location and share
            an Instagram Story to complete the partnership.
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">
                {error.message || 'Failed to claim partnership. Please try again.'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-white/30 text-gray-300 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                'Claim Partnership'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
