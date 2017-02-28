
FROM node:boron

ENV APP_DIR=/srv/app

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY package.json $APP_DIR/package.json

RUN npm install webpack -g
RUN npm install --silent

COPY . $APP_DIR
RUN webpack

EXPOSE 8000

CMD ["npm","start"]

