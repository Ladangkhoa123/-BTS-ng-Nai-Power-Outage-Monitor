# XÂY DỰNG WEBSITE THEO DÕI LỊCH CÚP ĐIỆN CÁC TRẠM BTS ĐỒNG NAI

Bạn hãy đóng vai trò là một lập trình viên Full-stack có kinh nghiệm về Google Apps Script, JavaScript, HTML, CSS và xử lý dữ liệu API.

Tôi muốn xây dựng một website có tên **BTS Đồng Nai – Power Outage Monitor**, mục đích theo dõi lịch cúp điện ảnh hưởng đến các trạm BTS của tôi tại tỉnh Đồng Nai.

## 1. Công nghệ sử dụng

- Frontend: HTML5, CSS3, JavaScript.
- Backend: Google Apps Script.
- Database: Google Sheets.
- Nguồn dữ liệu: Website lịch ngừng giảm cung cấp điện EVNSPC.
- Sử dụng Google Apps Script Web App để triển khai website.
- Không sử dụng Node.js hoặc máy chủ riêng nếu không thực sự cần thiết.

## 2. Dữ liệu đầu vào

Tôi có file Excel BTS_BH.xlsx gồm 2 sheet:

Sheet 1: Danh sách trạm BTS:
- tramvt
- ten_csht
- Ten gợi nhớ
- latitude
- longitude
- ma_dienke
- loai_csht

Sheet 2: Danh sách máy phát điện:
- Chứa thông tin trạm, thiết bị máy phát và tọa độ.
- Chú ý kiểm tra dữ liệu latitude và longitude vì có khả năng hai cột đang bị đảo vị trí.

Hãy đọc cấu trúc file Excel thực tế trước khi viết code. Không tự ý đổi tên cột hoặc làm mất dữ liệu.

## 3. Lấy lịch cúp điện tự động

Hãy nghiên cứu cách lấy dữ liệu từ website lịch cúp điện EVNSPC.

Yêu cầu:
- Phân tích các request Fetch/XHR.
- Xác định API thực tế, phương thức GET hoặc POST.
- Xác định tham số phân trang, bộ lọc tỉnh và thời gian.
- Lấy toàn bộ dữ liệu, không chỉ trang đầu tiên.
- Chỉ lấy dữ liệu thuộc tỉnh Đồng Nai.
- Theo dõi lịch trong 7 ngày tiếp theo.
- Tự động cập nhật dữ liệu mỗi ngày.
- Lưu thời điểm cập nhật gần nhất.
- Xử lý lỗi khi website nguồn không truy cập được.
- Không được tự tạo dữ liệu giả để thay thế dữ liệu thật.
- Không giả định URL trang giao diện là API JSON.
- Nếu không thể truy cập hoặc xác định API, hãy tạo module kết nối chờ cấu hình và hướng dẫn tôi cung cấp API.

Các trường dữ liệu cần lấy:
- Province
- District
- Mã khách hàng
- Site ID
- Địa điểm
- Thời gian bắt đầu
- Thời gian dự kiến đóng điện trở lại
- Lý do
- Trạng thái lịch cúp điện

## 4. Đối chiếu lịch cúp điện với BTS

Ưu tiên phương pháp:

Mức 1 – Khớp chính xác:
- So sánh Mã khách hàng của lịch cúp điện với ma_dienke trong file BTS.
- Nếu trùng mã, đánh dấu khớp chính xác.
- Hiển thị tên trạm, mã trạm và thông tin lịch cúp điện.

Mức 2 – Đối chiếu vị trí:
- Nếu không tìm thấy mã điện kế trùng khớp, xem xét địa chỉ và tọa độ.
- Nếu có tọa độ địa điểm cúp điện, tính khoảng cách đến từng BTS.
- Phân nhóm khoảng cách: dưới 500m, 500m–1km, 1–3km.
- Nếu chỉ có tên phường, xã hoặc đường mà không có tọa độ chính xác, chỉ đánh dấu cần xác minh.
- Không được kết luận trạm chắc chắn mất điện chỉ vì nằm cùng khu vực.

Phải hiển thị rõ:
- Khớp chính xác mã điện kế.
- Có khả năng ở gần khu vực cúp điện.
- Chưa đủ dữ liệu xác minh.

