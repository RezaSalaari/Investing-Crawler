const TelegramBot = require('node-telegram-bot-api')
const Agent = require('socks5-https-client/lib/Agent')



class TelegramInterface{
    constructor(config) {
        this._bot = new TelegramBot(config.token,
          {
            polling:true,
            request: {
              agentClass: Agent,
              agentOptions: {
                socksHost: '193.151.191.37',
                socksPort: '1085',
                // If authorization is needed:
                // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
                // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
              }
            }
        }
          )
        this._chatId = config.chatId
    }

  async  sendMessageToChannel(msg){
  return await  this._bot.sendMessage(this._chatId,msg)
    }

}

module.exports = TelegramInterface