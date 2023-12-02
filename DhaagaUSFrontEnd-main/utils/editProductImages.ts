import FileListObject from "@/Models/FileListObject";
import { catchAsyncFetch } from "./catchAsyncFetch";

export const delteImagesFromTheCloud = (
  imagesToBeRemoved: string[],
  showBoundary: (error: any) => void
) => {
  const deleteImages = async (key: string) => {
    const res = await catchAsyncFetch(
      `/api/editUploadedProductImages?key=${key}`,
      showBoundary
    );

    if (!res) {
      throw new Error("Fetch failed!");
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error("Could not delete image!");
    }
    return data;
  };

  const deleteImagesPromiseArray = [];
  for (let i = 0; i < imagesToBeRemoved.length; i++) {
    const imageUrl = imagesToBeRemoved[i];
    const key = imageUrl.split(`${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/`)[1];
    deleteImagesPromiseArray.push(deleteImages(key));
  }
  return deleteImagesPromiseArray;
};

export const addImagesToTheCloud = (
  fileList: FileListObject[],
  showBoundary: (error: any) => void
) => {
  const fetchPreSignedUrlAndUploadImage = async (file: File) => {
    const fetchSignedUrlRes = await catchAsyncFetch(
      `/api/getSignedUploadImageUrl?file=${file.name}&type=${file.type}`,
      showBoundary
    );

    if (!fetchSignedUrlRes) {
      throw new Error("Fetch failed!");
    }

    const fetchSignedUrlResData = await fetchSignedUrlRes.json();

    if (!fetchSignedUrlRes.ok) {
      throw new Error(fetchSignedUrlResData.message);
    }
    const { url, fields } = fetchSignedUrlResData;

    const formDataForTheFile = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formDataForTheFile.append(key, value as string);
    });

    const uploadResponse = await catchAsyncFetch(url, showBoundary, {
      method: "POST",
      body: formDataForTheFile,
    });

    if (!uploadResponse) {
      throw new Error("Fetch failed!");
    }

    if (uploadResponse.ok) {
      return { key: fields.key };
    } else {
      throw new Error("Uploading image failed");
    }
  };

  const fetchSignedUrlPromiseArray = [];
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i].file;
    fetchSignedUrlPromiseArray.push(fetchPreSignedUrlAndUploadImage(file));
  }

  return fetchSignedUrlPromiseArray;
};
