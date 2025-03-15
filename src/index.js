const express = require("express");
const chalk = require("chalk");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const gameRouter = require("./router/game.router");
const contextPath = "/rest/api";

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/home.html"));
});

app.use(cors());
app.use(contextPath, gameRouter);
app.use(helmet());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(chalk.blue.bold(`Server is running on  ${PORT}`)));
