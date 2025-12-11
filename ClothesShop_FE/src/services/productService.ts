import type { ProductCardDTO, ProductDescription } from "../types/types";
import api from "./api";
export const getSubCategoriesApi = async () => {
  const response = await api.get("/products/sub-categories");
  return response.data.data;
};

export const getBestSellingProductsApi = async (quantity: number) => {
  const response = await api.get("/products/best-seller", {
    params: {
      quantity: quantity,
    },
  });
  return response.data.data;
};

export const getLatestProductsApi = async (quantity: number) => {
  const response = await api.get("/products/latest-products", {
    params: {
      quantity: quantity,
    },
  });
  return response.data.data;
};
export const getProductDetailApi = async (
  productId: number
): Promise<ProductCardDTO> => {
  const response = await api.get(`/products/${productId}`);
  return response.data.data;
};
export const getProductDescriptionApi = async (
  productId: number
): Promise<ProductDescription> => {
  const response = await api.get(`/products/description/${productId}`);
  return response.data.data;
};
export const getProductFeedbackApi = async (
  productId: number | undefined,
  page: number,
  pageSize: number,
  starFilter: number | null,
  sortOption: string | null
) => {
  const response = await api.get(`/products/feedback`, {
    params: {
      productId: productId,
      page: page,
      limit: pageSize,
      starRating: starFilter,
      sort: sortOption,
    },
  });
  return response.data.data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const orderApi = async (data: any) => {
  const response = await api.post("/products/order", data);
  return response.data.data;
};
export const searchProductsApi = async (
  keyword: string,
  pageNumer: number,
  pageSize: number
) => {
  const response = await api.get("/products/search", {
    params: { keyword: keyword, pageNumber: pageNumer, pageSize: pageSize },
  });
  return response.data.data;
};

export const getProductsByCategoryApi = async (
  categorySlug: string,
  pageNumber: number,
  pageSize: number,
  sort: string | null
) => {
  const response = await api.get(`/products/by-category`, {
    params: {
      slug: categorySlug,
      pageNumber: pageNumber,
      pageSize: pageSize,
      sort: sort,
    },
  });
  return response.data.data;
};
