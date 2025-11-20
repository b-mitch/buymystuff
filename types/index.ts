// Database Models
export interface User {
  id: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  inventory: number;
}

export interface CartItem {
  id: string;
  user_id?: string;
  product_id: string;
  amount: number;
}

export interface Order {
  id: string;
  date: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface ProductOrder {
  order_id: string;
  product_id: string;
  amount: number;
  price: string;
}

// Request/Response DTOs
export interface RegisterRequest {
  username: string;
  password: string;
  first: string;
  last: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  error: boolean;
  token?: string;
  message: string;
}

export interface UpdateDetailsRequest {
  first?: string;
  last?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface CheckoutRequest {
  first: string;
  last: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  idArray?: string[];
}

export interface CreateProductRequest {
  name: string;
  category: string;
  price: string;
  inventory: number;
}

// JWT Payload
export interface JWTPayload {
  username: string;
}

// Session Data
export interface SessionData {
  authenticated: boolean;
  user: {
    id: string;
    username: string;
    password: string;
  };
}

// Request body types
export interface UpdateAccountDetailsRequest {
  first?: string;
  last?: string;
  email?: string;
  username?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  password: string;
}

export interface UpdateCartItemRequest {
  amount: number;
}

export interface AddToCartRequest {
  amount: number;
}
