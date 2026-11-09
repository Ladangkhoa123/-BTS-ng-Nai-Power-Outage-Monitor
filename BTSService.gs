function getSpreadsheet_() {
  if (!CONFIG.SPREADSHEET_ID) throw new Error('Chưa cấu hình SPREADSHEET_ID. Hãy nhập Google Spreadsheet ID trong Project Settings > Script properties.');
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function getSheetByCandidates_(ss, names) {
  for (const name of names) {
    const sheet = ss.getSheetByName(name);
    if (sheet) return sheet;
  }
  return null;
}

function rowsAsObjects_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift().map(h => String(h).trim());
  return values.filter(row => row.some(Boolean)).map(row => {
    const item = {};
    headers.forEach((header, i) => item[header] = row[i] === undefined ? '' : row[i]);
    return item;
  });
}

function getBTSStations() {
  const ss = getSpreadsheet_();
  const sheet = getSheetByCandidates_(ss, [CONFIG.BTS_SHEET_NAME, 'Sheet1']);
  return rowsAsObjects_(sheet).map((row, index) => ({
    id: row.tramvt || row['Mã trạm'] || `station-${index + 1}`,
    code: row.ten_csht || '',
    name: row['Ten gợi nhớ'] || row.ten_csht || row.tramvt || '',
    address: row.tramvt || '',
    meterCode: row.ma_dienke || '',
    latitude: toNumber_(row.latitude),
    longitude: toNumber_(row.longitude),
    type: row.loai_csht || '',
    fiveG: row['5G'] || '',
    battery: row.Pin || '',
    generatorUpdate: row['cập nhật máy nổ'] || '',
    raw: row
  }));
}

function getGeneratorStations() {
  const ss = getSpreadsheet_();
  const sheet = getSheetByCandidates_(ss, [CONFIG.GENERATOR_SHEET_NAME, 'Sheet2']);
  return rowsAsObjects_(sheet);
}

function toNumber_(value) {
  const n = Number(String(value || '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
