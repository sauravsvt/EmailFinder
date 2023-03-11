const request = require('request');
const cheerio = require('cheerio');

const url = 'https://www.traveldetails.org/';

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const links = $('a'); // select all anchor tags on the page

    links.each(function(i, link) {
      const href = $(link).attr('href');
      console.log(href); // log each href attribute
    });
  }
});
