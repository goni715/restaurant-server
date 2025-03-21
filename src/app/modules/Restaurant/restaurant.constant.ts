

export const RestaurantSearchFields = [
    "name",
    "cuisine.name",
    "location",
    //"keywords", //this is array fields
    "owner.fullName",
    "owner.email",
    "owner.phone"
]


export const UserRestaurantSearchFields = [
  "name",
  "cuisine.name",
  "location",
  //"keywords", //this is array fields
]

export const RestaurantValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "cuisine.name",
  "ratings",
  "status",
  "approved"
];


export const UserRestaurantValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "cuisine.name",
  "ratings"
];