## 5. Giao diện website

Thiết kế giao diện chuyên nghiệp, hiện đại, dễ nhìn, tương thích máy tính và điện thoại.

Trang Dashboard gồm:

- Tổng số trạm BTS.
- Tổng số lịch cúp điện Đồng Nai.
- Số trạm khớp chính xác.
- Số trạm cần xác minh.
- Lịch cúp điện hôm nay.
- Lịch cúp điện trong 7 ngày tới.
- Thời điểm đồng bộ dữ liệu gần nhất.

Bảng theo dõi gồm:
- Mã BTS.
- Tên trạm.
- Địa chỉ trạm.
- Mã điện kế.
- Site ID.
- Khu vực cúp điện.
- Ngày cúp điện.
- Giờ bắt đầu.
- Giờ dự kiến có điện lại.
- Lý do.
- Mức độ khớp.
- Khoảng cách đến trạm nếu tính được.

Chức năng:
- Tìm kiếm trạm BTS.
- Lọc theo ngày.
- Lọc theo huyện/phường hoặc khu vực có trong dữ liệu.
- Lọc theo trạng thái.
- Sắp xếp theo thời gian cúp điện.
- Xem chi tiết từng trạm.
- Xuất dữ liệu Excel hoặc CSV.
- Nút cập nhật dữ liệu thủ công.

## 6. Google Apps Script

Tổ chức backend thành các module rõ ràng:

- doGet(): hiển thị website.
- getDashboardData(): lấy dữ liệu tổng quan.
- getPowerOutages(): lấy lịch cúp điện.
- getBTSStations(): lấy danh sách BTS.
- matchOutagesWithBTS(): đối chiếu dữ liệu.
- syncOutages(): đồng bộ lịch cúp điện.
- createDailyTrigger(): tạo lịch tự động mỗi ngày.
- exportData(): xuất báo cáo.

Sử dụng CacheService và PropertiesService khi phù hợp.

Không ghi đè hoặc xóa danh sách BTS khi đồng bộ lịch cúp điện.

## 7. Cấu trúc thư mục

Hãy tổ chức dự án rõ ràng:

BTS_DONGNAI/
├── Code.gs
├── Config.gs
├── ApiService.gs
├── BTSService.gs
├── MatchingService.gs
├── DashboardService.gs
├── TriggerService.gs
├── ExportService.gs
├── Index.html
├── CSS.html
├── JavaScript.html
├── README.md
└── data/
    └── BTS_BH.xlsx

Nếu sử dụng clasp để đồng bộ với Google Apps Script, hãy tạo thêm cấu hình cần thiết và hướng dẫn cài đặt.

## 8. Quy tắc làm việc

- Trước tiên hãy kiểm tra toàn bộ file trong thư mục dự án.
- Đọc file BTS_BH.xlsx trước khi thiết kế cơ sở dữ liệu.
- Lập kế hoạch và cấu trúc dự án trước.
- Sau đó mới viết code.
- Không viết tất cả chức năng vào một file duy nhất.
- Không sử dụng dữ liệu giả khi triển khai chính thức.
- Không tự ý thay đổi dữ liệu gốc.
- Có xử lý lỗi và ghi log.
- Kiểm tra từng module trước khi kết nối toàn bộ.
- Nếu thiếu API, ID Google Sheets hoặc thông tin cần thiết, hãy yêu cầu tôi cung cấp, không tự bịa.
- Hướng dẫn tôi từng bước cách chạy, cấp quyền và Deploy Google Apps Script Web App.

## 9. Kết quả cuối cùng

Tôi cần một website thực sự hoạt động, có thể:
1. Tự động lấy lịch cúp điện Đồng Nai từ nguồn dữ liệu thực tế.
2. Đối chiếu lịch cúp điện với danh sách BTS của tôi.
3. Hiển thị các trạm có khả năng bị ảnh hưởng.
4. Cập nhật tự động mỗi ngày.
5. Có thể mở website bằng một đường link trên máy tính và điện thoại.

Bắt đầu bằng việc kiểm tra file dự án và file Excel. Hãy báo cho tôi biết những thông tin còn thiếu trước khi triển khai phần kết nối API.