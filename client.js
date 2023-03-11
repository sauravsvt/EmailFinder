const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // specify the URL of the website
  const url = 'https://www.yolo.com.np';
  
  // navigate to the website
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // extract email addresses from the page
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
  
  console.log(emails);
  
  await browser.close();
})();
