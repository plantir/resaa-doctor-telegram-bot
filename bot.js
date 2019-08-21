require('dotenv').config();
var TelegramBot = require('node-telegram-bot-api');
const token = '388067630:AAHwHSYHfX7zdFrCKPIC1oi14wvZcxWqc_c';
const User = require('./Model/User');
class Bot extends TelegramBot {
  async sendMessage(chatId, text, body = {}, whith_history = true) {
    if (whith_history) {
      let user = new User(chatId);
      await user.push_history({
        text,
        body
      });
    }
    super.sendMessage(chatId, text, body);
  }
}
var bot = new Bot(token, {
  polling: process.env.MODE == 'polling' ? true : false
});
module.exports = bot;
