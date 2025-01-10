# Sử dụng Node.js 18
FROM node:18

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy tất cả mã nguồn vào container
COPY . .

# Build ứng dụng TypeScript
RUN npm run build

# Mở port mà ứng dụng đang lắng nghe
EXPOSE 6268

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
