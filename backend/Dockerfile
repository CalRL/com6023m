FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./

# Remove nodemon eventually, when builds suceed
RUN npm install -g nodemon tsx

RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]
