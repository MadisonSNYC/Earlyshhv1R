import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Instagram, Gift, Star } from "lucide-react";

interface StoryPromptModalProps {
  onClose: () => void;
}

export default function StoryPromptModal({ onClose }: StoryPromptModalProps) {
  const handleOpenInstagramStory = () => {
    // Simulate opening Instagram with story template
    alert("Opening Instagram...");
    onClose();
  };

  const handleSkipSharing = () => {
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white text-2xl w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">Coupon Redeemed!</h2>
          <p className="text-gray-600 mb-6">Share your experience and help others discover great deals</p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Share to Instagram Story</h3>
            <p className="text-sm text-gray-600 mb-3">
              Tag <span className="font-semibold text-primary">@Earlyshh</span> and{" "}
              <span className="font-semibold text-primary">@SuperRootEnergy</span> in your story
            </p>

            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Gift className="w-3 h-3" />
                <span>Get early access</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Build your profile</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleOpenInstagramStory}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold button-press"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Open Instagram
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkipSharing}
              className="w-full text-gray-500 hover:text-gray-700 font-medium"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
