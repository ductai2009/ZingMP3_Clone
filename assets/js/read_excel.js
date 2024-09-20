// Import thư viện xlsx
const XLSX_ = require('xlsx');

// Đường dẫn đến file Excel cần đọc
const excelFilePath = '../data/20240230.xlsx';

// Đọc file Excel
const workbook = XLSX_.readFile(excelFilePath);

// Lấy ra sheet đầu tiên từ workbook
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Chuyển đổi dữ liệu từ sheet sang JSON
const data = XLSX_.utils.sheet_to_json(worksheet);

// In ra dữ liệu
console.log(data);
