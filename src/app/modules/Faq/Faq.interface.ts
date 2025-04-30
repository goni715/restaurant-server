

export interface IFaq {
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
};

export type TFaqQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
