export interface AddressData {
  address?: string;
  location: { lat: number; lng: number };
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  fullAddress?: string;
}
