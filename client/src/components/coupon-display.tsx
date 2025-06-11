
import { QRCodeSVG } from 'qrcode.react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Share2 } from 'lucide-react';

interface CouponDisplayProps {
  coupon: {
    id: string;
    code: string;
    qrData: string;
    fetchCode: string;
    productName: string;
    brandName: string;
    brandLogo?: string;
    redeemableAmount: string;
    expirationDate: string;
    legalDisclaimer: string;
    dateFetched: string;
    offerDescription?: string;
  };
  onShare?: () => void;
  onShowTerms?: () => void;
}

export default function CouponDisplay({ coupon, onShare, onShowTerms }: CouponDisplayProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Co-Branding Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {coupon.brandLogo && (
            <img 
              src={coupon.brandLogo} 
              alt={`${coupon.brandName} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{coupon.brandName}</h2>
            <p className="text-sm text-gray-400">× EARLYSHH</p>
          </div>
        </div>
        <img 
          src="/earlyshh-logo-small.png" 
          alt="Earlyshh" 
          className="w-8 h-8"
        />
      </div>

      {/* Product Information */}
      <Card className="glass-morphism p-6 border-0">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {coupon.productName}
            </h3>
            <p className="text-gray-300 text-sm">{coupon.offerDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Redeemable up to</p>
              <p className="text-white font-semibold">{coupon.redeemableAmount}</p>
            </div>
            <div>
              <p className="text-gray-400">Expires</p>
              <p className="text-white font-semibold">{formatDate(coupon.expirationDate)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* QR Code Section */}
      <Card className="glass-morphism p-8 border-0 text-center">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl inline-block">
            <QRCodeSVG 
              value={coupon.qrData}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Fetch Code</p>
            <p className="text-white font-mono text-lg tracking-wider">
              {coupon.fetchCode}
            </p>
          </div>
          
          <p className="text-xs text-gray-500">
            Code fetched: {formatDate(coupon.dateFetched)}
          </p>
        </div>
      </Card>

      {/* Legal Disclaimer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{coupon.legalDisclaimer}</span>
        {onShowTerms && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onShowTerms}
            className="text-cyan-400 hover:text-cyan-300 p-0 h-auto"
          >
            See details <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>

      {/* Action Buttons */}
      {onShare && (
        <Button 
          onClick={onShare}
          className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Experience
        </Button>
      )}
    </div>
  );
}
