FROM node:20-alpine

WORKDIR /simple_cms_nodejs/server

COPY src/server/package*.json ./

RUN npm install --omit=dev

COPY src/server ./

CMD ["node", "index.js"]