# Shoptun — Web bán hàng kiểu sàn TMĐT (React) — Bài tập Docker

Shoptun là app demo bán hàng lấy cảm hứng từ giao diện các sàn TMĐT (Shopee-style):
Flash Sale có đếm ngược, badge giảm giá/đã bán/đánh giá sao, danh mục, tìm kiếm,
lọc/sắp xếp, yêu thích, giỏ hàng theo phân loại (màu/size), mã giảm giá, đăng
nhập/đăng ký, thanh toán và lịch sử đơn hàng.

**Lưu ý quan trọng:** đây là app demo phía client, dùng `localStorage` để giả lập
tài khoản / giỏ hàng / yêu thích / đơn hàng — không có backend/database thật.
Không dùng để lưu mật khẩu thật. Mục tiêu là thực hành đóng gói Docker và có một
giao diện bán hàng đủ chuyên nghiệp để trình bày.

## Tính năng chính

- 🔍 Tìm kiếm sản phẩm theo tên (lọc trực tiếp khi gõ)
- 🗂️ Danh mục sản phẩm (chip trên header + ô lớn ở trang chủ)
- ⚡ Flash Sale kèm đồng hồ đếm ngược và thanh tiến độ đã bán
- ↕️ Sắp xếp: phổ biến / mới nhất / giá tăng dần / giá giảm dần
- ⭐ Đánh giá sao, số lượt đánh giá, số lượt đã bán trên mỗi sản phẩm
- ❤️ Danh sách yêu thích (lưu localStorage)
- 🎨 Chọn phân loại (màu sắc, kích cỡ) ở trang chi tiết sản phẩm
- 🛒 Giỏ hàng theo từng phân loại, chỉnh số lượng riêng
- 🏷️ Áp mã giảm giá khi thanh toán (`SALE10`, `FREESHIP`, `SALE50K`)
- 🔑 Đăng ký / đăng nhập (mock, bắt buộc để vào trang thanh toán)
- 📦 Lịch sử đơn hàng ở trang "Đơn hàng của tôi"
- 🔔 Thông báo dạng toast khi thêm giỏ hàng thành công

## Cấu trúc project

```
sales-app/
├── Dockerfile
├── nginx.conf
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── App.jsx / App.css
    ├── utils.js
    ├── data/
    │   ├── products.js     # danh sách sản phẩm, danh mục, flash sale
    │   └── vouchers.js      # mã giảm giá mock
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── CartContext.jsx
    │   ├── WishlistContext.jsx
    │   └── ToastContext.jsx
    ├── components/
    │   ├── Header.jsx
    │   ├── ProductCard.jsx
    │   ├── Stars.jsx
    │   ├── CountdownTimer.jsx
    │   └── RequireAuth.jsx
    └── pages/
        ├── Home.jsx
        ├── ProductDetail.jsx
        ├── Cart.jsx
        ├── Wishlist.jsx
        ├── Login.jsx / Register.jsx
        ├── Checkout.jsx
        ├── OrderSuccess.jsx
        └── Orders.jsx
```

## 1. Chạy thử ở chế độ dev (không cần Docker)

```bash
npm install
npm run dev
# mở http://localhost:5173
```

## 2. Build image từ Dockerfile

```bash
docker build -t shoptun:latest .
docker images | grep shoptun
```

## 3. Chạy container từ image vừa tạo

```bash
docker run -d --name shoptun-app -p 8080:80 shoptun:latest
# mở http://localhost:8080
docker ps
docker logs shoptun-app
```

## 4. Quản lý container (dừng, xoá)

```bash
docker stop shoptun-app
docker ps -a
docker rm shoptun-app
docker rmi shoptun:latest   # nếu muốn xoá luôn image
```

## 5. Đẩy image lên Docker Hub

```bash
docker login
docker tag shoptun:latest <your-dockerhub-username>/shoptun:latest
docker push <your-dockerhub-username>/shoptun:latest
```

Chạy lại từ image trên Docker Hub:

```bash
docker run -d --name shoptun -p 8080:80 <your-dockerhub-username>/shoptun:latest
```

## Ghi chú kỹ thuật

- Image dùng **multi-stage build**: stage 1 (`node:18-alpine`) build React ra file
  tĩnh, stage 2 (`nginx:alpine`) chỉ chứa Nginx + file tĩnh → image nhẹ.
- `nginx.conf` có `try_files ... /index.html` để React Router hoạt động đúng khi
  refresh trang ở URL con (vd `/cart`, `/checkout`, `/product/3`).
- Font chữ **Be Vietnam Pro** tải qua Google Fonts trong `index.html`.
