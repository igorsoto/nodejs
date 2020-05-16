const express = require("express");
const EventEmitter = require("events");
const fs = require("fs");

const app = express();
const port = 3000;

const delay = miliseconds => new Promise((resolve) => setTimeout(() => resolve(), miliseconds));

class ProcessEmitter extends EventEmitter { };
const processEmitter = new ProcessEmitter();

processEmitter.on("start", async ({ response, id }) => {
  const file = fs.createWriteStream(`./${id}.txt`);
  for (let page = 0; page < 20; page++) {
    await delay(1000);
    console.log(`id: ${id}\npage: ${page}\n\n`);
    response.write(page.toString());
    file.write(page.toString() + "\n");
  }

  file.end();
  file.close();
  response.end();
});

app.get('/ping', (req, res) => {
  res.send("pong");
});

app.get('/:id', (req, res) => {
  processEmitter.emit("start", {
    response: res,
    id: req.params.id
  });
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));