import { createContext } from "react";

import { NavigatorOnlineContextObject } from "@/Models/NavigatorOnlineContextObject";

const getOnLineStatus = () =>
  typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
    ? navigator.onLine
    : true;

export const NavigatorOnlineContext =
  createContext<NavigatorOnlineContextObject>({
    isOnline: getOnLineStatus(),
  });
