import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, Star, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function SurveyPage() {
  const [, params] = useRoute('/survey/:couponId');
  const [, setLocation] = useLocation();
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Survey form state
  const [formData, setFormData] = useState({
    overallRating: 0,
    productQuality: 0,
    value: 0,
    packaging: 0,
    brandHelpfulness: 0,
    purchaseIntent: '',
    wouldRecommend: null as boolean | null,
    experience: '',
    improvements: ''
  });

  // Fetch coupon data for context
  const { data: coupon, isLoading } = useQuery({
    queryKey: ['/api/coupons', params?.couponId],
    enabled: !!params?.couponId,
  });

  // Mock coupon data
  const mockCoupon = {
    id: params?.couponId || '1',
    brandName: 'SuperRoot Energy',
    productName: 'SuperRoot Premium Energy Formula',
    campaignId: 1
  };

  const activeCoupon = coupon || mockCoupon;

  // Submit survey mutation
  const submitSurveyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // Hardcoded for MVP
          campaignId: activeCoupon.campaignId || 1,
          feedbackRequestId: 1, // Will be dynamic in production
          ...data
        }),
      });
      if (!response.ok) throw new Error('Failed to submit survey');
      return response.json();
    },
    onSuccess: () => {
      setSurveyCompleted(true);
      toast({
        title: "Survey Submitted!",
        description: "Thank you for your feedback! You can now access new campaigns.",
      });
      // Navigate back to home after 3 seconds
      setTimeout(() => {
        setLocation('/');
      }, 3000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit survey",
        variant: "destructive",
      });
    },
  });

  const handleStarClick = (field: string, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (formData.overallRating === 0 || formData.purchaseIntent === '' || formData.wouldRecommend === null) {
      toast({
        title: "Incomplete Survey",
        description: "Please complete all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    submitSurveyMutation.mutate(formData);
  };

  const StarRating = ({ value, onChange, label, required = false }: {
    value: number;
    onChange: (rating: number) => void;
    label: string;
    required?: boolean;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setLocation(`/instagram-story/${params?.couponId}`)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Product Survey</h1>
          <div className="w-10 h-10"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
          {!surveyCompleted ? (
            <>
              {/* Brand Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  How was your experience?
                </h2>
                <p className="text-gray-600">
                  Help us improve by sharing your thoughts about <strong>{activeCoupon.brandName}</strong>
                </p>
              </div>

              {/* Survey Form */}
              <div className="space-y-6">
                {/* Overall Rating */}
                <StarRating
                  value={formData.overallRating}
                  onChange={(rating) => handleStarClick('overallRating', rating)}
                  label="Overall Rating"
                  required
                />

                {/* Product Quality */}
                <StarRating
                  value={formData.productQuality}
                  onChange={(rating) => handleStarClick('productQuality', rating)}
                  label="Product Quality"
                />

                {/* Value for Money */}
                <StarRating
                  value={formData.value}
                  onChange={(rating) => handleStarClick('value', rating)}
                  label="Value for Money"
                />

                {/* Packaging */}
                <StarRating
                  value={formData.packaging}
                  onChange={(rating) => handleStarClick('packaging', rating)}
                  label="Packaging"
                />

                {/* Brand Helpfulness */}
                <StarRating
                  value={formData.brandHelpfulness}
                  onChange={(rating) => handleStarClick('brandHelpfulness', rating)}
                  label="Brand Customer Service"
                />

                {/* Purchase Intent */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purchase Intent <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.purchaseIntent}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseIntent: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="definitely">Definitely will buy</option>
                    <option value="probably">Probably will buy</option>
                    <option value="maybe">Might buy</option>
                    <option value="probably_not">Probably won't buy</option>
                    <option value="definitely_not">Definitely won't buy</option>
                  </select>
                </div>

                {/* Would Recommend */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Would you recommend this product to friends? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: true }))}
                      className={`flex-1 p-3 rounded-xl border-2 font-semibold transition-colors ${
                        formData.wouldRecommend === true
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:border-green-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: false }))}
                      className={`flex-1 p-3 rounded-xl border-2 font-semibold transition-colors ${
                        formData.wouldRecommend === false
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:border-red-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Describe your experience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Tell us about your experience with the product..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Improvements */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Suggestions for improvement
                  </label>
                  <textarea
                    value={formData.improvements}
                    onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
                    placeholder="How could this product be improved?"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={submitSurveyMutation.isPending}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:opacity-50"
                >
                  {submitSurveyMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Submit Survey</span>
                    </div>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Survey Complete!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for your valuable feedback about {activeCoupon.brandName}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
                <p className="text-green-800 font-semibold">🎉 New campaigns unlocked!</p>
                <p className="text-green-600 text-sm">You can now access new brand partnerships</p>
              </div>
              <p className="text-purple-600 font-semibold">
                Redirecting to home...
              </p>
            </div>
          )}
        </div>

        {/* Skip Option */}
        {!surveyCompleted && (
          <div className="text-center mt-6">
            <button
              onClick={() => setLocation('/')}
              className="text-white/80 hover:text-white underline"
            >
              Skip survey for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}