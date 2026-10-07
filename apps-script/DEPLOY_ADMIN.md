# Triển khai khu quản trị theo tài khoản Google

Khu quản trị dùng chung dự án Apps Script với hệ thống hiện tại nhưng được mở bằng tham số `?admin=1`.

## 1. Cập nhật mã Apps Script
Thêm/cập nhật ba tệp từ thư mục `apps-script` trong GitHub:
- `Code.gs`
- `AdminWeb.gs`
- `AdminWeb.html`

Giữ nguyên các tệp quản trị sidebar hiện có.

## 2. Cấp quyền tài khoản thử nghiệm
Trong Google Sheet, mở tab `TAI_KHOAN_QUAN_TRI` và nhập:
- STT
- Email Gmail
- Họ tên cán bộ
- Đơn vị
- Vai trò: `THANH_PHO` hoặc `CO_SO`
- Trạng thái: `Hoạt động`
- Ngày cập nhật
- Ghi chú

Với vai trò `CO_SO`, tên Đơn vị phải trùng chính xác tên xã/phường trong hệ thống.
Với vai trò `THANH_PHO`, có thể để trống Đơn vị.

## 3. Tạo deployment quản trị riêng
Trong Apps Script:
- Deploy > New deployment
- Type: Web app
- Execute as: User accessing the web app
- Who has access: người dùng có tài khoản Google / phạm vi phù hợp mà giao diện cho phép
- Deploy

Sau khi có URL /exec, mở:
`<URL_DEPLOYMENT>?admin=1`

## 4. Kiểm thử
- Tài khoản THANH_PHO phải xem được hồ sơ của mọi xã/phường.
- Tài khoản CO_SO chỉ được thấy hồ sơ đúng đơn vị đã gán.
- Nếu cố mở/cập nhật hồ sơ ngoài đơn vị, backend phải từ chối.
- Tài khoản không có trong TAI_KHOAN_QUAN_TRI hoặc đang Tạm khóa phải bị từ chối truy cập.

## 5. Nguyên tắc bảo mật
Không chia sẻ Google Sheet trung tâm cho cán bộ cơ sở. Cán bộ cơ sở chỉ sử dụng URL khu quản trị.
