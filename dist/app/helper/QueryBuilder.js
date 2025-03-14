"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFilterQuery = exports.makeSearchQuery = void 0;
const makeSearchQuery = (searchTerm, SearchFields) => {
    // const searchQuery = {
    //   $or: [
    //     { name: { $regex: searchTerm, $options: "i" } }, // Case-insensitive name search
    //   ],
    // };
    const searchQuery = {
        $or: SearchFields.map((item) => ({
            [item]: { $regex: searchTerm, $options: "i" },
        })),
    };
    return searchQuery;
};
exports.makeSearchQuery = makeSearchQuery;
const makeFilterQuery = (filters) => {
    let filterQuery = {};
    Object.keys(filters).forEach((key) => {
        let value = filters[key];
        if (value === "true") {
            filterQuery[key] = true;
        }
        else if (value === "false") {
            filterQuery[key] = false;
        }
        // Convert numeric strings to actual numbers
        else if (!isNaN(Number(value))) {
            filterQuery[key] = Number(value);
        }
        // Keep it as a string if none of the above conditions match
        else {
            filterQuery[key] = value;
        }
    });
    return filterQuery;
};
exports.makeFilterQuery = makeFilterQuery;
