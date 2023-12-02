export const catchAsyncFetch = async (
  url: string,
  showBoundary: (error: any) => void,
  requestConfig?: RequestInit
) => {
  try {
    const isOnline =
      typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
        ? navigator.onLine
        : true;
    if (!isOnline) {
      return undefined;
    }
    const response = await fetch(url, requestConfig);
    return response;
  } catch (error: any) {
    showBoundary(error);
  }
};
