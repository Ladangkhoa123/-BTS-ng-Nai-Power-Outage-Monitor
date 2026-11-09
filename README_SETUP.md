# Hướng dẫn triển khai

## 1. Chuẩn bị Google Sheets

Import `BTS_BH.xlsx` vào một Google Spreadsheet. Giữ nguyên dữ liệu và tên cột. Sheet đầu tiên phải có các cột thực tế: `STT`, `tramvt`, `ten_csht`, `Ten gợi nhớ`, `5G`, `latitude`, `longitude`, `ma_dienke`, `loai_csht`, `Pin`, `cập nhật máy nổ`. Sheet máy phát có `Mã trạm`, `lat`, `long`; dữ liệu tọa độ của file đang đảo nhãn, nên mã nguồn dùng tọa độ BTS từ sheet đầu tiên và không sửa file gốc.

## 2. Cấu hình Apps Script

Mở Apps Script, tạo các file `.gs` và `.html` theo thư mục này. Vào **Project Settings → Script properties**, thêm `SPREADSHEET_ID` với ID của Google Spreadsheet. Không đặt `EVNSPC_API_URL` cho tới khi xác minh được request XHR/fetch thật của trang EVNSPC.

Sau đó chạy `createDailyTrigger()` một lần để tạo lịch đồng bộ hằng ngày. Lần chạy đầu tiên cần cấp quyền đọc Sheets và gọi URL.

## 3. API EVNSPC

Ứng dụng không đoán API từ URL giao diện. Khi có endpoint thật, đặt `EVNSPC_API_URL` và điều chỉnh `normalizeOutages_()` theo JSON thực tế. Các trường cần ánh xạ gồm tỉnh, huyện, mã khách hàng, Site ID, địa điểm, thời gian bắt đầu, thời gian khôi phục, lý do, trạng thái và tọa độ.

## 4. Deploy

Deploy → New deployment → Web app; chọn **Execute as: Me** và quyền truy cập phù hợp. Mở URL Web app để sử dụng trên máy tính hoặc điện thoại.

## 5. Xem giao diện trên máy tính

Lỗi `localhost:8080 refused to connect` nghĩa là chưa khởi động máy chủ preview. Trong thư mục dự án chạy:

```powershell
node server.mjs
```

Sau đó mở `http://localhost:8080`. Preview cục bộ chỉ kiểm tra giao diện; dữ liệu thật vẫn cần mở bằng URL Web App sau khi cấu hình Google Sheets.
