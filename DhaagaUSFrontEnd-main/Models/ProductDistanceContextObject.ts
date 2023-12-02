import { ListData } from "./ListData";

export interface ProductDistanceContextObject {
  currentLocation: {
    lat: number;
    lng: number;
  };
  processedData: ListData[] | [];
  getProductDistance: (data: ListData[]) => void;
  setProcessedData: (data?: ListData[]) => void;
}
