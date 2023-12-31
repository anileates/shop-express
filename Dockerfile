FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build
WORKDIR /usr/src/app/build
EXPOSE 3000
CMD ["node", "index.js"]