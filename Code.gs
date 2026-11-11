function doGet() {
  if (CONFIG.MAINTENANCE_MODE) {
    return HtmlService.createTemplateFromFile('Maintenance')
      .evaluate()
      .setTitle('Hệ thống đang bảo trì')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('BTS Đồng Nai – Power Outage Monitor')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getDashboardData() {
  const stations = getBTSStations();
  const outages = getPowerOutages();
  const matches = matchOutagesWithBTS(stations, outages);
  const now = new Date();
  const today = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return {
    stations: stations,
    outages: outages,
    records: matches,
    config: getConfigStatus(),
    syncedAt: PropertiesService.getScriptProperties().getProperty('LAST_SYNC_AT') || null,
    stats: {
      stations: stations.length,
      outages: outages.length,
      exact: matches.filter(r => r.matchStatus === 'exact').length,
      verify: matches.filter(r => r.matchStatus !== 'exact').length,
      today: matches.filter(r => r.startDate === today).length,
      next7Days: matches.filter(r => r.startDate >= today).length
    }
  };
}

function setupConfig(spreadsheetId) {
  if (!spreadsheetId) throw new Error('Cần cung cấp Spreadsheet ID.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheetId.trim());
  return getConfigStatus();
}
