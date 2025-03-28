export const AdministratorSearchFields = [
  "name",
  "email",
  "phone"
]


export const VALID_ACCESS_VALUES = [
  "dashboard",
  "userManagement",
  "restaurantManagement",
  "settings",
] as const;


export const AdministratorValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
];