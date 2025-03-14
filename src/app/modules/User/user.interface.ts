

export interface IUser {
  fullName: string;
  email: string;
  phone: string;
  address?: string; //for admin
  gender: 'male' | 'female',
  password: string;
  role: "user" | "admin" | "super_admin";
  status: "blocked" | "unblocked";
  profileImg?: string
}


export type TUserQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
