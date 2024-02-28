import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `./output/${id}`));

    const files = getAllFiles(path.join(__dirname, `./output/${id}`));
    
    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file); // slice removes n initial charcters from the string, n = provided length
    })

    await new Promise((resolve) => setTimeout(resolve, 5000));

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded"); // like INSERT in SQL, .create in MongoDB

    res.json({
        id: id
    });
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});