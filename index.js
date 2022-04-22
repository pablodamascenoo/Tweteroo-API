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

  if (username !== "" && avatar !== "") {
    users.push({ username, avatar });
    res.status(201).send("OK");
  } else {
    res.status(400).send("Todos os campos são obrigatórios!");
  }
});

app.get("/tweets", (req, res) => {
  const { page } = req.query;

  let sliceEnd = tweets.length - 10 * (page - 1);
  let sliceStart = sliceEnd - 10;

  if (tweets.length >= 10) {
    if (sliceEnd < 10) {
      if (sliceEnd > 0) {
        sliceStart = 0;
      } else {
        sliceEnd = tweets.length - 10 * (page - 2);
        sliceStart = sliceEnd - 10;
      }
    }
  }

  let lastTenTweets =
    tweets.length >= 10 ? tweets.slice(sliceStart, sliceEnd) : tweets;

  res.send(lastTenTweets);
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;

  const filteredTweets = tweets.filter((tweet) =>
    tweet.username === username ? true : false
  );

  res.send(filteredTweets);
});

app.post("/tweets", jsonParser, (req, res) => {
  const { tweet } = req.body;
  const username = req.headers.user;

  if (username === "" || tweet === "") {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  let findUser = users.find((user) =>
    user.username === username ? true : false
  );

  tweets.push({
    username,
    tweet,
    avatar: findUser.avatar,
  });

  res.status(201).send(tweets);
});
