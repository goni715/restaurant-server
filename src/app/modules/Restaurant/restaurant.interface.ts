import { Types } from "mongoose";

export type TRestaurantStatus = "active" | "deactive";
export type TApprovedStatus = "pending" | "accepted" | "cancelled";

export interface IRestaurant {
    ownerId: Types.ObjectId;
    name: string;
    slug: string;
    keywords?: string[],
    features?: string[];
    ratings?: number;
    restaurantImg?: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    address: string;
    discount?: string;
    paymentRequired:boolean;
    bookingFeePerGuest?: number;
    cancellationPercentage?: number;
    status: TRestaurantStatus;
    approved: TApprovedStatus
}



export interface IRestaurantPayload {
  name: string;
  keywords?: string[];
  features?: string[];
  ratings?: number;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  longitude: number;
  latitude: number;
  address: string;
  discount?: string;
  cancellationPercentage?: number;
  paymentRequired: boolean;
  status: TRestaurantStatus;
  approved: TApprovedStatus;
}


export type TRestaurantQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  cuisine?: string;
  dining?:string;
  ratings?:number;
  status?: TRestaurantStatus
};

export type INearbyQuery = {
  longitude?: number;
  latitude?: number;
}


export type TUserRestaurantQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  cuisine?: string;
  price?: number;
  dining?:string;
  ratings?:number;
};


export type IChangeRestaurantStatus = {
  status: TRestaurantStatus;
}

export type IChangeApprovalStatus = "accepted" | "cancelled";