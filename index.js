import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const candidatePaths = [
  path.join(__dirname, "artifacts/dmimo/dist"),
  path.join(__dirname, "artifacts/dmimo/dist/public"),
  path.join(__dirname, "dist"),
  path.join(__dirname, "public"),
  __dirname,
];

let staticDir = candidatePaths.find((p) => fs.existsSync(path.join(p, "index.html"))) || candidatePaths[0];

app.use(express.static(staticDir));

app.get("*", (req, res) => {
  const indexPath = path.join(staticDir, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send("DMIMO Web App Ready");
  }
});

const PORT = process.env.PORT || 3000;
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
