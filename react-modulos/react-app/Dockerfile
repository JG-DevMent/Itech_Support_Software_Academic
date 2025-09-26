# react-modulos/react-app/Dockerfile
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage final: servir build estático con nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Nginx sirve en el puerto 80 dentro del contenedor
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]