const puppeteer = require('puppeteer-core');
const xlsx = require('xlsx');
const fs = require('fs');
const csvWriter = require('csv-write-stream');

const sanitizeSheetName = (sheetName) => sheetName.replace(/[/\\?*[\]]/g, '');

const workbook = xlsx.utils.book_new();
const writer = csvWriter();
writer.pipe(fs.createWriteStream('emails.csv'));

(async () => {
  const workbook = xlsx.readFile('input.xlsx');
  const worksheet = workbook.Sheets['https://www.google.com/maps/sea'];
  const urls = [];

  for (let i = 3; i <= 7; i++) {
    const cell = worksheet[`F${i}`];
    if (cell && cell.v) {
      urls.push(cell.v);
    }
  }

  const browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome'});
  const allEmails = [];

  for (const url of urls) {
    try {
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

      console.log(`Emails found for ${url}:`);
      console.log(emails);
      console.log('------------------');

      writer.write({
        url,
        emails: emails.join(', ')
      });
    } catch (err) {
      console.error(`Error extracting emails for ${url}:`, err);
    }
  }

  xlsx.utils.book_append_sheet(workbook, xlsx.utils.aoa_to_sheet(allEmails.map(({ url, emails }) => [url, ...emails])), sanitizeSheetName('All Emails'));

  try {
    xlsx.writeFile(workbook, 'emails.xlsx');
    console.log('Excel file created successfully!');
  } catch (err) {
    console.error('Error creating Excel file:', err);
  }

  writer.end();
  await browser.close();
})();
