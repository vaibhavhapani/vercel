import { exec, spawn } from "child_process";
import path from "path";
import fs from "fs";
import { S3 } from "aws-sdk";
require('dotenv').config();

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.ENDPOINT,
});

export function buildProject(id: string) {
  return new Promise((resolve) => {
    const child = exec(
      `cd ${path.join(
        __dirname,
        `output\\${id}`
      )} && npm install && npm run build`
    );

    child.stdout?.on("data", function (data) {
      console.log("stdout: " + data);
    });

    child.stderr?.on("data", function (data) {
      console.log("stderr: " + data);
    });

    child.on("close", function (code) {
      resolve("");
    });
  });
}
