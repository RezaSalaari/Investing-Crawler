const Puppeteer = require("puppeteer");
let page = "";

async function doCrawl(){
try {
  const browser = await Puppeteer.launch({ 
   headless:true,
    executablePath:'/usr/bin/chromium',
   args:['--no-sandbox','--disable-setuid-sandbox',
   '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
   '--user-data-dir=/tmp/user_data/',
   '--window-size=1200,800',]
  });
  // Create a new page object
   page = await browser.newPage();
   console.log('open new Page');
  await page.goto("https://www.investing.com/currencies/xau-usd-technical", {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  await page.waitForSelector("#technicalstudiesSubTabs");
  await page.waitForTimeout(8000)
  await page.waitForSelector("#timePeriodsWidget");
  await page.waitForTimeout(8000)
  await page.click("xpath/" + '//*[@id="timePeriodsWidget"]/li[6]/a'); //click on 5h label
const riskyPoints = await getR2AndS2();
  await page.waitForTimeout(8000)
  await page.click("xpath/" + '//*[@id="timePeriodsWidget"]/li[7]/a');//click on daily label
  await page.waitForTimeout(8000)
  const safePoints = await getR2AndS2();
  console.log('get Points',riskyPoints,safePoints);

  return {riskyPoints,safePoints}
} catch (error) {
  console.log(error,'error');
}
 

}

async function getR2AndS2() {
  const result = await page.$$eval('#curr_table', rows => {
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  });

  const S2 = result[0][2];
  const R2 = result[0][6];
  return {
    Sell: Number(R2.split('.')[0]) - 1 +'.'+R2.split('.')[1] ,
   Buy: Number(S2.split('.')[0]) + 1 +'.'+S2.split('.')[1] } 
}
doCrawl()
module.exports = doCrawl
