import { createContext, useContext, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";

import { AuthContext } from "./auth-context";

import createQueryStringForFavoriteApi from "@/utils/createQueryStringForFavoriteApi";
import { FavContextObject } from "@/Models/FavContextObject";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";

export const FavoriteContext = createContext<FavContextObject>({
  isFavoriteProduct: null,
  show: false,
  requestResponse: null,
  hideToast: () => {},
  addAsFavorite: () => {},
  removeAsFavorite: () => {},
  setIsFavorite: () => {},
});

const FavoriteProvider: React.FC<{ children: any }> = ({ children }) => {
  const [show, setShow] = useState(false);
  const [isProductFavorite, setIsProductFavorite] = useState<boolean | null>(
    null
  );
  const [requestResponse, setRequestResponse] = useState<{
    success?: string;
    error?: string;
  } | null>(null);

  const { user } = useContext(AuthContext);

  const router = useRouter();
  const { showBoundary } = useErrorBoundary();

  const addAsFavHandler = async (prodId: string) => {
    setRequestResponse(null);
    setShow(true);
    const queryString = createQueryStringForFavoriteApi(prodId, "true");

    const res = await catchAsyncFetch(
      "/api/favorite" + "?" + queryString,
      showBoundary,
      {
        method: "POST",
      }
    );

    if (!res) {
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      setRequestResponse({ error: data.message });
      return;
    }

    setIsProductFavorite(data.isFavorite);
  };

  const removeAsFavHandler = async (
    prodId: string,
    fromProductPage: boolean
  ) => {
    setRequestResponse(null);
    setShow(true);
    const queryString = createQueryStringForFavoriteApi(prodId, "false");

    const res = await catchAsyncFetch(
      "/api/favorite/" + "?" + queryString,
      showBoundary,
      {
        method: "POST",
      }
    );

    if (!res) {
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      if (fromProductPage) {
        setRequestResponse({ error: data.message });
        return;
      } else {
        setRequestResponse({ error: data.message });
        return;
      }
    }
    if (fromProductPage) {
      setIsProductFavorite(data.isFavorite);
    } else {
      router.replace("/favorite");
    }
  };

  const favoriteProductChangeHandler = () => {
    setIsProductFavorite(null);
  };

  const hideToastHandler = () => {
    setShow(false);
  };

  const contextValue = {
    isFavoriteProduct: isProductFavorite,
    requestResponse,
    show,
    hideToast: hideToastHandler,
    addAsFavorite: addAsFavHandler,
    removeAsFavorite: removeAsFavHandler,
    setIsFavorite: favoriteProductChangeHandler,
  };

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteProvider;
