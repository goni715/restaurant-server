

export const UserRole = {
    user: 'user',
    owner: 'owner',
    super_admin: 'super_admin',
    administrator: "administrator"
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