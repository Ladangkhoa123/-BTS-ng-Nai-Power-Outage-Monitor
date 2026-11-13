/** Configuration for BTS Dong Nai - Power Outage Monitor. */
const CONFIG = {
  // Set to true to temporarily lock the web app and show the maintenance page.
  MAINTENANCE_MODE: true,
  MAINTENANCE_MESSAGE: 'Hệ thống đang bảo trì. Vui lòng quay lại sau.',
  // Set this to the Google Spreadsheet ID that contains the imported workbook.
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '15FWty4E1dZg67EdKypT1LAdp98Mj489xvY1GP8Gzcm4',
  BTS_SHEET_NAME: 'Danh sách trạm BTS',
  BTS_VINH_CUU_SHEET_NAME: 'Sheet2',
  GENERATOR_SHEET_NAME: 'Danh sách máy phát',
  OUTAGE_SHEET_NAME: 'PowerOutages',
  API_URL: 'https://cskh.evnspc.vn/TraCuu/GetThongTinLichNgungGiamCungCapDien',
  API_METHOD: 'GET',
  DAYS_AHEAD: 7,
  NEARBY_RADIUS_KM: 3,
  EVNSPC_DONG_NAI_UNITS: ['PK0100','PK0200','PK0300','PK0400','PK0500','PK0600','PK0700','PK0800','PK0900','PK1000','PK1100','PK9900']
};

function getConfigStatus() {
  return {
    spreadsheetConfigured: Boolean(CONFIG.SPREADSHEET_ID),
    apiConfigured: true,
    outageSheet: CONFIG.OUTAGE_SHEET_NAME,
    daysAhead: CONFIG.DAYS_AHEAD
  };
}
