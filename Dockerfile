# Этап сборки
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап запуска
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
# Копируем скомпилированные файлы из папки dist
COPY --from=builder /app/dist ./dist
# Если у вас есть статические файлы или другие папки, скопируйте и их

EXPOSE 3000
CMD ["node", "dist/index.js"]