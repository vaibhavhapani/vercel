"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllFiles = (folderPath) => {
    let response = [];
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        // Skip hidden files
        if (file.startsWith(".")) {
            return;
        }
        const fullFilePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat((0, exports.getAllFiles)(fullFilePath)); // multiple results from all the recursive calls so concat...
        }
        else {
            response.push(fullFilePath); // only one response so just push
        }
    });
    return response;
};
exports.getAllFiles = getAllFiles;
