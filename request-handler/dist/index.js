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
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
require('dotenv').config();
const app = (0, express_1.default)();
const s3 = new aws_sdk_1.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint: process.env.ENDPOINT,
});
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.hostname;
    console.log(host);
    const id = host.split(".")[0];
    console.log(id);
    const filePath = req.path;
    console.log(filePath);
    let key = `dist/${id}${filePath}`;
    let newKey = "";
    for (let i = 0; i < key.length; i++) {
        if (key[i] === "/") {
            newKey += "\\";
        }
        else {
            newKey += key[i];
        }
    }
    console.log(newKey);
    const contents = yield s3
        .getObject({
        Bucket: "vercel",
        Key: newKey,
    })
        .promise();
    const type = filePath.endsWith("html")
        ? "texts/html"
        : filePath.endsWith("css")
            ? "text/css"
            : "application/javascript";
    res.set("Content-type", type);
    res.send(contents.Body);
}));
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
