FROM node:20-alpine

WORKDIR /simple_cms_nodejs/client

COPY src/client/package*.json ./

RUN npm install

COPY src/client/ ./

CMD ["npm", "run", "dev", "--",  "--host"]
