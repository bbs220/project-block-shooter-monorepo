# use a lightweight Node image
FROM node:20-alpine

# set the working directory inside the container
WORKDIR /app

# copy the root package.json files (for workspaces)
COPY package*.json ./

# copy the newly renamed folders
COPY packages/shared ./packages/shared
COPY apps/appServer ./apps/appServer
COPY apps/appClient ./apps/appClient

# install all dependencies across the monorepo
RUN npm install

# build the client (CRITICAL: Express needs the dist folder!)
RUN npm run build -w appClient

# build the server
RUN npm run build -w appServer

# open the exact ports (UDP is critical for Geckos!)
EXPOSE 9208/udp
EXPOSE 9208/tcp

# boot the server
CMD ["npm", "run", "start", "-w", "appServer"]