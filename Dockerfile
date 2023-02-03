FROM node:19-alpine

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/ui

ENV NODE_ENV=production

RUN apk add --no-cache tzdata && \
  cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
  echo "Asia/Bangkok" > /etc/timezone

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

COPY ./src .

COPY ./package.json .

RUN pnpm i --prod


EXPOSE 3000

CMD ["node", "./index.js"]