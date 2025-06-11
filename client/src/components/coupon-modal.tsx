import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const [showFullTerms, setShowFullTerms] = useState(false);

  const redeemMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', `/api/coupons/${coupon.couponId}/redeem`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Coupon Redeemed!",
        description: "Share your experience on Instagram to help others discover great deals.",
      });
      onRedeemed();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Redeem",
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
      <DialogContent className="max-w-sm w-full max-h-[90vh] overflow-y-auto p-0">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={coupon.brandLogo}
                alt="Brand logo"
                className="w-12 h-12 rounded-xl"
              />
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-ticket-alt text-white text-sm"></i>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{coupon.productName}</h2>
          <p className="text-2xl font-bold text-primary mb-1">{coupon.redeemableAmount}</p>
          <p className="text-sm text-gray-500">
            Expires {new Date(coupon.expirationDate).toLocaleDateString()}
          </p>
        </div>

        {/* QR Code Section */}
        <div className="p-6 bg-gray-50">
          <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Show at Checkout</h3>

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
