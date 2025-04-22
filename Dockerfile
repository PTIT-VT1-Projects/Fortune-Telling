FROM node:20.11.1

RUN sudo apt-get install nginx

WORKDIR /html
COPY ./dist .
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
