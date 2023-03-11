const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://yolo.com.np');
  
  const links = await page.evaluate(() => {
    const linkElements = document.querySelectorAll('a');
    const linkUrls = [];
    for (let i = 0; i < linkElements.length; i++) {
      linkUrls.push(linkElements[i].href);
    }
    return linkUrls;
  });

  console.log(links);

  await browser.close();
})();
