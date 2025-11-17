import type { CartItemDTO } from "../types/types";
import api from "./api";

export const addToCartApi = async (data: CartItemDTO) => {
  const response = await api.post("/products/cart", data);
  return response.data.data;
};
export const getCartQuantityApi = async (
  guestToken: string | null
): Promise<{ quantity: number }> => {
  const response = await api.get("/products/cart/quantity", {
    params: {
      guestToken: guestToken || null,
    },
  });
  return response.data.data;
};
export const getUserCartApi = async (
  guestToken: string | null
) => {
  const response = await api.get("/products/cart", {
    params: {
      guestToken: guestToken || null,
    },
  });
  return response.data.data;
};
export const deleteCartItemApi = async (cartItemId: number) => {
  const response = await api.delete(`/products/cart/${cartItemId}`);
  return response.data.data;
};
export const deleteAllCartItemsApi = async (guestToken: string | null) => {
  const response = await api.delete(`/products/cart?guestToken=${guestToken}`);
  return response.data.data;
};
