const SPREADSHEET_ID = '1ayDUFn20XHUjjSGkDA6OhI9jd1Z9kOq9KVVWB4bpQWE';
const DATA_SHEET = 'DU_LIEU';

function doGet() {
  return json_({ ok: true, service: '5-khong-3-sach-3-an', time: new Date().toISOString() });
}

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    validate_(payload);
    const result = save_(payload);
    return json_({ ok: true, maHo: result.maHo, row: result.row });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('Không có dữ liệu gửi lên.');
  return JSON.parse(e.postData.contents);
}

function validate_(p) {
  if (!p || !p.meta) throw new Error('Thiếu thông tin hộ gia đình.');
  if (!p.meta.name) throw new Error('Thiếu họ tên đại diện/chủ hộ.');
  if (!p.meta.unit) throw new Error('Thiếu xã/phường.');
  for (let i = 1; i <= 11; i++) {
    const c = p.criteria && p.criteria['c' + i];
    if (!c || !['dat','chuadat'].includes(c.value)) throw new Error('Thiếu kết quả tiêu chuẩn ' + i + '.');
  }
}

function save_(p) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(DATA_SHEET);
  if (!sh) throw new Error('Không tìm thấy sheet DU_LIEU.');

  const now = new Date();
  const maHo = makeHouseholdCode_(p.meta.unit, now);
  const vals = [];
  for (let i = 1; i <= 11; i++) vals.push(p.criteria['c' + i].value === 'dat' ? 'Đạt' : 'Chưa đạt');
  const tongDat = vals.filter(v => v === 'Đạt').length;
  const support = p.support || {};
  const group = p.group || {};
  const meta = p.meta || {};

  const row = [
    now, maHo, meta.name || '', meta.gender || '', meta.birthYear || '',
    meta.ethnicity || '', meta.education || '', meta.phone || '', meta.unit || '',
    meta.address || '', meta.assessmentYear || '',
    group.poor ? 'Có' : '', group.nearPoor ? 'Có' : '', group.vulnerable ? 'Có' : '', group.other ? 'Có' : '',
    ...vals,
    tongDat, tongDat === 11 ? 'Đạt 11/11' : 'Chưa đạt đủ 11/11',
    support.loan ? 'Có' : '', support.training ? 'Có' : '', support.livelihood ? 'Có' : '',
    support.cleanWater ? 'Có' : '', support.toilet ? 'Có' : '', support.other || '',
    'Chờ bình xét', '', '', '', '', p.sessionId || '', 'Website'
  ];

  sh.appendRow(row);
  return { maHo, row: sh.getLastRow() };
}

function makeHouseholdCode_(unit, d) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, unit + '|' + d.getTime());
  const key = Utilities.base64EncodeWebSafe(digest).replace(/[^A-Za-z0-9]/g,'').slice(0,8).toUpperCase();
  return 'CT-' + Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyyMMdd') + '-' + key;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
