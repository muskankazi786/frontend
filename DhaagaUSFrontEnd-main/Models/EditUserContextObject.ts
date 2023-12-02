export interface EditUSerContextObject {
  updatedUserProfile: { user: any } | null;
  requestResponse: { success?: string; error?: string } | null;
  selectedImage: any | null;
  isLoading: boolean;
  isPhoneEditing: boolean;
  isUsernameEditing: boolean;
  show: boolean;
  setImage: (
    imageFile: any | undefined,
    identifier: boolean | undefined
  ) => void;
  showEditForm: (id: string) => void;
  hideEditForm: (id: string) => void;
  hideToast: () => void;
  sendEditRequest: (
    username: string | undefined,
    phone: string | undefined
  ) => void;
  setUserProfilePicture: (proPic: string) => void;
}
