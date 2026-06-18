FROM nginx:1.29.3-alpine-slim
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html