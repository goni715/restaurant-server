"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRestaurantValidFields = exports.RestaurantValidFields = exports.UserRestaurantSearchFields = exports.RestaurantSearchFields = void 0;
exports.RestaurantSearchFields = [
    "name",
    "cuisine.name",
    "location",
    //"keywords", //this is array fields
    "owner.fullName",
    "owner.email",
    "owner.phone"
];
exports.UserRestaurantSearchFields = [
    "name",
    "cuisine.name",
    "location",
    //"keywords", //this is array fields
];
exports.RestaurantValidFields = [
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
exports.UserRestaurantValidFields = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "cuisine.name",
    "ratings"
];
