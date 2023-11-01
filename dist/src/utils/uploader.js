"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloud = exports.removeFromCLoud = void 0;
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const dateTime_1 = require("./dateTime");
const firebase_config_1 = __importDefault(require("../config/firebase.config"));
(0, app_1.initializeApp)(firebase_config_1.default.firebaseConfig);
const storage = (0, storage_1.getStorage)();
const uploadToCloud = (file, dist) => __awaiter(void 0, void 0, void 0, function* () {
    const dateTime = (0, dateTime_1.giveCurrentDateTime)();
    const storageRef = (0, storage_1.ref)(storage, `${dist}/${file.originalname + "   " + dateTime}`);
    const metadata = {
        contentType: file.mimetype,
    };
    const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata);
    const downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
    return downloadURL;
});
exports.uploadToCloud = uploadToCloud;
const removeFromCLoud = (filename) => {
    const desertRef = (0, storage_1.ref)(storage, filename);
    (0, storage_1.deleteObject)(desertRef).then(() => {
    }).catch((error) => {
        console.log('somthingwent wrong try again', 400);
    });
    return 'removed';
};
exports.removeFromCLoud = removeFromCLoud;
