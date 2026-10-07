const ADMIN_SHEET = 'TAI_KHOAN_QUAN_TRI';

function getAdminContext() {
  const email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  if (!email) return {authorized:false,email:''};

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ADMIN_SHEET);
  if (!sh || sh.getLastRow() < 2) return {authorized:false,email:email};

  const rows = sh.getRange(2,1,sh.getLastRow()-1,8).getDisplayValues();
  for (let i=0;i<rows.length;i++) {
    const r = rows[i];
    if (String(r[1]||'').trim().toLowerCase() === email && r[5] === 'Hoạt động') {
      return {
        authorized:true,
        email:email,
        name:r[2]||email,
        unit:r[3]||'',
        role:r[4]||'CO_SO'
      };
    }
  }
  return {authorized:false,email:email};
}

function requireAdmin_() {
  const ctx = getAdminContext();
  if (!ctx.authorized) throw new Error('Tài khoản chưa được cấp quyền quản trị.');
  return ctx;
}

function getAdminUnits() {
  const ctx = requireAdmin_();
  if (ctx.role !== 'THANH_PHO') return [ctx.unit];
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('DANH_MUC');
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2,2,sh.getLastRow()-1,1).getDisplayValues().flat().filter(Boolean);
}

function adminListHouseholds(filter) {
  const ctx = requireAdmin_();
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(DATA_SHEET);
  const last = sh.getLastRow();
  if (last < 2) return [];

  const q = String((filter&&filter.q)||'').trim().toLowerCase();
  const status = String((filter&&filter.status)||'').trim();
  let unit = String((filter&&filter.unit)||'').trim();

  if (ctx.role === 'CO_SO') unit = ctx.unit;

  const values = sh.getRange(2,1,last-1,41).getDisplayValues();
  const out = [];
  for (let i=values.length-1;i>=0;i--) {
    const v = values[i];
    if (unit && v[8] !== unit) continue;
    if (status && v[34] !== status) continue;
    if (q) {
      const hay = (v[1]+' '+v[2]).toLowerCase();
      if (!hay.includes(q)) continue;
    }
    out.push({
      row:i+2,
      code:v[1],
      name:v[2],
      phone:v[7],
      unit:v[8],
      total:v[26],
      status:v[34]||'Chờ bình xét'
    });
    if (out.length >= 200) break;
  }
  return out;
}

function adminGetHousehold(row) {
  const ctx = requireAdmin_();
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(DATA_SHEET);
  row = Number(row);
  if (row < 2 || row > sh.getLastRow()) throw new Error('Hồ sơ không hợp lệ.');
  const v = sh.getRange(row,1,1,41).getDisplayValues()[0];

  if (ctx.role === 'CO_SO' && v[8] !== ctx.unit) {
    throw new Error('Bạn không có quyền xem hồ sơ ngoài đơn vị được phân công.');
  }

  return {
    row:row,
    code:v[1],
    name:v[2],
    gender:v[3],
    birthYear:v[4],
    ethnicity:v[5],
    education:v[6],
    phone:v[7],
    unit:v[8],
    address:v[9],
    year:v[10],
    total:v[26],
    status:v[34]||'Chờ bình xét',
    opinion:v[35]||'',
    reviewer:v[37]||'',
    note:v[38]||'',
    criteria:v.slice(15,26)
  };
}

function adminSaveReview(data) {
  const ctx = requireAdmin_();
  const allowed = ['Chờ bình xét','Đã xác nhận đạt','Đã xác nhận chưa đạt','Cần bổ sung thông tin'];
  if (!data || !allowed.includes(String(data.status||''))) throw new Error('Trạng thái không hợp lệ.');

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(DATA_SHEET);
  const row = Number(data.row);
  if (row < 2 || row > sh.getLastRow()) throw new Error('Hồ sơ không hợp lệ.');

  const currentUnit = sh.getRange(row,9).getDisplayValue();
  if (ctx.role === 'CO_SO' && currentUnit !== ctx.unit) {
    throw new Error('Bạn không có quyền cập nhật hồ sơ ngoài đơn vị được phân công.');
  }

  sh.getRange(row,35).setValue(String(data.status||''));
  sh.getRange(row,36).setValue(String(data.opinion||'').trim());
  sh.getRange(row,37).setValue(new Date());
  sh.getRange(row,38).setValue(String(data.reviewer||ctx.name||'').trim());
  sh.getRange(row,39).setValue(String(data.note||'').trim());
  SpreadsheetApp.flush();

  return {ok:true,row:row,status:String(data.status||'')};
}
