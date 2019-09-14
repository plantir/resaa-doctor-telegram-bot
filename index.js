require('dotenv').config();
const bot = require('./bot');
const port = process.env.port || 9000;
const token = bot.token;
const url = 'https://DoctorBotTelegram.resaa.net';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request-promise');
const fs = require('fs');
require('./state/start');
require('./state/replay');
app.use(bodyParser.json());
app.post(`/`, (req, res) => {
  console.log(req.body);
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
app.get(`/`, (req, res) => {
  res.sendStatus(200);
});
app.post('/testAnswer', async (req, res, next) => {
  let files = req.body.testAnswers;
  let chat_id = req.body.chat_id;
  let patient_chatid = req.body.patient_chatid;
  let tracking_code = generate_tracking_code();
  for (const file of files) {
    try {
      // let read_stream = fs.createReadStream()
      let name = `./file/test_answer/#${tracking_code}__${Date.now()}.png`;
      const stream = request.get(file);
      stream.pipe(fs.createWriteStream(name));
      // let photo = fs.createReadStream(name)
      await bot.sendPhoto(chat_id, stream, {
        caption: `${tracking_code}#${patient_chatid}`
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  res.send(tracking_code);
});
// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});
bot.onText(/chatID/i, msg => {
  bot.sendMessage(msg.chat.id, msg.chat.id);
});

function generate_tracking_code() {
  return (Math.floor(Math.random() * 1000000) + 1000000)
    .toString()
    .substring(1);
}
