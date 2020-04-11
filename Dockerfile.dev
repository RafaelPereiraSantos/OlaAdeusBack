FROM node:alpine

RUN mkdir app
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]