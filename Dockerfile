FROM node:18-alpine

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/ui

RUN apk update && \
  apk upgrade && \
  apk add --no-cache \
  tzdata && \
  cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
  echo "Asia/Bangkok" > /etc/timezone

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

COPY ./src .

COPY ./package.json .

RUN pnpm i --prod

ENV NODE_ENV === 'production'

EXPOSE 3000

CMD ["node", "./index.js"]