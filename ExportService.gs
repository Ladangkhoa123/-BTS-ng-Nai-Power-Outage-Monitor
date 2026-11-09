function exportData() {
  const data = getDashboardData();
  const headers = ['Mã BTS','Tên trạm','Mã điện kế','Site ID','Khu vực','Ngày cúp điện','Khôi phục dự kiến','Lý do','Mức độ khớp','Khoảng cách (km)'];
  const rows = data.records.map(r => [r.station.id, r.station.name, r.station.meterCode, r.outage.siteId, r.outage.location || r.outage.district, r.outage.startDate, r.outage.restoreDate, r.outage.reason, r.matchStatus, r.distanceKm || '']);
  return [headers].concat(rows).map(row => row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
}
