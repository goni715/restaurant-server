

export const UserRole = {
    user: 'user',
    admin: 'admin',
    super_admin: 'super_admin'
} as const;


export const UserSearchFields = [
    "fullName",
    "email",
    "phone"
]


export const UserValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "status",
  "gender"
];