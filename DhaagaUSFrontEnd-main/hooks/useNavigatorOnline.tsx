import { useEffect, useState } from "react";

const getOnLineStatus = () =>
  typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
    ? navigator.onLine
    : true;

const useNavigatorOnLine = () => {
  const [status, setStatus] = useState(getOnLineStatus());

  const handleConnectionChange = () => {
    const isOnline =
      typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
        ? navigator.onLine
        : true;

    if (isOnline) {
      const webPing = setInterval(async () => {
        try {
          await fetch("https://www.google.com/", { mode: "no-cors" });
          setStatus(true);
          clearInterval(webPing);
        } catch (error) {
          setStatus(false);
        }
      }, 2000);
    } else {
      setStatus(false);
    }
  };

  useEffect(() => {
    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  return status;
};

export default useNavigatorOnLine;
