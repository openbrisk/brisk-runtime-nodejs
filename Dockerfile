FROM node:9-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY ./src .
RUN npm install && npm cache clean --force

EXPOSE 8080

ENTRYPOINT [ "node" ]
CMD [ "server.js" ]