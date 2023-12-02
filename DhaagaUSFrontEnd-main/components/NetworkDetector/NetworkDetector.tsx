import { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { ErrorBoundary } from "react-error-boundary";

import ErrorPage from "../ErrorPage/ErrorPage";
import ErrorComponent from "../ErrorPage/ErrorComponent";
import useNavigatorOnLine from "@/hooks/useNavigatorOnline";

export default function (ComposedComponent: any) {
  const NetworkDetector = (props: AppProps) => {
    const status = useNavigatorOnLine();

    const pageProps = { isOnline: status, ...props.pageProps };
    const customProps = { ...props, pageProps };

    return (
      <ErrorBoundary FallbackComponent={ErrorComponent}>
        <ComposedComponent {...customProps} />
      </ErrorBoundary>
    );
  };

  return NetworkDetector;
}
