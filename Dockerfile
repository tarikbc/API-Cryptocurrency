FROM node:8.9-alpine
LABEL maintainer "Tarik Caramanico <tarikcaramanico@gmail.com"

ENV NODE_ENV production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json /tmp/app/
RUN cd /tmp/app \
    && time npm install --verbose \
    && npm cache clean --force --verbose
COPY . /usr/src/app
RUN mv -f /tmp/app/node_modules /usr/src/app

EXPOSE 3000

CMD ["npm", "start"]
