# Base image with Node.js
FROM node:20

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
COPY tsconfig*.json ./
COPY . .

# Install dependencies
RUN npm install

# Build TypeScript
RUN npm run build

# Expose app port
EXPOSE 3001

# Start the app
CMD ["node", "dist/src/app.js"]