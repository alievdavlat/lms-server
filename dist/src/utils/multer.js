"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), 'uploads'))
//   },
//   filename: function (req, file, cb) {
//     cb(null,Date.now() +  file.originalname)
//   }
// })
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.default = upload;
