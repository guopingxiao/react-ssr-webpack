const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8758;

const loginFile = path.join(__dirname, './isLogin.json');
const transitionFile = path.join(__dirname, './transition.json');


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  next();
});

app.get('/api/newsList', (req, res) => {
  let data = [
    {
      "id": 1,
      "title": "Europe, China join hands drawing maritime blueprint"
    },
    {
      "id": 2,
      "title": "In pics: Badaling red leaf scenic area in Beijing's Great Wall"
    },
    {
      "id": 3,
      "title": "Chinese tourists travel to 1,000 global destinations during National Day vacation"
    },
    {
      "id": 4,
      "title": "Hong Kong ensemble infuses ancient cave paintings with musical innovation"
    },
    {
      "id": 5,
      "title": "Aerial view of Beihai City in S China's Guangxi"
    },
    {
      "id": 6,
      "title": "First wild panda cub spotted at Dafengding Nature Reserve in SW China"
    }
  ];
  return res.json(data);
});

app.get('/api/isLogin', (req, res) => {
  let data = readFile(loginFile);
  res.json(data);
});

app.get('/api/login', (req, res) => {
  let isLogin = {
    success: true,
    data: {
      login: true,
    }
  };
  isLogin = JSON.stringify(isLogin);
  writeFile(loginFile, isLogin);
  res.json(JSON.parse(isLogin));
});

app.get('/api/logout', (req, res) => {
  let isLogin = {
    success: true,
    data: {
      login: false,
    }
  };
  isLogin = JSON.stringify(isLogin);
  writeFile(loginFile, isLogin);
  res.json(JSON.parse(isLogin));
});

app.get('/api/translationList', (req, res) => {
  let data = JSON.parse(JSON.stringify(readFile(loginFile)));
  let readData = data.data;
  if (readData.login) {
    let transitionInfo = readFile(transitionFile);
    res.json(transitionInfo);
  } else {
    res.json(data);
  }
});

function writeFile(fileName, content) {
  fs.writeFile(fileName, content, 'utf-8', err => {
    if (err) {
      console.log(err);
    } else {
      return true;
    }
  });
}

function readFile(fileName) {
  let data = fs.readFileSync(fileName, 'utf-8');
  return JSON.parse(data);
}

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`the api server is running at localhost:${PORT}`);
  }
});
