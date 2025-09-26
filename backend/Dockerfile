# backend/Dockerfile
FROM node:18

WORKDIR /app

# Copiar package.json y package-lock.json para aprovechar cache de Docker
COPY package*.json ./

# Instalar dependencias (en modo production si quieres)
RUN npm install

# Copiar el resto del código
COPY . .

# Variable por defecto (opcional)
ENV PORT=4000

# Puerto que expone la aplicación dentro del contenedor
EXPOSE 4000

# Comando para iniciar la app (asegúrate que npm start arranque tu servidor)
CMD ["npm", "start"]