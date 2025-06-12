import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { ArrowLeft, ExternalLink, MapPin, Users, Star, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Campaign } from '../types';
import { useQuery } from '@tanstack/react-query';

export default function BrandAbout() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/brand/:id');
  const brandId = params?.id;

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const brand = campaigns.find(c => c.id === parseInt(brandId || '0'));

  // Brand bio data - in a real app this would come from an API
  const brandBioData = {
    1: {
      name: "SuperRoot Energy",
      description: "Superoot is a dry powder electrolyte mix with ingredients that studies show can boost immunity, hydrate, detox, enhance mental clarity, improve physical stamina, and support long-term vitality.",
      fullBio: "It blends a perfectly balanced 3-mineral electrolyte formula (potassium, magnesium, sodium) with the all-natural powder of 6 different roots—ginger, turmeric, beet, maca, carrot, and ginseng—and then a healthy helping of vitamin C to form a drink to support your immune system every day.",
      founded: "2020",
      location: "Los Angeles, CA",
      employees: "15-50",
      website: "https://superoot.com",
      socialFollowers: "125K",
      categories: ["Health & Wellness", "Supplements", "Natural Products"],
      keyIngredients: ["Ginger", "Turmeric", "Beet", "Maca", "Carrot", "Ginseng", "Vitamin C"],
      benefits: [
        "Boost immunity",
        "Enhanced hydration", 
        "Natural detox",
        "Mental clarity",
        "Physical stamina",
        "Long-term vitality"
      ]
    }
  };

  const getBrandBio = (brandId: number) => {
    return brandBioData[brandId as keyof typeof brandBioData] || {
      name: brand?.brandName || "Brand Name",
      description: "This brand creates amazing products and experiences for their community.",
      fullBio: "Learn more about this incredible brand and their mission to create positive impact through quality products and meaningful partnerships.",
      founded: "2020",
      location: "San Francisco, CA", 
      employees: "10-25",
      website: "#",
      socialFollowers: "50K",
      categories: ["Lifestyle", "Consumer Goods"],
      keyIngredients: ["Quality", "Innovation", "Community"],
      benefits: [
        "Premium quality",
        "Community focused",
        "Sustainable practices",
        "Customer satisfaction"
      ]
    };
  };

  const brandInfo = getBrandBio(parseInt(brandId || '1'));

  if (!brand) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Brand not found</h2>
          <Button onClick={() => setLocation('/')} variant="outline">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen earlyshh-bg">
      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setLocation('/')}
              variant="ghost"
              size="sm"
              className="text-white p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <img
                src={brand.brandLogoUrl}
                alt={brand.brandName}
                className="w-10 h-10 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${brand.brandName.charAt(0)}</text></svg>`;
                }}
              />
              <div>
                <h1 className="text-lg font-bold text-white">{brandInfo.name}</h1>
                <p className="text-sm text-gray-300">About Brand</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 space-y-6">
        
        {/* Brand Overview */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              What is {brandInfo.name}?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              {brandInfo.description}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {brandInfo.fullBio}
            </p>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Key Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {brandInfo.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-400/30"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <span className="text-white text-sm font-medium">{benefit}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Ingredients */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Key Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {brandInfo.keyIngredients.map((ingredient, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Info */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Brand Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-gray-400 text-sm">Founded</p>
                <p className="text-white font-medium">{brandInfo.founded}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 text-sm">Team Size</p>
                <p className="text-white font-medium">{brandInfo.employees}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-white font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {brandInfo.location}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 text-sm">Social Following</p>
                <p className="text-white font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {brandInfo.socialFollowers}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Categories</p>
              <div className="flex flex-wrap gap-2">
                {brandInfo.categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => window.open(brandInfo.website, '_blank')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Website
          </Button>
          
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            View Available Offers
          </Button>
        </div>
      </main>
    </div>
  );
}