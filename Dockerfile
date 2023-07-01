FROM node:12
COPY . /app
RUN npm install
CMD "npm" "start"