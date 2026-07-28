# Use a lightweight Node image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the root package.json files (for workspaces)
COPY package*.json ./

# Copy only the server and the shared logic (ignore the client)
COPY packages/shared ./packages/shared
COPY apps/appServer ./apps/appServer

# Install all dependencies (npm workspaces will auto-link the shared folder)
RUN npm install

# Build the server using tsup
RUN npm run build -w appServer

# Open the exact port Geckos uses (UDP is critical!)
EXPOSE 9208/udp
EXPOSE 9208/tcp

# Boot the server
CMD ["npm", "run", "start", "-w", "appServer"]