function syncOutages() {
  const outages = fetchEvspcOutages_(getBTSStations());
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(CONFIG.OUTAGE_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.OUTAGE_SHEET_NAME);
  const headers = ['Province', 'District', 'customerCode', 'siteId', 'scheduleId', 'location', 'startDate', 'restoreDate', 'reason', 'status', 'latitude', 'longitude'];
  const values = [headers].concat(outages.map(o => headers.map(h => o[h] || '')));
  sheet.clearContents();
  sheet.getRange(1, 1, values.length, headers.length).setValues(values);
  const timestamp = new Date().toISOString();
  PropertiesService.getScriptProperties().setProperty('LAST_SYNC_AT', timestamp);
  return { count: outages.length, syncedAt: timestamp };
}
