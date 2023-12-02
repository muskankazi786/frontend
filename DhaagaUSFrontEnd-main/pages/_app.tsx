// import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/stars.css";
import "../styles/custom-stars.css";

import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { SSRProvider } from "react-bootstrap";

import FavoriteProvider from "@/context/favorite-context";
import EditUserInfoProvider from "@/context/edit-user-context";
import ProductDistanceProvider from "@/context/product-distance-context";
import UserLocationPermissionProvider from "@/context/user-location-permission-context";
import MapJsApiLoaderProvider from "@/context/map-js-api-loader";
import NetworkDetector from "@/components/NetworkDetector/NetworkDetector";
import { AuthProvider } from "react-oidc-context";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const oidcConfig = {
    authority: process.env.OIDC_AUTHORITY ?? 'https://localhost:44392/',
    client_id: process.env.OIDC_CLIENT_ID ?? 'dhaaga_fe',
    redirect_uri: process.env.OIDC_REDIRECT_URI ?? 'http://localhost:3000',
    response_type: "code",
    scopes: "openid dhaaga_api"
  };

  const { isOnline } = pageProps;

  useEffect(() => {
    if (!isOnline) {
      throw new Error("Lost Connection!");
    }
  }, [isOnline]);

  useEffect(() => {
    const handleRouteChangeError = (err: any, url: string) => {
      if (err.cancelled) {
        console.log(`Route to ${url} was cancelled!`);
      }

      console.log(err);
    };

    const handleRouteChange = (
      url: string,
      { shallow }: { shallow: boolean }
    ) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? "with" : "without"
        } shallow routing`
      );
    };

    router.events.on("routeChangeStart", handleRouteChange);

    router.events.on("routeChangeError", handleRouteChangeError);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router]);

  return (
    <SSRProvider>
      <AuthProvider {...oidcConfig}>
        <MapJsApiLoaderProvider>
          <UserLocationPermissionProvider>
            <ProductDistanceProvider>
              <FavoriteProvider>
                <EditUserInfoProvider>
                  <Component {...pageProps} />
                </EditUserInfoProvider>
              </FavoriteProvider>
            </ProductDistanceProvider>
          </UserLocationPermissionProvider>
        </MapJsApiLoaderProvider>
      </AuthProvider>
    </SSRProvider>
  );
};

export default NetworkDetector(App);
