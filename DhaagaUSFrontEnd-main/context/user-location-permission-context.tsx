import { createContext, useEffect, useState } from "react";

import { UserLocationPermissionContextObject } from "@/Models/UserLocationPermissionContextObject";

export const UserLocationPermissionContext =
  createContext<UserLocationPermissionContextObject>({
    firstTimeExecuted: false,
    hasUserGrantedPermission: false,
    isLoading: true,
    shouldResultOnchangeExecute: true,
    result: undefined,
    setFirstTimeExecuted: () => {},
    handlePermissions: () => {},
    setHasUserGrantedPermission: () => {},
  });

const UserLocationPermissionProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [firstTimeExecuted, setFirstTimeExecuted] = useState(false);
  const [hasUserGrantedPermission, setHasUserGrantedPermission] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldResultOnchangeExecute, setShouldResultOnchangeExecute] =
    useState(true);
  const [result, setResult] = useState<PermissionStatus | undefined>(undefined);

  useEffect(() => {
    handlePermissions();
    // setFirstTimeExecuted(true);
  }, []);

  useEffect(() => {
    if (result) {
      result.onchange = () => {
        if (result.state === "granted") {
          if (shouldResultOnchangeExecute) {
            setHasUserGrantedPermission(true);
            setIsLoading(false);
            setShouldResultOnchangeExecute(false);
          }
        } else if (result.state === "denied") {
          if (shouldResultOnchangeExecute) {
            setIsLoading(false);
            setShouldResultOnchangeExecute(false);
          }
        } else if (result.state === "prompt") {
        }
      };
    }
  }, [result, shouldResultOnchangeExecute]);

  const handlePermissions = async () => {
    const result = await navigator.permissions.query({
      name: "geolocation",
    });
    setResult(result);
    if (result.state === "granted") {
      setHasUserGrantedPermission(true);
      setIsLoading(false);
      setShouldResultOnchangeExecute(false);
    } else if (result.state === "denied") {
      setIsLoading(false);
      setShouldResultOnchangeExecute(false);
    } else if (result.state === "prompt") {
      setIsLoading(false);
    }
  };

  const setFirstTimeExecutedHandler = () => {
    setFirstTimeExecuted(false);
  };

  const setHasUserGrantedPermissionHandler = () => {
    setHasUserGrantedPermission(false);
  };

  const contextValue = {
    firstTimeExecuted,
    hasUserGrantedPermission,
    isLoading,
    shouldResultOnchangeExecute,
    result,
    setFirstTimeExecuted: setFirstTimeExecutedHandler,
    handlePermissions,
    setHasUserGrantedPermission: setHasUserGrantedPermissionHandler,
  };
  return (
    <UserLocationPermissionContext.Provider value={contextValue}>
      {children}
    </UserLocationPermissionContext.Provider>
  );
};

export default UserLocationPermissionProvider;
