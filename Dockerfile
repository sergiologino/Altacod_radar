FROM node:24-alpine AS build
ARG VITE_SITE_URL=https://altacod.com
ENV VITE_SITE_URL=$VITE_SITE_URL
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
