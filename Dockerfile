# Use an official Node.js runtime as the base image
FROM node:iron-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Copy the rest of the application code
COPY src ./src

# Install Prisma Client
RUN pnpm prisma generate

# Build the TypeScript code
RUN pnpm build

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/index.js"]
