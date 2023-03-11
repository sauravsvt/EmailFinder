const https = require('https');

// specify the URL of the website
const url = 'https://www.traveldetails.org';

// retrieve the HTML content of the website
https.get(url, (res) => {
  let html = '';
  
  res.on('data', (chunk) => {
    html += chunk;
  });

  res.on('end', () => {
    // use regex to find email addresses in the HTML content
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = html.match(emailPattern);

    // print the extracted email addresses
    if (emails) {
      for (const email of emails) {
        console.log(email);
      }
    } else {
      console.log('No emails found');
    }
  });

}).on('error', (err) => {
  console.error(err);
});
