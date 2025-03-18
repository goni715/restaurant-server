import { Types } from 'mongoose';

export interface INotification {
  userId: Types.ObjectId; 
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead?: boolean; 
}


export type TNotificationQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};