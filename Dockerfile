FROM node:12-alpine3.15
COPY . .
RUN npm install
CMD "node" "./bin/www"