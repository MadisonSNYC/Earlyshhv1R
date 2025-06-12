import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Zap, 
  MapPin, 
  Gift, 
  Users, 
  ArrowRight, 
  ChevronLeft,
  Instagram,
  Bell,
  Shield
} from "lucide-react";

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to EARLYSHH",
    subtitle: "Connect your Instagram to get started",
    content: "instagram-connect"
  },
  {
    id: 2,
    title: "Enable Location",
    subtitle: "Find exclusive partnerships near you",
    content: "location-permission"
  },
  {
    id: 3,
    title: "Notification Preferences",
    subtitle: "Stay updated on new deals and partnerships",
    content: "notifications"
  },
  {
    id: 4,
    title: "Set Your Interests",
    subtitle: "Get personalized partnership recommendations",
    content: "interests"
  }
];

const interests = [
  { id: "health", label: "Health & Wellness", icon: "💪" },
  { id: "food", label: "Food & Beverages", icon: "🍕" },
  { id: "tech", label: "Technology", icon: "📱" },
  { id: "fashion", label: "Fashion & Beauty", icon: "👗" },
  { id: "fitness", label: "Fitness & Sports", icon: "🏃" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" }
];

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    instagramUsername: "",
    locationEnabled: false,
    notificationsEnabled: false,
    selectedInterests: [] as string[]
  });

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setLocation("/home");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInstagramConnect = () => {
    // Simulate Instagram connection
    setFormData(prev => ({ ...prev, instagramUsername: "@user123" }));
    setTimeout(handleNext, 1000);
  };

  const handleLocationEnable = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setFormData(prev => ({ ...prev, locationEnabled: true }));
          setTimeout(handleNext, 500);
        },
        () => {
          // Handle error - still proceed
          setFormData(prev => ({ ...prev, locationEnabled: false }));
          setTimeout(handleNext, 500);
        }
      );
    }
  };

  const handleNotificationEnable = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setFormData(prev => ({ 
          ...prev, 
          notificationsEnabled: permission === "granted" 
        }));
        setTimeout(handleNext, 500);
      });
    } else {
      setTimeout(handleNext, 500);
    }
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interestId)
        ? prev.selectedInterests.filter(id => id !== interestId)
        : [...prev.selectedInterests, interestId]
    }));
  };

  const currentStepData = onboardingSteps.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">EARLYSHH</span>
            </div>
            <div className="text-white/70 text-sm">
              {currentStep}/{onboardingSteps.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${(currentStep / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStepData?.title}
            </h2>
            <p className="text-white/80 text-sm">
              {currentStepData?.subtitle}
            </p>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStepData?.content === "instagram-connect" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <p className="text-white/80 text-sm text-center">
                  Connect your Instagram to discover partnerships and share your experiences
                </p>
                <Button
                  onClick={handleInstagramConnect}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 h-12"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  Connect Instagram
                </Button>
              </div>
            )}

            {currentStepData?.content === "location-permission" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <p className="text-white/80 text-sm text-center">
                  Enable location to find exclusive partnerships and deals near you
                </p>
                <Button
                  onClick={handleLocationEnable}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 h-12"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Enable Location
                </Button>
                <Button
                  onClick={handleNext}
                  variant="ghost"
                  className="w-full text-white/70 hover:text-white hover:bg-white/10"
                >
                  Skip for now
                </Button>
              </div>
            )}

            {currentStepData?.content === "notifications" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <p className="text-white/80 text-sm text-center">
                  Get notified about new deals, exclusive partnerships, and limited-time offers
                </p>
                <Button
                  onClick={handleNotificationEnable}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 h-12"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Enable Notifications
                </Button>
                <Button
                  onClick={handleNext}
                  variant="ghost"
                  className="w-full text-white/70 hover:text-white hover:bg-white/10"
                >
                  Skip for now
                </Button>
              </div>
            )}

            {currentStepData?.content === "interests" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-white/80 text-sm text-center">
                  Select your interests to get personalized partnership recommendations
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {interests.map(interest => (
                    <div
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.selectedInterests.includes(interest.id)
                          ? "bg-white/30 border-white/50"
                          : "bg-white/10 border-white/20"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{interest.icon}</div>
                        <div className="text-white text-xs font-medium">
                          {interest.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleNext}
                  disabled={formData.selectedInterests.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 h-12"
                >
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-white/60 text-xs">
              <Shield className="w-3 h-3" />
              <span>Your privacy is protected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}