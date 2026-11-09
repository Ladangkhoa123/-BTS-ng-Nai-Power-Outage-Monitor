function fetchEvspcOutages_(stations) {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + CONFIG.DAYS_AHEAD - 1);
  const from = formatEvnDate_(now);
  const to = formatEvnDate_(end);
  const requests = stations.filter(s => s.meterCode).map(station => ({
    station,
    request: {
      url: `${CONFIG.API_URL}?tuNgay=${from}&denNgay=${to}&maKH=${encodeURIComponent(station.meterCode)}&ChucNang=MaKhachHang`,
      muteHttpExceptions: true, method: 'get', headers: { Accept: 'text/html' }
    }
  }));
  const outages = [];
  for (let i = 0; i < requests.length; i += 10) {
    let pending = requests.slice(i, i + 10);
    for (let attempt = 0; attempt < 3 && pending.length; attempt++) {
      const retry = [];
      UrlFetchApp.fetchAll(pending.map(item => item.request)).forEach((response, offset) => {
        const item = pending[offset];
        const status = response.getResponseCode();
        if (status >= 200 && status < 300) {
          outages.push(...parseEvnCustomerHtml_(response.getContentText(), item.station));
        } else if (status >= 500 && attempt < 2) {
          retry.push(item);
        } else {
          console.warn(`Bỏ qua mã ${item.station.meterCode}: EVNSPC HTTP ${status}.`);
        }
      });
      pending = retry;
      if (pending.length) Utilities.sleep(500);
    }
  }
  return outages;
}

function parseEvnCustomerHtml_(html, station) {
  const addressMatch = html.match(/<b>Địa chỉ:<\/b>\s*([^<]+)/i);
  const address = decodeHtml_(addressMatch ? addressMatch[1] : '');
  const entries = [];
  const entryRegex = /<div class="entry">([\s\S]*?)<\/div>\s*<br/gi;
  let match;
  while ((match = entryRegex.exec(html))) {
    const block = match[1];
    const code = cleanLabel_(decodeHtml_(textFromHtml_(capture_(block, /<span class="code">([\s\S]*?)<\/span>/i))));
    const timeText = decodeHtml_(textFromHtml_(capture_(block, /<span class="time">([\s\S]*?)<\/span>/i)));
    const reason = cleanLabel_(decodeHtml_(textFromHtml_(capture_(block, /<span class="cause">([\s\S]*?)<\/span>/i))));
    const times = timeText.match(/(\d{2}:\d{2}:\d{2})[\s\S]*?(\d{2}\/\d{2}\/\d{4})[\s\S]*?(\d{2}:\d{2}:\d{2})[\s\S]*?(\d{2}\/\d{2}\/\d{4})/);
    if (times) entries.push({
      province: 'Đồng Nai', district: '', customerCode: station.meterCode, siteId: '', scheduleId: code,
      location: address, startDate: evnDateTime_(times[2], times[1]), restoreDate: evnDateTime_(times[4], times[3]),
      reason, status: 'Đã lên lịch', latitude: station.latitude, longitude: station.longitude
    });
  }
  return entries;
}

function capture_(text, regex) { const match = text.match(regex); return match ? match[1] : ''; }
function textFromHtml_(value) { return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }
function cleanLabel_(value) { return String(value || '').replace(/^.*?:\s*/, '').trim(); }
function decodeHtml_(value) { return String(value || '').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(); }
function formatEvnDate_(date) { return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd-MM-yyyy'); }
function evnDateTime_(date, time) { const [d, m, y] = date.split('/'); return `${y}-${m}-${d}T${time}`; }
