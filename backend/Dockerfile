# =========================
# Etapa 1: dependencias
# =========================
FROM node:18-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# =========================
# Etapa 2: runtime
# =========================
FROM node:18-alpine

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV PORT=4000
ENV HOST=0.0.0.0

EXPOSE 4000
CMD ["npm", "start"]