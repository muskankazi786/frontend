import { useErrorBoundary } from "react-error-boundary";
import { createContext, useState } from "react";

import { EditUSerContextObject } from "@/Models/EditUserContextObject";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";

export const editUserContext = createContext<EditUSerContextObject>({
  updatedUserProfile: null,
  requestResponse: null,
  selectedImage: null,
  isLoading: false,
  isPhoneEditing: false,
  isUsernameEditing: false,
  show: true,
  setImage: () => {},
  showEditForm: () => {},
  hideEditForm: () => {},
  hideToast: () => {},
  sendEditRequest: () => {},
  setUserProfilePicture: () => {},
});

const EditUserInfoProvider: React.FC<{ children: any }> = ({ children }) => {
  const [updatedUserProfile, setUpdatedUserProfile] = useState<{
    user: any;
  } | null>(null);
  const [requestResponse, setRequestResponse] = useState<{
    success?: string;
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [show, setShow] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [userProfPicture, setUserProfPicture] = useState<null | string>(null);

  const { showBoundary } = useErrorBoundary();

  const setUserProfilePictureHandler = (proPic: string) => {
    setUserProfPicture(proPic);
  };

  const setImageHandler = (
    imageFile: any | undefined,
    identifier: boolean | undefined
  ) => {
    if (imageFile) {
      setSelectedImage(imageFile);
    }
    if (identifier === false) {
      setSelectedImage(null);
    }
  };

  const sendEditInfoRequest = async (
    username: string | undefined,
    phone: string | undefined
  ) => {
    const formData: {
      username?: string;
      profile_picture?: string;
      phone?: string;
    } = {};
    if (username) {
      formData["username"] = username;
    }
    if (phone) {
      formData["phone"] = phone;
    }
    setRequestResponse(null);
    setIsLoading(true);
    setShow(true);
    try {
      if (selectedImage) {
        const existingProfilePictureKey = userProfPicture?.split(
          `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/`
        )[1];
        const fetchSignedUrlRes = await catchAsyncFetch(
          `/api/editUserImage?file=${selectedImage.name}&type=${selectedImage.type}`,
          showBoundary,
          {
            method: "POST",
          }
        );

        if (!fetchSignedUrlRes) {
          return;
        }

        if (!fetchSignedUrlRes.ok) {
          throw new Error("Could not update the user");
        }
        const { url, fields } = await fetchSignedUrlRes.json();

        const formDataForTheFile = new FormData();

        Object.entries({ ...fields, file: selectedImage }).forEach(
          ([key, value]) => {
            formDataForTheFile.append(key, value as string);
          }
        );

        const uploadResponse = await catchAsyncFetch(url, showBoundary, {
          method: "POST",
          body: formDataForTheFile,
        });

        if (!uploadResponse) {
          return;
        }

        if (!uploadResponse.ok) {
          throw new Error("Could not update the user");
        }
        const key = fields.key;
        const newImageUrl = `https://s3.us-east-1.amazonaws.com/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${key}`;
        formData["profile_picture"] = newImageUrl;

        // Delete user image;
        if (userProfPicture) {
          const deleteUserImageRes = await catchAsyncFetch(
            `/api/editUserImage?key=${existingProfilePictureKey}`,
            showBoundary,
            { method: "DELETE" }
          );

          if (!deleteUserImageRes) {
            return;
          }

          if (!deleteUserImageRes.ok) {
            throw new Error("Could not update the user");
          }
        }
      }
      const res = await catchAsyncFetch("/api/editUser", showBoundary, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (!res) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Could not update the user");
      }
      setUpdatedUserProfile(data.user);
      setRequestResponse({ success: data.message });
      setIsLoading(false);
      setIsPhoneEditing(false);
      setIsUsernameEditing(false);
    } catch (error: any) {
      setRequestResponse({ error: error.message });
      setIsLoading(false);
      setIsPhoneEditing(false);
      setIsUsernameEditing(false);
    }
  };

  const showEditFormHnadler = (id: string) => {
    if (id === "phone") {
      setIsPhoneEditing(true);
      setIsUsernameEditing(false);
      setSelectedImage(null);
    }
    if (id === "username") {
      setIsUsernameEditing(true);
      setIsPhoneEditing(false);
    }
  };

  const hideEditFormHandler = (id: string) => {
    if (id === "phone") {
      setIsPhoneEditing(false);
    }
    if (id === "username") {
      setSelectedImage(null);
      setIsUsernameEditing(false);
    }
  };

  const hideToastHandler = () => {
    setShow(false);
  };

  const contextValue = {
    updatedUserProfile,
    requestResponse,
    selectedImage: selectedImage,
    isLoading,
    isPhoneEditing,
    isUsernameEditing,
    show,
    setImage: setImageHandler,
    showEditForm: showEditFormHnadler,
    hideEditForm: hideEditFormHandler,
    hideToast: hideToastHandler,
    sendEditRequest: sendEditInfoRequest,
    setUserProfilePicture: setUserProfilePictureHandler,
  };

  return (
    <editUserContext.Provider value={contextValue}>
      {children}
    </editUserContext.Provider>
  );
};

export default EditUserInfoProvider;
