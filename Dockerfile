FROM node:20.11.1

RUN apt-get update && apt-get install -y nginx

WORKDIR /var/www/html
COPY ./dist .
CMD ["nginx", "-g", "daemon off;"]
