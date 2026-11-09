function getPowerOutages() {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(CONFIG.OUTAGE_SHEET_NAME);
  return rowsAsObjects_(sheet).map(row => ({
    province: row.Province || row.province || '', district: row.District || row.district || '',
    customerCode: row.customerCode || row['Mã khách hàng'] || '', siteId: row.siteId || row['Site ID'] || '',
    location: row.location || row['Địa điểm'] || '', startDate: row.startDate || '',
    restoreDate: row.restoreDate || '', reason: row.reason || '', status: row.status || '',
    latitude: toNumber_(row.latitude), longitude: toNumber_(row.longitude)
  }));
}

function matchOutagesWithBTS(stations, outages) {
  const result = [];
  outages.forEach(outage => stations.forEach(station => {
    const exact = normalize_(outage.customerCode) && normalize_(outage.customerCode) === normalize_(station.meterCode);
    const distance = distanceKm_(outage.latitude, outage.longitude, station.latitude, station.longitude);
    const nearby = !exact && distance !== null && distance <= CONFIG.NEARBY_RADIUS_KM;
    if (exact || nearby) result.push({ station, outage, distanceKm: distance, matchStatus: exact ? 'exact' : 'nearby' });
  }));
  return result;
}

function normalize_(value) { return String(value || '').trim().toUpperCase().replace(/\s+/g, ''); }
function distanceKm_(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some(v => v === null || v === undefined)) return null;
  const rad = Math.PI / 180, dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100;
}
