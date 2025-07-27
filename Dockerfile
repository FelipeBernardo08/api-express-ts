FROM node:23.11-alpine

RUN apk add --no-cache mysql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3030

RUN chmod +x /usr/src/app/init.sh

CMD ["sh", "/usr/src/app/init.sh"]
