import { useEffect, useRef } from "react";

export function usePrevious(value: {
  lat: number;
  lng: number;
  zoomValue: number | undefined;
}) {
  const ref = useRef<{
    lat: number;
    lng: number;
    zoomValue: number | undefined;
  }>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
