# =========================
# Etapa 1: build React
# =========================
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos package.json primero (cache)
COPY package*.json ./
RUN npm install

# Copiamos todo el código (incluye public/config.js)
COPY . .

# Build de producción
RUN npm run build

# =========================
# Etapa 2: Nginx
# =========================
FROM nginx:alpine

# Copiar build final
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]