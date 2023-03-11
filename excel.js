const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

function sanitizeSheetName(name) {
  const invalidChars = /[\\\/\?\*\[\]:]/g;
  return name.replace(invalidChars, '');
}

(async () => {
  const urls = [
    'https://www.traveldetails.org', 
    'https://www.yolo.com.np'
  ];
  const browser = await puppeteer.launch();
  const workbook = xlsx.utils.book_new();

  for (const url of urls) {
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

    const worksheetName = sanitizeSheetName(url);
    const worksheetData = emails.map(email => [email]);
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, worksheetName);
  }

  xlsx.writeFile(workbook, 'emails.xlsx');
  await browser.close();
})();
