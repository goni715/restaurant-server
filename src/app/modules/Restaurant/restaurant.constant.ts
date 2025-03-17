

export const RestaurantSearchFields = [
    "name",
    "cuisine",
    "location",
    "dining",
    //"keywords", //this is array fields
    "owner.fullName",
    "owner.email",
    "owner.phone",
    "owner.address"
]


export const RestaurantValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "cuisine",
  "price",
  "dining",
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
  "cuisine",
  "price",
  "dining",
  "ratings"
];