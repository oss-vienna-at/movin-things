FROM node:16-alpine

RUN adduser -D -g '' svcuser
WORKDIR /svc
COPY . .
RUN npm install && npm test && npx babel -D -s true -d build src && rm -rf src
RUN apk update && apk upgrade

USER svcuser

CMD date && npm run start-docker
