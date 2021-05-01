FROM python:3 as mkdocs
RUN pip install mkdocs

FROM python:3 as builder

WORKDIR /src
COPY --from=mkdocs /usr/local /usr/local
COPY . .
RUN mkdocs build

FROM nginx:1.19-alpine
COPY --from=builder /src/site /usr/share/nginx/html
EXPOSE 80
RUN apk update && apk upgrade
