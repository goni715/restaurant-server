


export interface IDining {
  name: string;
  slug: string;
}
0

export type TDiningQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};