FROM node:20.11.1

RUN apt-get update && apt-get install -y nginx

WORKDIR /var/www/html
COPY ./dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
