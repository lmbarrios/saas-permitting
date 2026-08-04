FROM node:20-alpine

WORKDIR /app

# Install dependencies first (leverage caching)
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]
