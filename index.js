import express from "express";
import cors from "cors";
import chalk from "chalk";
import bodyParser from "body-parser";

let users = [];
let tweets = [];

const app = express();
app.use(cors());

let jsonParser = bodyParser.json();

app.listen(5000, () => {
  console.log(chalk.bold.cyan("\nRunning server...\n"));
});

app.post("/sign-up", jsonParser, (req, res) => {
  const { username, avatar } = req.body;

  users.push({ username, avatar });
  console.log(users);
  res.send("OK");
});

app.get("/tweets", (req, res) => {
  res.send(tweets);
});

app.post("/tweets", jsonParser, (req, res) => {
  const { username, tweet } = req.body;

  let findUser = users.find((user) =>
    user.username === username ? true : false
  );

  tweets.push({
    username,
    tweet,
    avatar: findUser.avatar,
  });

  res.send(tweets);
});
