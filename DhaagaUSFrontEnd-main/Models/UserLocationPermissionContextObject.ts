export interface UserLocationPermissionContextObject {
  firstTimeExecuted: boolean;
  hasUserGrantedPermission: boolean;
  isLoading: boolean;
  shouldResultOnchangeExecute: boolean;
  result: PermissionStatus | undefined;
  setFirstTimeExecuted: () => void;
  handlePermissions: () => void;
  setHasUserGrantedPermission: () => void;
}
