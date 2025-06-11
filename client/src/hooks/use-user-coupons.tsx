
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponService } from '../services/coupon-service';
import { useAuth } from '../lib/auth';
import { useToast } from './use-toast';

export function useUserCoupons() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['coupons', 'user', user?.id],
    queryFn: () => couponService.getUserCoupons(),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCoupon(id: number) {
  return useQuery({
    queryKey: ['coupon', id],
    queryFn: () => couponService.getCoupon(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRedeemCoupon() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ couponId, redemptionData }: { couponId: number; redemptionData: any }) =>
      couponService.redeemCoupon(couponId, redemptionData),
    onSuccess: () => {
      toast({
        title: "Coupon Redeemed!",
        description: "Your partnership benefit has been successfully redeemed.",
      });
      queryClient.invalidateQueries({ queryKey: ['coupons', 'user', user?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Unable to redeem coupon. Please try again.",
        variant: "destructive",
      });
    },
  });
}
