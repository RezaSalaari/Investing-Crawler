const Puppeteer = require("puppeteer");
let page = "";
async function doCrawl(){
try {
  const browser = await Puppeteer.launch({headless:false});
  // Create a new page object
   page = await browser.newPage();
   console.log('open new Page');
  await page.goto("https://www.investing.com/currencies/xau-usd-technical", {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  await page.waitForSelector("#technicalstudiesSubTabs");
  // await page.waitForSelector('button[id="onetrust-accept-btn-handler"]');
  // await page.click('button[id="onetrust-accept-btn-handler"]');
  await page.click("xpath/" + '//*[@id="timePeriodsWidget"]/li[6]/a');
  await page.waitForTimeout(8000)
  const riskyPoints = await getR2AndS2();
  await page.waitForTimeout(8000)
  await page.click("xpath/" + '//*[@id="timePeriodsWidget"]/li[7]/a');
  await page.waitForTimeout(8000)
  const safePoints = await getR2AndS2();
  console.log('get Points',riskyPoints,safePoints);

  return {riskyPoints,safePoints}
} catch (error) {
  console.log(error,'error');
}
 

}

async function getR2AndS2() {
  const pivotPointsTable = await page.$("#curr_table > tbody ");
  const pivotPointsData = await page.evaluate((table) => {
    const data = [];
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      const values = [];
      const cells = row.querySelectorAll("td");

      cells.forEach((cell) => {
        values.push(cell.innerText);
      });

      if (values.length) {
        data.push(values);
      }
    });

    return data;
  }, pivotPointsTable);

  const S2 = pivotPointsData[0][2];
  const R2 = pivotPointsData[0][6];
  return {
    Sell: Number(R2.split('.')[0]) - 1 +'.'+R2.split('.')[1] ,
   Buy: Number(S2.split('.')[0]) + 1 +'.'+S2.split('.')[1] } 
}

module.exports = doCrawl