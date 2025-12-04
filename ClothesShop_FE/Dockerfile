FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ======= STAGE 2: Serve với Nginx =======
FROM nginx:alpine

# Xoá default config nếu muốn custom
RUN rm /etc/nginx/conf.d/default.conf

# Copy file cấu hình nginx của bạn
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build từ stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]