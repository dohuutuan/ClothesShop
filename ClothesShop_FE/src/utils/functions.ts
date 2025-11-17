import type { UserCartResponse } from "../types/types";

export function formatMoney(value: number): string {
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}
export const generateGuestToken = () => {
  return crypto.randomUUID();
}; 

export function findColorAndSizeByVariantId(colors: UserCartResponse['colors'], variantId: number) {
    for (const color of colors) {
        for (const size of color.sizes) {
            if (size.variantId === variantId) {
                return {
                    colorId: color.id,
                    sizeId: size.id,
                    sizes: color.sizes
                };
            }
        }
    }
    return null;
}