FROM node:16

RUN mkdir /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm ci

COPY . /app

ENV NODE_ENV production

EXPOSE 80

CMD ["npm", "start"]
