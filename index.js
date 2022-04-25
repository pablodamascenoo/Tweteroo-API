import express from "express";
import cors from "cors";
import chalk from "chalk";

let users = [];
let tweets = [];

const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log(chalk.bold.cyan("\nRunning server...\n"));
});

app.post("/sign-up", (req, res) => {
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

  let sliceStart = 10 * (page - 1);
  let sliceEnd = sliceStart + 10;

  if (tweets.length >= 10) {
    if (sliceEnd > tweets.length) {
      if (sliceStart < tweets.length) {
        sliceEnd = tweets.length;
      } else {
        sliceEnd = 0;
        sliceStart = 0;
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

app.post("/tweets", (req, res) => {
  const { tweet } = req.body;
  const username = req.headers.user;

  if (username === "" || tweet === "") {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  let findUser = users.find((user) =>
    user.username === username ? true : false
  );

  tweets.unshift({
    username,
    tweet,
    avatar: findUser.avatar,
  });

  res.status(201).send(tweets);
});
