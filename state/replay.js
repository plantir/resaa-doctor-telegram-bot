const bot = require('../bot');
const request = require('request-promise');
bot.on('message', async msg => {
  if (!msg.reply_to_message) {
    return;
  }
  try {
    if (!msg.voice && !msg.text) {
      return bot.sendMessage(
        msg.chat.id,
        `شما تنها امکان ارسال متن و صدا را برای بیمار دارید`
      );
    }
    if (msg.voice) {
      let { result } = await request.get({
        url: `https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${msg.voice.file_id}`,
        json: true
      });
      msg.voice.file_path = `https://api.telegram.org/file/bot${process.env.TOKEN}/${result.file_path}`;
    }

    let res = await request({
      url: `${process.env.PATIENT_BOT_API}/replay_test`,
      method: 'POST',
      body: {
        msg
      },
      json: true
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
  // send to another
});
