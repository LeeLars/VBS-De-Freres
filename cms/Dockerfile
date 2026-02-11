FROM node:18-alpine

WORKDIR /app

COPY cms/package*.json ./
RUN npm install --production

COPY cms/ .

EXPOSE 4000

CMD ["node", "server.js"]
