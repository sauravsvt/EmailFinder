const puppeteer = require('puppeteer');
const xlsx = require('xlsx');
const fs = require('fs');

const sanitizeSheetName = (sheetName) => sheetName.replace(/[/\\?*[\]]/g, '');

(async () => {
  const urls = [
    'https://www.traveldetails.org',
    'https://www.yolo.com.np'
  ];
  const browser = await puppeteer.launch();
  const workbook = xlsx.utils.book_new();

  const allEmails = [];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });

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

    allEmails.push({
      url,
      emails
    });
  }

  const csvData = allEmails.map(({ url, emails }) => {
    const data = [url];
    data.push(...emails);
    return data.join(',');
  }).join('\n');

  fs.writeFile('emails.csv', csvData, (err) => {
    if (err) {
      console.error('Error creating CSV file:', err);
    } else {
      console.log('CSV file created successfully!');
    }
  });

  await browser.close();
})();
