

export interface ICuisine {
    name: string;
    image: string;
    slug: string;
}

export type TCuisineQuery = {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    cuisineId?:string
};