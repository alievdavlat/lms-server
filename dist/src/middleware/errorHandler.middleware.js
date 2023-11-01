"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errohandle = void 0;
const ErrorHandler_1 = require("../utils/ErrorHandler");
const errohandle = (err, req, res, next) => {
    err.status = err.status || 500;
    err.message = err.message || "Internal server error";
    if (err.name === "CastError") {
        const message = `Resourses not found . Invalid ${err.path}`;
        err = new ErrorHandler_1.ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler_1.ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web token is invalid, try again`;
        err = new ErrorHandler_1.ErrorHandler(message, 400);
    }
    if (err.name === 'TokenExpiredError') {
        const message = `Json web token is expired. try again`;
        err = new ErrorHandler_1.ErrorHandler(message, 400);
    }
    res.status(err.status).json({
        status: err.status,
        success: false,
        message: err.message
    });
};
exports.errohandle = errohandle;
