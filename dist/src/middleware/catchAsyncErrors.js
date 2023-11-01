"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castAsynError = void 0;
const castAsynError = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
exports.castAsynError = castAsynError;
