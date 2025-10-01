import path from "path";
import dotenv from "dotenv";

import {exec} from "child_process";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const dashboardCommand = `npx parse-dashboard --dev --appId ${process.env.B4A_APPLICATION_ID} --masterKey ${process.env.B4A_MASTER_KEY} --serverURL "http://localhost:1337/parse"`;

exec(dashboardCommand, (error, stdout, stderr) => {
  if (error) return;
  if (stderr) return;
  console.log(`stdout: ${stdout}`);
});
