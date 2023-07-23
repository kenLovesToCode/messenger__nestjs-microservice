FROM node:18-alpine

WORKDIR /usr/src/presence

COPY package.json .

RUN npm install

EXPOSE 6000

COPY . .