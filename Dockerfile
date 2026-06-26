FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml .npmrc ./
RUN corepack enable && corepack prepare pnpm@8.14.1 --activate && pnpm i --no-frozen-lockfile
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_AUTH_API_BASE_URL
ARG VITE_BASE_URL
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
