FROM node:18-alpine

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

EXPOSE 8000

RUN yarn build

CMD ["yarn", "start:prod"]
