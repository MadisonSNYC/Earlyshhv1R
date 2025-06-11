import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { 
  ShoppingBag, 
  MapPin, 
  Smartphone, 
  Building2, 
  Camera,
  Target,
  Instagram,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useLocation } from "wouter";

const ONBOARDING_STEPS = [
  {
    id: 1,
    icon: ShoppingBag,
    title: "Welcome to Earlyshh 🎯",
    description: "Your neighborhood partnership awaits. Get first access to the brands everyone will discover.",
    action: "Join the Community",
    colors: ["#FF6B9D", "#4ECDC4"]
  },
  {
    id: 2,
    icon: MapPin,
    title: "Discover Exclusive Partnerships 📍",
    description: "Handpicked brands offer limited partnership slots to community members in your area.",
    action: "Explore Partnerships",
    colors: ["#A855F7", "#EC4899"]
  },
  {
    id: 3,
    icon: Smartphone,
    title: "Unlock Your Partnership Pass 🎫",
    description: "Each partnership gives you exclusive access - show your digital pass at participating locations.",
    action: "Get Access",
    colors: ["#8B5CF6", "#06B6D4"]
  },
  {
    id: 4,
    icon: Building2,
    title: "Experience First-Hand ✨",
    description: "Try the product, experience the brand, become part of their authentic story.",
    action: "Experience It",
    colors: ["#6366F1", "#10B981"]
  },
  {
    id: 5,
    icon: Camera,
    title: "Confirm Your Partnership 📸",
    description: "Share an Instagram Story tagging the brand and @earlyshh to complete your partnership.",
    action: "Start Discovering!",
    colors: ["#3B82F6", "#F59E0B"]
  }
];

export default function OnboardingPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would redirect to Instagram OAuth
      const mockInstagramData = {
        instagramId: "user_" + Date.now(),
        username: "earlyshh_user",
        fullName: "Earlyshh User",
        profilePicUrl: "/api/placeholder/100/100",
      };

      await login(mockInstagramData);
      setLocation("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="min-h-screen flex flex-col">
        {/* Progress Bar */}
        <div className="flex items-center justify-between p-6 pt-12">
          <div className="flex items-center space-x-2 text-white">
            <span className="text-sm font-medium">{currentStep + 1} of {ONBOARDING_STEPS.length}</span>
          </div>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-white hover:bg-white/10"
            size="sm"
          >
            Skip
          </Button>
        </div>
        
        {/* Progress Indicator */}
        <div className="px-6 mb-8">
          <div className="w-full bg-purple-700/50 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto glass-morphism rounded-3xl flex items-center justify-center border border-white/20">
              <IconComponent className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-6 leading-tight max-w-sm">
            {currentStepData.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-purple-100 mb-12 max-w-md leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Action Button */}
          <div className="space-y-4 w-full max-w-sm">
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-600 hover:to-cyan-500 text-white border-0 rounded-2xl shadow-lg transition-all duration-200"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <div className="flex items-center justify-center space-x-2">
                  <Instagram className="w-5 h-5" />
                  <span>Get Partnership Access</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{currentStepData.action}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Back Button */}
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                variant="ghost"
                className="w-full text-purple-200 hover:bg-white/10 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            )}
          </div>

          {/* Terms Text */}
          {currentStep === ONBOARDING_STEPS.length - 1 && (
            <p className="text-sm text-purple-300 mt-6 max-w-xs">
              By continuing, you agree to authentic partnership sharing
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
