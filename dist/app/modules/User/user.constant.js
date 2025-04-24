"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidFields = exports.UserSearchFields = exports.UserRole = void 0;
exports.UserRole = {
    user: 'user',
    owner: 'owner',
    super_admin: 'super_admin',
    administrator: "administrator"
};
exports.UserSearchFields = [
    "fullName",
    "email",
    "phone"
];
exports.UserValidFields = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
    "gender"
];
