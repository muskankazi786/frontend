export interface FavContextObject {
  isFavoriteProduct: boolean | null;
  show: boolean;
  requestResponse: { success?: string; error?: string } | null;
  hideToast: () => void;
  addAsFavorite: (prodId: string) => void;
  removeAsFavorite: (prodId: string, fromProductPage: boolean) => void;
  setIsFavorite: () => void;
}
