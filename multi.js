const puppeteer = require('puppeteer');

const urls = [
  'https://www.yolo.com.np',
  'https://traveldetails.org'
];

(async () => {
  const browser = await puppeteer.launch();
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const emails = await page.evaluate(() => {
      const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const emailElements = document.querySelectorAll('body *');
      const emailList = [];

      emailElements.forEach((element) => {
        const elementText = element.textContent;
        const elementEmails = elementText.match(emailPattern);
        if (elementEmails) {
          emailList.push(...elementEmails);
        }
      });

      return [...new Set(emailList)];
    });

    console.log(`Emails for ${url}: `, emails);

    await page.close();
  }
  
  await browser.close();
})();
