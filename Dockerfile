# Этап сборки
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD if [ -f "./dist/index.js" ]; then node dist/index.js; else echo "ERROR: index.js not found in dist"; ls -R ./dist; exit 1; fi