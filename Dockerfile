FROM node:20.11.1

WORKDIR /html
COPY ./dist .
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
