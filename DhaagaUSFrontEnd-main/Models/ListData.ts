import { ObjectId } from "mongodb";
import { BusinessHoursObject } from "./BusinessHoursObject";

export interface GoogleReviews extends ListData {
  ["Review 1"]?: string;
}

export interface ListData {
  [key: string]:
    | string
    | undefined
    | string[]
    | BusinessHoursObject
    | locations
    | ReviewObject[]
    | []
    | number;
  _id: string;
  type: string;
  full_address: string;
  description?: string;
  category: string;
  site: string;
  phone: string;
  name: string;
  rating?: string;
  reviews: number;
  photos: string[];
  business_hours: BusinessHoursObject;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  location: locations;
  Reviews: ReviewObject[] | [];
  distance?: number;
  dhaagaReviewCount?: number;
  reviewCount?: number;
  avgRating?: number;
  owner_id?: string;
}

export interface ProductDetail {
  product: ListData;
  isFavorite: boolean;
  hasReviewedProduct: boolean;
}

export interface BusinessDay {
  open: string;
  close: string;
}

export interface BusinessHours {
  [key: string]: BusinessDay[] | string;
}

interface locations {
  type: string;
  coordinates: number[];
}

export interface ReviewObject {
  _id: string;
  user_id: UserProfileObject | string;
  product_id: string;
  rating: number;
  reviewText: string;
  created_date: number;
}

export interface UserProfileObject {
  _id: string;
  email: string;
  phone?: string;
  joinAsBusiness: boolean;
  username?: string;
  profile_picture?: string;
}
