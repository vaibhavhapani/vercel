import express from "express";
import { S3 } from "aws-sdk";
require('dotenv').config();

const app = express();

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.ENDPOINT,
});

app.get("/*", async (req, res) => {
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
    } else {
      newKey += key[i];
    }
  }

  console.log(newKey);

  const contents = await s3
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
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
