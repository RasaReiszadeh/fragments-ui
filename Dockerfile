FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use nginx
FROM nginx:alpine

# Remove default config
RUN rm -rf /usr/share/nginx/html/*

# Copy build
COPY --from=builder /app/dist /usr/share/nginx/html

# Fix: ensure index.html is served
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]