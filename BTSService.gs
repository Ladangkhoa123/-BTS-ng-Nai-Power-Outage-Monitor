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

// Sheet 1 contains Đồng Nai/BHO. Sheet 2 contains Vĩnh Cửu/VCU.
function getBTSStations() {
  const ss = getSpreadsheet_();
  const mainSheet = getSheetByCandidates_(ss, [CONFIG.BTS_SHEET_NAME, 'Sheet1']);
  const stations = rowsAsObjects_(mainSheet).map((row, index) => stationFromAreaSheet_(row, `station-${index + 1}`, 'Đồng Nai'));
  const vinhCuuSheet = getSheetByCandidates_(ss, [CONFIG.BTS_VINH_CUU_SHEET_NAME]) || ss.getSheets()[1] || null;
  if (vinhCuuSheet && vinhCuuSheet !== mainSheet) {
    rowsAsObjects_(vinhCuuSheet).forEach((row, index) => {
      stations.push(stationFromAreaSheet_(row, `vinh-cuu-${index + 1}`, 'Vĩnh Cửu'));
    });
  }
  return stations;
}

function stationFromAreaSheet_(row, fallbackId, area) {
  return {
    id: row.tramvt || row['Mã trạm'] || fallbackId,
    code: row.ten_csht || row['Mã CSHT'] || row['Tên CSHT'] || '',
    name: row['Tên gợi nhớ'] || row['TÊN TRẠM'] || row['Tên trạm'] || row.ten_csht || row.tramvt || fallbackId,
    address: row.tramvt || '',
    meterCode: row.ma_dienke || row['Mã điện kế'] || '',
    latitude: toNumber_(row.latitude),
    longitude: toNumber_(row.longitude),
    type: row.loai_csht || '',
    fiveG: row['5G'] || '',
    battery: row.Pin || '',
    generatorUpdate: row['Cập nhật máy nổ'] || '',
    area: area,
    raw: row
  };
}
