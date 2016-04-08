FROM node:5.10.0

COPY . /data

WORKDIR /data

RUN env > ORIG_ENVIRONMENT
RUN . ./ENVIRONMENT
RUN . ./ORIG_ENVIRONMENT
CMD [ "node", "index.js" ]
