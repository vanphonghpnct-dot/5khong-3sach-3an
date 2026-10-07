function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('5 KHÔNG · 3 SẠCH · 3 AN')
    .addItem('Mở bảng bình xét', 'showAdminSidebar')
    .addItem('Đi tới Dashboard', 'goDashboard')
    .addItem('Đi tới dữ liệu', 'goData')
    .addToUi();
}

function showAdminSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('AdminSidebar')
    .setTitle('Bình xét 5 Không · 3 Sạch · 3 An');
  SpreadsheetApp.getUi().showSidebar(html);
}

function goDashboard() {
  const ss = SpreadsheetApp.getActive();
  ss.setActiveSheet(ss.getSheetByName('DASHBOARD'));
}

function goData() {
  const ss = SpreadsheetApp.getActive();
  ss.setActiveSheet(ss.getSheetByName('DU_LIEU'));
}

function getSelectedHousehold() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getActiveSheet();
  if (!sh || sh.getName() !== 'DU_LIEU') {
    throw new Error('Vui lòng chọn một dòng hồ sơ trong sheet DU_LIEU.');
  }
  const row = sh.getActiveRange().getRow();
  if (row < 2) throw new Error('Vui lòng chọn một dòng dữ liệu, không chọn dòng tiêu đề.');

  const v = sh.getRange(row, 1, 1, 41).getDisplayValues()[0];
  return {
    row: row,
    maHo: v[1],
    name: v[2],
    gender: v[3],
    birthYear: v[4],
    ethnicity: v[5],
    education: v[6],
    phone: v[7],
    unit: v[8],
    address: v[9],
    year: v[10],
    total: v[26],
    selfAssessment: v[27],
    status: v[34],
    opinion: v[35],
    reviewDate: v[36],
    reviewer: v[37],
    adminNote: v[38],
    support: [v[28],v[29],v[30],v[31],v[32],v[33]].filter(Boolean),
    criteria: v.slice(15,26)
  };
}

function saveReview(data) {
  if (!data || !data.row) throw new Error('Thiếu dòng dữ liệu.');
  const allowed = ['Chờ bình xét','Đã xác nhận đạt','Đã xác nhận chưa đạt','Cần bổ sung thông tin'];
  if (!allowed.includes(data.status)) throw new Error('Trạng thái không hợp lệ.');

  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName('DU_LIEU');
  const row = Number(data.row);
  if (row < 2 || row > sh.getLastRow()) throw new Error('Dòng dữ liệu không hợp lệ.');

  sh.getRange(row, 35).setValue(data.status);
  sh.getRange(row, 36).setValue(String(data.opinion || '').trim());
  sh.getRange(row, 37).setValue(new Date());
  sh.getRange(row, 38).setValue(String(data.reviewer || '').trim());
  sh.getRange(row, 39).setValue(String(data.adminNote || '').trim());

  SpreadsheetApp.flush();
  return {ok:true,row:row,status:data.status};
}
