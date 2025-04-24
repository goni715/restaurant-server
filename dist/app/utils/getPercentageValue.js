"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPercentageValue = (value, percent) => {
    const result = Math.round((percent / 100) * value);
    return result;
};
exports.default = getPercentageValue;
