"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message = "Invalid request", status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}
exports.ApiError = ApiError;
