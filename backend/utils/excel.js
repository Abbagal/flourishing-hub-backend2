import ExcelJS from "exceljs";

import { parseCsv } from "./csv.js";

const normalizeHeader = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const getHeaderRowIndex = (worksheet) => {
  const maxScanRows = Math.min(10, worksheet.rowCount);
  let bestIndex = 1;
  let bestScore = -1;

  for (let rowNumber = 1; rowNumber <= maxScanRows; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const values = row.values.slice(1).map(normalizeHeader);
    const nonEmptyCount = values.filter(Boolean).length;
    const textLikeCount = values.filter((value) => /[A-Za-z]/.test(value)).length;
    const score = nonEmptyCount * 10 + textLikeCount;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = rowNumber;
    }
  }

  return bestIndex;
};

const autoFitColumns = (worksheet, rows) => {
  if (!rows.length) {
    return;
  }

  const keys = Object.keys(rows[0]);
  worksheet.columns = keys.map((key) => {
    const maxLength = rows.reduce((width, row) => {
      const value = row[key] ?? "";
      return Math.max(width, String(value).length);
    }, key.length);

    return {
      header: key,
      key,
      width: Math.min(Math.max(maxLength + 2, 12), 40)
    };
  });

  rows.forEach((row) => {
    worksheet.addRow(row);
  });
};

export const parseWorkbookRows = async (buffer, options = {}) => {
  const fileName = String(options.fileName || "").toLowerCase();

  if (fileName.endsWith(".csv")) {
    return parseCsv(buffer.toString("utf-8"));
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const targetSheet =
    (options.sheetName && workbook.getWorksheet(options.sheetName)) || workbook.worksheets[0];

  if (!targetSheet) {
    return [];
  }

  const headerRowIndex = getHeaderRowIndex(targetSheet);
  const headerRow = targetSheet.getRow(headerRowIndex);
  const headers = headerRow.values
    .slice(1)
    .map(normalizeHeader);

  return targetSheet
    .getRows(headerRowIndex + 1, Math.max(targetSheet.rowCount - headerRowIndex, 0))
    ?.map((row) =>
      headers.reduce((result, header, index) => {
        result[header] = row.getCell(index + 1).text ?? "";
        return result;
      }, {})
    )
    .filter((row) => Object.values(row).some((value) => String(value).trim() !== "")) || [];
};

export const createWorkbookBuffer = async (sheets) => {
  const workbook = new ExcelJS.Workbook();

  sheets.forEach(({ name, rows }) => {
    const worksheet = workbook.addWorksheet(name);
    autoFitColumns(worksheet, rows);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
