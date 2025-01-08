# Sử dụng Node.js Alpine LTS version để giảm kích thước container
FROM node:18-alpine

# Cài đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json trước để tận dụng Docker cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Cài đặt thư viện thêm nếu cần
RUN npm install --save @types/bcryptjs

# Mở cổng cho ứng dụng Node.js
EXPOSE 6268

# Chạy ứng dụng
CMD ["npm", "run", "start"]
