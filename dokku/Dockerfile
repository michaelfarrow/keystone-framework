FROM node:5.11.1

COPY src /app
COPY dokku/nginx.conf.sigil /app/nginx.conf.sigil
COPY dokku/CHECKS /app/CHECKS

EXPOSE 80

WORKDIR /app

ENV NODE_ENV production

CMD [ "node", "index" ]
