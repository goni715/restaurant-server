"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = (err === null || err === void 0 ? void 0 : err.message) || 'Something Weng Wrong';
    res.status(statusCode).json({
        success: false,
        message,
        error: err
    });
};
exports.default = globalErrorHandler;
