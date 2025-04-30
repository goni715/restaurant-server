

export interface IOwner {
  name: string;
  description?: string;
};

export type TOwnerQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
