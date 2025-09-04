export interface GardenStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Report {
  redesignedImage: string;
  floorPlan: string; // This will now be a base64 data URL for the image
  floorPlanDescription: string;
  redesignAdvice: string[];
  styleName: string;
}

export interface RedesignPlan {
    floorPlan: string;
    redesignAdvice: string[];
}