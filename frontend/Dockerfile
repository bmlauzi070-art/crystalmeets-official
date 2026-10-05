# Frontend image — CRA build served by nginx
FROM node:22-alpine AS build

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

WORKDIR /app

# FIX: Removed yarn.lock from the copy step so the compiler doesn't crash
COPY package.json ./
RUN yarn install

COPY . .
RUN yarn build

# --- runtime ---
FROM nginx:alpine

# SPA-friendly nginx config — fall back to index.html for client-side routes
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location ~* \\.(?:js|css|woff2?|ttf|jpg|jpeg|png|svg|webp|ico)$ {\n\
    expires 30d;\n\
    add_header Cache-Control "public, immutable";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

