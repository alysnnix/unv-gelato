import express from "express";
import {ParseServer} from "parse-server";

import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const server = new ParseServer({
  cloud: "./cloud/main.js",
  fileKey: "optionalFileKey",
  appId: process.env.B4A_APPLICATION_ID,
  masterKey: process.env.B4A_MASTER_KEY,
  serverURL: "http://localhost:1337/parse",
  databaseURI: `mongodb://localhost:${process.env.MONGODB_PORT}/parse`,
});

const main = async () => {
  await server.start();
};

main();

app.use("/parse", server.app);

app.listen(1337, function () {
  console.log("parse-server-example running on port 1337.");
});
