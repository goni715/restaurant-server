

export const UserRole = {
    user: 'user',
    admin: 'admin',
    super_admin: 'super_admin'
} as const;


export const UserSearchFields = [
    "fullName",
    "email",
    "country",
    "university",
    "profession"
]


export const UserValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "country",
  "university",
  "profession",
];