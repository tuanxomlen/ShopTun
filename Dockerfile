
# Giai đoạn 1: Build ứng dụng React + Vite
FROM node:20-alpine AS build

WORKDIR /app

# Sao chép file quản lý thư viện
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Sao chép source code
COPY . .

# Build giao diện thành thư mục dist
RUN npm run build

# Giai đoạn 2: Chạy website bằng Nginx
FROM nginx:alpine

# Cấu hình Nginx cho React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Đưa website đã build vào Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Container phục vụ website qua cổng 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]