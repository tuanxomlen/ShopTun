# ---- Stage 1: Build ----
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine AS runner

# Xoá config mặc định, dùng config riêng để React Router (nếu có) hoạt động đúng
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy kết quả build (thư mục dist) từ stage 1 sang thư mục web root của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
