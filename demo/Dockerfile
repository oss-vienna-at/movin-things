FROM node:16-alpine as builder

WORKDIR /src
COPY . .
RUN npm install && npm run build

FROM nginx:1.19-alpine

COPY --from=builder /src/www /usr/share/nginx/html
COPY ./src/vmdev9032_flights.html /usr/share/nginx/html
COPY --from=builder /src/dist /usr/share/nginx/html/component

EXPOSE 80

RUN apk update && apk upgrade
