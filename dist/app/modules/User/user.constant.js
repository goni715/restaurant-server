"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidFields = exports.UserSearchFields = exports.UserRole = void 0;
exports.UserRole = {
    user: 'user',
    admin: 'admin',
};
exports.UserSearchFields = [
    "fullName",
    "email",
    "country",
    "university",
    "profession"
];
exports.UserValidFields = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "country",
    "university",
    "profession",
];
