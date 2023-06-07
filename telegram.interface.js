const TelegramBot = require("node-telegram-bot-api");
const Agent = require("socks5-https-client/lib/Agent");

class TelegramInterface {
  constructor(config) {
    this._bot = new TelegramBot(config.token, {
      polling: true,
    });
    this._chatId = config.chatId;
  }

  async sendMessageToChannel(msg) {
    return await this._bot.sendMessage(this._chatId, msg);
  }
}

module.exports = TelegramInterface;
