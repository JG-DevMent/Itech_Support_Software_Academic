FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=4000
EXPOSE 4000

# Escuchar en todas las interfaces (no solo localhost)
ENV HOST=0.0.0.0

CMD ["npm", "start"]