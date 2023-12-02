export interface SubscriptionObject {
  _id: string;
  user_id: string;
  subscription_id: string;
  product_id: string;
  price_id: string;
  status: string;
  starts_at: number;
  expires_at: number;
  last_payment_error?: string;
}
