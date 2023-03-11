const xlsx = require('xlsx');
const workbook = xlsx.readFile('input.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const range = xlsx.utils.decode_range(worksheet['!ref']);

const urls = [];

for (let row = range.s.r + 2; row <= range.e.r; row++) {
  const cellAddress = xlsx.utils.encode_cell({ r: row, c: 5 });
  const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v.trim() : '';
  if (cellValue !== '') {
    urls.push(cellValue);
  }
}

console.log(urls);
