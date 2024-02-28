import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        // Skip hidden files
        if (file.startsWith(".")) {
            return;
        }
        const fullFilePath = path.join(folderPath, file);
        if(fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath)); // multiple results from all the recursive calls so concat...
        } else {
            response.push(fullFilePath); // only one response so just push
        }
    });

    return response;
}