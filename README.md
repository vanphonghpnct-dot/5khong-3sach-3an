# 5 Không · 3 Sạch · 3 An — Hội LHPN TP Cần Thơ

Website hỗ trợ hộ gia đình tự rà soát tiêu chuẩn “5 không, 3 sạch, 3 an” theo tiêu chí 6.4 giai đoạn 2026–2030.

## Phiên bản V2
- Giao diện responsive, ưu tiên điện thoại.
- Sử dụng logo Hội LHPN Việt Nam do Hội LHPN TP Cần Thơ cung cấp.
- Danh sách 103 xã/phường được đưa vào phiếu.
- Phiếu Mẫu số 01 được số hóa: thông tin hộ, nhóm hộ, 11 tiêu chuẩn, ghi chú, nhu cầu hỗ trợ.
- Tự tổng hợp kết quả 5 Không / 3 Sạch / 3 An.
- Kết quả hiện tại được lưu tạm trên trình duyệt (localStorage) để hiển thị trang kết quả.

## Chưa triển khai ở V2
- Gửi dữ liệu về Google Sheets/Apps Script.
- Quy trình bình xét/xác nhận của Trưởng ấp/khu vực và cấp xã.
- Dashboard quản trị và báo cáo định kỳ.

## Nguồn nghiệp vụ
- Hướng dẫn số 60/HD-BTV ngày 17/7/2026 của Ban Thường vụ Hội LHPN TP Cần Thơ.
- Phụ lục kèm Hướng dẫn số 53/HD-ĐCT ngày 11/5/2026 của Đoàn Chủ tịch Trung ương Hội LHPN Việt Nam.


## Google Sheet dữ liệu
https://docs.google.com/spreadsheets/d/1ayDUFn20XHUjjSGkDA6OhI9jd1Z9kOq9KVVWB4bpQWE/edit

Bảng gồm 3 sheet:
- `DU_LIEU`: dữ liệu hộ gia đình và kết quả 11 tiêu chuẩn.
- `DANH_MUC`: 103 xã/phường và danh mục 11 tiêu chuẩn.
- `DASHBOARD`: chỉ số tổng hợp và thống kê theo xã/phường.

Mã Apps Script nằm tại `apps-script/Code.gs`.
