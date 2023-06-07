const cron = require('node-cron');
const doCrawl = require('./points');
const TelegramBot = require('./telegram.interface')


const config = require('./config')
const telegramBotInterface = new TelegramBot(config)


console.log('testtttttttttt');

cron.schedule('*/5 * * * *', async() => {

 
    if(!hasAllowToSendMessage()) return false;
    const {riskyPoints,safePoints} =  await doCrawl() ; 
  console.log('run succefuly do Crwal Function');
    const message = `

      'نقاط پرریسک' : 

      Sell : ${riskyPoints.Sell},
      Buy  : ${riskyPoints.Buy}
      -----------------------------------

      'نقاط امن' :

      Sell : ${safePoints.Sell},
      Buy  : ${safePoints.Buy}
      -----------------------------------
      
      'مدت زمان اعتبار' : 
      
    نقاط امن : ${getExpireTime().safeExpireTime}
    نقاط پر ریسک : ${getExpireTime().unSafeExpireTime}
    `
    try {
      console.log('now its send pm to telegram');
   await telegramBotInterface.sendMessageToChannel(message);
      
    } catch (error) {
      console.log(error,'errrrrrrrrrrrrrrrrrrror');
    }})
  // });


function hasAllowToSendMessage(){

 return allowedDay() && allowedHour()
}

function allowedDay(){
  const allowedDays = ['Tuesday','Sunday','Wednesday','Thursday','Friday','Monday']
  const today = new Date().toLocaleString('en-US', { weekday: 'long',})
 return allowedDays.indexOf(today) > -1
}


function allowedHour(){
  const hour = new Date().getHours();
  console.log(hour,'hour');
  return [08,13,18].indexOf(hour) > -1
}
/**
 * این تابع وظیفه محاسبه زمان اکسپایر شدن سیگنال را دارد
 */
function getExpireTime(){
const time = new Date(),
minutes = 30,
hour = 4 ;
time.setHours(time.getHours() + 4,time.getMinutes() + 30)
  return {
    unSafeExpireTime : `در ساعت : ${time.getHours()} : ${time.getMinutes()}منقضی خواهد شد`,
    safeExpireTime : `تا ساعت دوازده شب فعال خواهد بود`
    
  }
}