# Build stage
FROM node:22.1.0 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve static with nginx
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]