# Etapa 1: build de React
FROM node:18 as build

WORKDIR /app

# Copiamos package.json primero para aprovechar caché
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# ⚙️ Copiamos el archivo config.js para incluirlo en el build final
COPY public/config.js public/config.js

# Build de producción
RUN npm run build

# Etapa 2: servidor Nginx
FROM nginx:alpine

# Copiar el resultado del build
COPY --from=build /app/build /usr/share/nginx/html

# Copiar tu configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]