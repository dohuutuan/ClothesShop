export interface LoginData {
  account: string;
  password: string;
}
export interface LoginProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: () => void;
  setOpenForgotPasswordModal: (value: boolean) => void;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};
export type RegisterData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};
export type Profile = {
  phone: string;
  fullname: string;
  email: string;
  role: string;
};
export type ForgotPassInput = {
  password: string;
  confirmPassword: string;
};
export type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
};
export interface ProductCardDTO {
  productId: number;
  name: string;
  price: number;
  rating: RatingDTO;
  colors: ColorDTO[];
}

export interface RatingDTO {
  average: number;
  count: number;
}

export interface ColorDTO {
  id: number;
  name: string;
  thumbnailUrl: string;
  images: string[];
  sizes: SizeDTO[];
}

export interface SizeDTO {
  id: number;
  name: string;
  stock: number;
  variantId: number;
  description: string; // add new
}
export interface CartItemDTO {
  guestToken: string | null;
  variantId: number;
  quantity: number;
}
export type HeaderProps = {
  headerRef: React.RefObject<HTMLDivElement>;
};
export type ProductDescription = {
  introduction: string;
  technology: string;
  material: string;
  style: string;
  suitableFor: string;
  feature: string;
};
export type FeedbackPagedResponseDTO = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  averageRating: number;
  ratingCount: number;
  feedbacks: FeedbackDTO[];
};
export type FeedbackDTO = {
  userName: string;
  createdAt: string; // ISO date string
  rating: number;
  comment: string;
};
export interface UserCartResponse {
  cardId: number;
  cartItemId: number;
  variantId: number;
  productName: string;
  colors: ColorCart[];
  image: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface ColorCart {
  id: number;
  name: string;
  sizes: SizeCart[];
}

export interface SizeCart {
  id: number;
  name: string;
  variantId: number;
  stock: number;
}

export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  createdAt: string;
};