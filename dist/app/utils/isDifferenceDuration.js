"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDifferenceDuration(startDateTimeLimit, endDateTimeLimit, duration) {
    const start = new Date(startDateTimeLimit).getTime();
    const end = new Date(endDateTimeLimit).getTime();
    const diffInMinutes = Math.abs(end - start) / (1000 * 60);
    return diffInMinutes >= duration;
}
exports.default = isDifferenceDuration;
