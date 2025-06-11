import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-sm w-full p-6 glass-morphism border-white/20">
        <DialogTitle className="sr-only">Share Your Experience on Instagram</DialogTitle>
        <div className="text-center">
          <div className="w-16 h-16 earlyshh-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Check className="text-white text-2xl w-8 h-8" />
          </div>

          <h2 className="text-xl font-rubik font-bold text-white mb-2">Experience Unlocked!</h2>
          <p className="text-gray-300 mb-6 font-space">Share your story to secure priority access to future drops</p>

          <div className="electric-border glass-morphism rounded-xl p-4 mb-6">
            <h3 className="font-rubik font-semibold text-white mb-2">Share Your Story</h3>
            <p className="text-sm text-gray-300 mb-3 font-space">
              Tag <span className="font-semibold earlyshh-text-gradient">@Earlyshh</span> and the brand in your story
            </p>

            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 font-space">
              <div className="flex items-center space-x-1">
                <Gift className="w-3 h-3 text-yellow-400" />
                <span>Priority access</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>VIP status</span>
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
