class FileListObject {
  file: File;
  id: string;
  constructor(imageFile: File) {
    this.file = imageFile;
    this.id = imageFile.name + "_" + (Math.random() + 1).toString();
  }
}

export class ImageUrlsObject {
  url: string;
  id: string;
  constructor(imageUrl: string, id: string) {
    this.url = imageUrl;
    this.id = id;
  }
}

export default FileListObject;
