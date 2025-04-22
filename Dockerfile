FROM node:20.11.1

RUN apt-get update && apt-get install -y nginx

WORKDIR /html
COPY ./dist .
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
